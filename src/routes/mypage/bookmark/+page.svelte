<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { bookmarkSnapshotStore } from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';

</script>

<BackAppbar title="내 북마크" />

<main>
	<div class="flex items-center justify-between p-4">
		<h3>
			<div class="text-gray-700">북마크 목록</div>
		</h3>
	</div>
	{#each $bookmarkSnapshotStore as bookMark, idx}
		<NoticeCard notice={bookMark} />
		{#if idx != $bookmarkSnapshotStore.length - 1}
			<hr />
		{/if}
	{/each}
</main>

<div class="h-24" />
