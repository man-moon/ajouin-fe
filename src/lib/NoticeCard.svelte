<script>
	import Icon from '$lib/Icon.svelte';
	import { toastMessage, ACCESS_TOKEN } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reminderStore, bookmarkStore, viewedNotices } from '$lib/stores';
	import { onMount } from 'svelte';

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
  
	// 이미 본 공지사항인지 확인
	$: isViewed = $viewedNotices.includes(notice.id);
	
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
	
	const timeAgo = getTimeAgo(notice.createdAt, notice.date);
  
	// 공지사항 클릭 시 확인된 것으로 표시
	function handleClick() {
		viewedNotices.markAsViewed(notice.id);
	}
</script>

<div class="group px-2 sm:px-3 py-3 hover:bg-muted/50 transition-colors duration-200 {isViewed ? 'bg-muted/10' : ''}">
	<div class="grid grid-cols-[1fr,auto] gap-3">
		<div class="min-w-0">
			<a href="/notice/{notice.id}" class="block" on:click={handleClick}>
				<h3 class="text-base font-medium leading-tight flex items-start gap-2 mb-1.5 group-hover:text-primary transition-colors
                    {isViewed ? 'text-muted-foreground/80' : 'text-foreground'}">
					<div class="flex items-center gap-1 flex-shrink-0 mt-0.5">
						{#if notice.isTopFixed}
							<span class="text-primary" aria-label="상단고정 공지">📌</span>
						{/if}
						{#if isViewed}
							<span class="text-primary/80 text-xs bg-primary/10 rounded-full px-1.5 py-0.5 flex items-center">
								<Icon icon="check" size={10} class="mr-0.5" />읽음
							</span>
						{/if}
					</div>
					<span class="break-words">{notice.title}</span>
				</h3>
			</a>
			
			<div class="flex items-center gap-3 text-xs text-muted-foreground">
				{#if getTimeAgo(notice.createdAt, notice.date)}
					<div>{getTimeAgo(notice.createdAt, notice.date)}</div>
				{:else}
					<div class="flex items-center gap-1">
						<Icon icon="calendar" size={12} />
						<span>{notice.createdAt.slice(0, 10)}</span>
					</div>
				{/if}
				
				<div class="flex gap-2">
					{#if notice.isReminded}
						<div class="flex items-center text-green-500" aria-label="알림 설정됨">
							<Icon icon="bell-fill" size={12} />
						</div>
					{/if}
					
					{#if notice.isBookmarked}
						<div class="flex items-center text-primary" aria-label="북마크됨">
							<Icon icon="bookmark-fill" size={12} />
						</div>
					{/if}
				</div>
			</div>
		</div>
		
			<button
				on:click|stopPropagation={() => summaryShow = !summaryShow}
				class="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground 
				       hover:text-primary hover:bg-primary/10 transition-colors self-center"
				aria-label={summaryShow ? "요약 접기" : "요약 펼치기"}
			>
				<div class="{summaryShow ? 'rotate-180' : 'rotate-0'} transition-transform duration-300">
					<Icon icon="chevron-down" size={16} stroke_width={2} />
				</div>
			</button>
	</div>
	
	{#if summaryShow}
		<div transition:slide={{ duration: 250, easing: quintOut, axis: 'y' }} on:click|stopPropagation>
			<div class="h-px w-full bg-muted my-2"></div>
			<div class="p-3 bg-primary/5 rounded-md text-sm text-muted-foreground break-words shadow-sm">
				{@html formatSummary(notice.summary)}
			</div>
		</div>
	{/if}
</div>
