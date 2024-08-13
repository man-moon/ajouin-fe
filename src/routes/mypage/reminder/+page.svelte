<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { reminderSnapshotStore } from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';

</script>

<BackAppbar title="리마인드" />

<main>
	<div class="flex items-center justify-between p-4">
		<h3>
			<div class="text-gray-700">리마인드 목록</div>
		</h3>
	</div>
	{#each $reminderSnapshotStore as reminder, idx}
		<NoticeCard notice={reminder} />
		{#if idx != $reminderSnapshotStore.length - 1}
			<hr />
		{/if}
	{/each}
</main>

<div class="h-24" />
