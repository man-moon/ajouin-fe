<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import { page } from '$app/stores';
	import Icon from '$lib/Icon.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const category = $page.params.category;
	let docs = [];
	let isLoading = true;

	onMount(async () => {
		isLoading = true;
        const response = await fetch(`/api/wiki/doc?category=${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const result = await response.json();
			docs = result.documents;
			isLoading = false;
        } else {
            toastMessage.set("카테고리 목록을 불러오는데 실패했어요.")
			isLoading = false;
        }
	});
</script>

<BackAppbar title="카테고리: {category}" />

{#if !isLoading}
<main class="p-4">
	{#if docs.length === 0}
		<div class="flex flex-col items-center justify-center text-gray-500 my-20">
			<Icon icon="x-circle" size={72} />
			<div class="text-center text-gray-500 mt-4">아직 작성된 문서가 없어요.</div>
			<a href="/wiki/아주위키:작성" class="underline underline-offset-2 text-blue-500">첫 문서 작성하러 가기</a>
		</div>
	{:else}
	<div class="grid grid-cols-3 gap-4">
		{#each docs as doc, i}
			<a href="/wiki/{doc.title}"
				class="rounded-lg bg-white font-semibold overflow-hidden flex items-center p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1"
			>{doc.title}
		</a>
		{/each}
		<button
			class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1"
			on:click={() => {
				goto('/wiki/아주위키:작성');
			}}
		>
			<div class="font-bold flex justify-center"><Icon icon="plus" size={36} /></div>
		</button>
	</div>
	{/if}
</main>
{/if}