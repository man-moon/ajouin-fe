<script lang="ts">
	import BackAppbar from '$lib/BackAppbar.svelte';
	import { type Editor, EditorTheme, SvelteEditor } from '@nextlint/svelte';
	import Icon from '$lib/Icon.svelte';
	import { ACCESS_TOKEN, toastMessage } from '$lib/stores';
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    const doc = $page.params.doc

	let isHovered = false;

	let category;
	let agreeTerm = false;

	let categories = [];

	let editor: Editor;

	let title= '';
	let content = '';
	let vanillaContent = '';

    onMount(async() => {
        const accessToken = $ACCESS_TOKEN || localStorage.getItem('h5prc2wcOyaKvGNQZZKiS');
        if (accessToken) {
			$ACCESS_TOKEN = accessToken;
			const categoryResponse = await fetch('/api/wiki/category', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if(categoryResponse.ok) {
				const data = await categoryResponse.json();
				data.forEach(element => {
					categories.push(element.name);
				});
				categories = categories;
			} else {
				toastMessage.set('카테고리 목록을 불러오는데 실패했어요.');
			}

			await fetch(`/api/wiki?doc=${doc}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			})
				.then((documentResponse) => documentResponse.json())
				.then((data) => {
					category = data.category.name;
					title = data.title;
					content = data.content;
				});
		} else {
            toastMessage.set('로그인이 필요합니다.');
            goto('/login');
        }
    })

	const submitPromt = async (prompt: string) => {
		const response = await fetch('/api/gpt', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: prompt })
		});
		if (response.ok) {
			const data = await response.json();
			return data.result;
		}
	};

	const handleUpload = async (file: File) => {
		// handle upload here
		const blob = new Blob([file]);
		const previewUrl = URL.createObjectURL(blob);
		return previewUrl;
	};

	async function localWrite() {
	    const response = await fetch('/api/htmltomd', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({ html: content })
	    });
	    if(response.ok) {
	        const data = await response.json();
	        //서버 로컬 파일 업데이트
	        const fileSavingresult = await fetch('/api/wiki/local', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	            },
	            body: JSON.stringify({ title, content: data.result })
	        })

	        if(fileSavingresult.ok) {
	            fetch('/api/wiki/check_update', {
	                method: 'GET',
	                headers: {
	                    'Content-Type': 'application/json',
	                },
	            })
	        }
	    }
	}

	async function write() {
		localWrite();
		const response = await fetch('/api/wiki', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
                Authorization: $ACCESS_TOKEN
			},
			body: JSON.stringify({ title, content })
		});
        if(response.ok) {
            const data = await response.json();
            goto(`/wiki/${title}`);
        } else {
            toastMessage.set('글 작성에 실패했습니다. 잠시 후, 다시 시도해주세요.');
            goto('/wiki');
        }
	}
</script>

<BackAppbar title="위키 글 작성" />

<main class="p-4">
	<label>
		<div class="relative font-semibold text-gray-700 flex items-center gap-1">
			카테고리
			<span
				role="button"
				tabindex="0"
				class="text-gray-500"
				on:mouseenter={() => (isHovered = true)}
			>
				<Icon icon="help-circle" size={16} />
			</span>
			{#if isHovered}
				<div
					role="alertdialog"
					on:mouseleave={() => (isHovered = false)}
					class="z-30 absolute left-20 bottom-4 p-4 text-sm shadow-md bg-white border rounded-t-lg rounded-br-lg text-gray-500"
				>
					찾으시는 카테고리가 없나요?
					<a href="/wiki/아주위키:카테고리" class="block underline text-blue-500"
						>새 카테고리 만들러가기</a
					>
				</div>
			{/if}
		</div>

		<select
			bind:value={category}
			disabled
			class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
		>
			<option value="" selected disabled hidden>카테고리를 선택해주세요.</option>
			{#each categories as c}
				<option value={c}>{c}</option>
			{/each}
		</select>
	</label>
	<label class="block mt-4">
		<div class="font-semibold text-gray-700">문서 제목</div>
		<input
			disabled
			bind:value={title}
			type="text"
			class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg"
		/>
	</label>

	<div class="mt-4">
		<div class="font-semibold text-gray-700">본문</div>
		<!-- <TextEditor bind:content /> -->
		{#if content}
		<div class="mt-1 h-96 border p-4 rounded-lg border-gray-300">
			<EditorTheme
				override={{
					'--editor-font': 'none',
					'--editor-font-heading': 'none',
					'--editor-font-code': "'Fira Code', monospace",
					'--editor-block-gap': '16px',
					'& .ProseMirror': {
						height: '22rem',
						overflowY: 'auto',
						'& .ProseMirror-selectednode': {
							outline: '2px solid $green200',
							boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
						}
					}
				}}
			>
				<SvelteEditor
					content={content}
					placeholder="AI 어시스턴트 기능을 이용하려면 스페이스 바를 눌러주세요. 또한, /를 통해 명령어를 입력할 수 있습니다."
					onCreated={(createdEditor) => {
						editor = createdEditor;
						content = content;
					}}
					onChange={(nextEditor) => {
						editor = nextEditor;
						content = nextEditor.getHTML();
						vanillaContent = nextEditor.getText();
					}}
					plugins={{
						selectImage: {
							handleUpload,
							unsplash: {
								accessKey: 'UNPLASH_API_KEY'
							}
						},
						gpt: { query: submitPromt }
					}}
				/>
			</EditorTheme>
		</div>
		{/if}
	</div>

	<!-- 약관 동의 -->
	<div class="mt-4">
		<label class="flex items-start">
			<input type="checkbox" class="mt-1" bind:checked={agreeTerm} />
			<span class="ml-2 text-sm text-gray-600">CC BY-NC-SA 2.0 KR 라이센스 약관에 동의하고, 기여한 문서의 URL을 이용하여 저작자 표시를 하는 것으로 충분함에 동의합니다.</span>
		</label>
	</div>
	<div class="h-24" />
</main>

<button
	on:click={write}
	class="{category && agreeTerm && vanillaContent && title
		? 'bg-blue-500'
		: 'bg-gray-300'} fixed bottom-0 text-white py-4 text-lg w-full max-w-4xl"
	disabled={!agreeTerm}
>
	작성하기
</button>
