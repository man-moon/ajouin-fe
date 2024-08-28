<script>
	import Icon from '$lib/Icon.svelte';
	import { toastMessage, ACCESS_TOKEN } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reminderStore, bookmarkStore } from '$lib/stores';

	function formatSummary(summary) {
		return summary
			.split('\n')
			.map((paragraph, index) => `${index + 1}. ${paragraph.trim()}`)
			.join('<br><br>');
	}

	export let notice = {
		createdAt: '',
		fetchId: '',
		id: '',
		isTopFixed: false,
		noticeType: '',
		summary: '',
		title: '',
		isReminded: false,
		isBookmarked: false,
		date: '',
	};

	$: notice.isReminded = $reminderStore.some((reminder) => reminder.noticeId == notice.id);
	$: notice.isBookmarked = $bookmarkStore.some((bookmark) => bookmark.noticeId == notice.id);

	let summaryShow = false;
	function getTimeAgo(createdAt, registrationDate) {
		const now = new Date();
		const date = new Date(createdAt);
		const nineHoursInMillis = 9 * 60 * 60 * 1000;

		const adjustedDate = new Date(date.getTime() + nineHoursInMillis);
		const diffInSeconds = Math.floor((now - adjustedDate) / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInDays > 0) {
			return registrationDate;
		}

		if (diffInHours > 0) {
			return `${diffInHours}시간 전`;;
		}

		if (diffInMinutes > 5) {
			return `${diffInMinutes}분 전`;
		}

		return '방금 전';
	}
</script>

<div
	class="px-4 py-2 flex items-center justify-between {getTimeAgo(notice.createdAt, notice.date)
		? 'border-blue-50'
		: ''}"
>
	<div class="block grow">
		<a href="/notice/{notice.id}">
			<h4 class="text-gray-700 font-normal text-base text-left whitespace-wrap flex items-center">
				{#if notice.isTopFixed}📌{/if}
				{notice.title}
			</h4>
		</a>
		<div class="flex gap-4 items-center mt-2 text-sm text-gray-500">
			{#if getTimeAgo(notice.createdAt, notice.date)}
				<div>{getTimeAgo(notice.createdAt, notice.date)}</div>
			{:else}
				<div class="flex items-center gap-1">
					<Icon icon="calendar" size={12} />
					{notice.createdAt.slice(0, 10)}
				</div>
			{/if}
			<div class="flex gap-2">
				{#if notice.isReminded}
					<div class="flex items-center gap-1 text-green-500">
						<Icon icon="bell-fill" size={12} />
					</div>
				{/if}
				{#if notice.isBookmarked}
					<div class="flex items-center gap-1 text-blue-500">
						<Icon icon="bookmark-fill" size={12} />
					</div>
				{/if}
			</div>
		</div>
	</div>
	<button
		class="flex items-center gap-1"
		on:click={() => {
			summaryShow = !summaryShow;
		}}
	>
		{#if summaryShow}
			<Icon icon="chevron-up" size={24} />
		{:else}
			<Icon icon="chevron-down" size={24} />
		{/if}
	</button>
</div>
{#if summaryShow}
	<div transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}>
		<hr />
		<div class="px-4 py-2 bg-blue-50 text-sm text-gray-600 break-all">
			{@html formatSummary(notice.summary)}
		</div>
	</div>
{/if}
