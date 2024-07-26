<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Nav from '$lib/Nav.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toastMessage, ACCESS_TOKEN, myBookMark } from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';
    import {page} from "$app/stores";
    import { SignIn, SignOut } from "@auth/sveltekit/components"

	let email = '';
	let showLoading = true;
	let step = 'main';

	// onMount(async () => {
	// 	showLoading = true;
	// 	const accessToken = $ACCESS_TOKEN || localStorage.getItem('h5prc2wcOyaKvGNQZZKiS');
	// 	if (accessToken) {
	// 		$ACCESS_TOKEN = accessToken;
	// 		if ($myBookMark.length == 0) {
	// 			await getBookMarks();
	// 		}
	// 	}
	// 	showLoading = false;
	// });

	async function getBookMarks() {
		const response = await fetch('/api/bookmark', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});

		if (response.ok) {
			response.json().then((data) => {
				$myBookMark = data.bookMarks;
				$myBookMark.forEach((bookMark) => {
					bookMark.isBookMarked = true;
				});
			});
		}
		if (!response.ok) {
			response.json().then((data) => {
				if (data.code == 'M002') {
					goto('/login');
				}
				toastMessage.set(data.message);
			});
		}
	}

	async function withdrawal() {
		const response = await fetch('/api/auth/withdrawal', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});
		if (response.ok) {
			localStorage.removeItem('h5prc2wcOyaKvGNQZZKiS');
			$ACCESS_TOKEN = null;
			toastMessage.set('회원탈퇴가 완료되었어요.');
			goto('/login');
		} else {
			response.json().then((data) => {
				toastMessage.set(data.message);
			});
		}
	}

	let contactClassification;
	let content = '';
	async function contact() {
		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			},
			body: JSON.stringify({
				classification: contactClassification,
				content: content
			})
		});
		if (response.ok) {
			toastMessage.set('문의가 접수되었어요.');
			step = 'main';
		} else {
			response.json().then((data) => {
				toastMessage.set(data.message);
			});
		}
	}
</script>

<BackAppbar title="마이페이지" />

<main>
    {#if $page.data.session}
		<div class="w-fit m-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-lg">
			<SignOut />
		</div>
	{/if}
	{#if showLoading}
		<div class="itmes-center mt-24 flex justify-center text-blue-500 z-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				class="animate-spin"
				fill="CurrentColor"
				viewBox="0 0 256 256"
			>
				<path
					d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
				/>
			</svg>
		</div>
	{:else if $ACCESS_TOKEN == null}
		<div class="p-4">
			<div class="mt-24 text-lg flex flex-col items-center text-gray-500">
				<Icon icon="alert-circle" size={64} />
				<div class="mt-20">로그인이 필요한 서비스에요</div>
			</div>
			<div class="flex justify-center">
				<a href="/login"
				class="block text-center text-gray-500 border-b border-gray-500 mt-2 text-sm flex items-center justify-center"
			>
				로그인 하러가기
				<Icon icon="chevron-right" size={16} />
			</a>
			</div>
		</div>
	{:else}
		{#if step == 'withdrawal'}
		<h3 class="pt-4 px-4">
			정말로 회원탈퇴를 하시겠어요?
		</h3>
		<div class="p-4 text-gray-700">
			회원가입 시 입력한 모든 정보가 삭제돼요.<br />
			북마크 목록도 함께 삭제되니, 주의해주세요.
		</div>
		<div class="fixed bottom-0 max-w-4xl w-full flex text-lg">
			<button on:click={()=>{step = 'main'}} class="block w-1/3 py-4 bg-gray-100">
				취소할게요
			</button>
			<button on:click={withdrawal} class="block w-2/3 bg-blue-500 text-white py-4">
				탈퇴할게요
			</button>
		</div>
		{:else if step == 'contact'}
		<form on:submit={contact}>
			<h3 class="p-4">문의하기</h3>

			<section class="mt-4 px-4">
				<h4>분류</h4>
				<select bind:value={contactClassification} class="relative mt-2 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg">
					<option>건의</option>
					<option>버그</option>
					<option>기타</option>
				</select>
			</section>

			<section class="mt-8 px-4">
				<h4>내용</h4>
				<textarea bind:value={content} class="mt-2 block w-full h-48 px-4 py-2 border border-gray-300 rounded-lg" />
				<div class="text-right text-gray-500">({content.length}/1000)</div>
			</section>

			<button type="submit" disabled={content.length <= 0} class="{content.length > 0 ? 'bg-blue-500' : 'bg-gray-300'} block text-white py-4 text-lg w-full fixed bottom-0 w-full max-w-4xl">
				문의하기
			</button>
		</form>
		{:else}
		<!-- 즐겨찾기 한 학교 소식 -->
			<div class="flex items-center justify-between p-4">
				<h3>
					<div class="text-gray-700">북마크 목록</div>
				</h3>
			</div>
			{#each $myBookMark as bookMark, idx}
				{#if idx < 5}
					<NoticeCard notice={bookMark} />
					{#if idx != 4 && idx != $myBookMark.length - 1}
						<hr />
					{/if}
				{/if}
			{/each}
			<a href="/mypage/bookmark" class="block text-sm text-gray-500 py-4 flex items-center justify-center w-full">
				더보기
				<Icon icon="chevron-right" size={16} />
			</a>

			<hr class="h-2 bg-gray-50" />

			<button on:click={() => {
				step = 'contact';
			}} class="p-4 flex items-center justify-between text-gray-700 block w-full">
				문의하기
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</button>
			<button
				on:click={() => {
					localStorage.removeItem('h5prc2wcOyaKvGNQZZKiS');
					$ACCESS_TOKEN = null;
					toastMessage.set('로그아웃 되었어요');
					goto('/login');
				}}
				class="p-4 flex items-center justify-between text-gray-700 block w-full"
			>
				로그아웃
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</button>
			<button
				on:click={() => {
					step = 'withdrawal';
				}}
				class="p-4 flex items-center justify-between text-gray-700 block w-full"
			>
				회원탈퇴
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</button>
			{/if}
	{/if}
</main>

<div class="h-24" />