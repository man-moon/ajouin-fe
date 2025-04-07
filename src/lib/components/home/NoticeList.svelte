<script>
	import NoticeCard from '$lib/NoticeCard.svelte';
	import Icon from '$lib/Icon.svelte';
	import { viewedNotices } from '$lib/stores';

export let showNotices = [];
export let showTopFixedNotices = false;
export let hideViewedNotices = false;

// 필터링된 공지사항 목록 (읽은 공지사항 숨기기 적용)
$: filteredNotices = hideViewedNotices 
  ? showNotices.filter(notice => !$viewedNotices.includes(notice.id))
  : showNotices;
</script>

<div>
	{#if showNotices.length > 0}
		<div class="notice-container bg-muted/40 rounded-md mb-2 lg:hidden mx-1">
			<div class="flex items-center justify-end gap-3 px-2 py-2.5">
				<button 
					on:click={() => showTopFixedNotices = !showTopFixedNotices}
					class="flex items-center text-sm text-muted-foreground focus:outline-none"
				>
					<div class="w-5 h-5 flex items-center justify-center mr-1 {showTopFixedNotices ? 'text-primary' : 'text-muted-foreground/70'}">
						<Icon icon="eye" size={14} />
					</div>
					<span>상단고정 공지 보기</span>
				</button>
				<button 
					on:click={() => hideViewedNotices = !hideViewedNotices}
					class="flex items-center text-sm text-muted-foreground focus:outline-none"
				>
					<div class="w-5 h-5 flex items-center justify-center mr-1 {hideViewedNotices ? 'text-primary' : 'text-muted-foreground/70'}">
						<Icon icon={hideViewedNotices ? "eye-off" : "eye"} size={14} />
					</div>
					<span>읽은 공지 숨기기</span>
				</button>
			</div>
		</div>
		
		<div class="notice-container lg:pl-0">
			{#if showTopFixedNotices}
				{#each filteredNotices.filter((n) => n.isTopFixed) as notice}
					<div class="border-b border-border/40">
						<NoticeCard notice={notice} />
					</div>
				{/each}
			{/if}
			
			{#each filteredNotices.filter((n) => !n.isTopFixed) as notice}
				<div class="border-b border-border/40">
					<NoticeCard notice={notice} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="notice-container py-12">
			<div class="flex flex-col items-center justify-center text-center space-y-3">
				<div class="rounded-full bg-muted/60 p-6 text-primary/60">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-10 w-10">
						<path d="M6 2v2"></path><path d="M2 6h2"></path><path d="M18 6h2"></path><path d="M10 2v2"></path><path d="M14 2v2"></path><path d="M18 2v2"></path><path d="M16 22v-5.3a18.4 18.4 0 0 0-8 0V22"></path>
						<path d="M20 6v12c0 1.1-.9 2-2 2H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2Z"></path><path d="M10 10h4"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium">공지사항 없음</h3>
				<p class="text-sm text-muted-foreground max-w-md">
					선택한 카테고리에 공지사항이 없습니다. 다른 카테고리를 선택해보세요.
				</p>
			</div>
		</div>
	{/if}
</div>
