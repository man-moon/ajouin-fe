<script>
	import { selectedType } from '$lib/stores';
	import Icon from '$lib/Icon.svelte';
	
	export let fetchedTypes = [];
	export let showTopFixedNotices = false;
	export let hideViewedNotices = false;
</script>

<div class="hidden lg:block sticky top-20 h-fit pt-1 pb-4">
	<!-- 카테고리 타이틀 -->
	<div class="text-sm font-medium text-muted-foreground mb-3 px-2">
		카테고리
	</div>
	
	<div class="flex">
		<!-- 카테고리 목록 -->
		<div class="w-36">
			<nav class="space-y-0.5 border-r border-border/30 pr-2">
				{#if fetchedTypes.length > 0}
					{#each fetchedTypes as type, i}
						<div class="mb-0.5 flex">
							<input
								type="radio"
								bind:group={$selectedType}
								id={"sidebar-type-" + i}
								name="sidebarNoticeType"
								value={type}
								class="peer hidden"
							/>
							<label
								for={"sidebar-type-" + i}
								class="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer
								text-muted-foreground hover:bg-muted/70 transition-colors truncate
								peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-medium
								peer-checked:border-l-2 peer-checked:border-primary peer-checked:pl-[6px]"
							>
								{type}
							</label>
						</div>
					{/each}
				{/if}
			</nav>
		</div>
		
		<!-- 필터 옵션 (눈 아이콘으로 변경) - 오른쪽에 가로로 배치 -->
		<div class="pl-3 flex flex-col space-y-4">
			<button 
				on:click={() => showTopFixedNotices = !showTopFixedNotices}
				class="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none"
				aria-label="상단고정 공지 보기 토글"
			>
				<div class="w-5 h-5 flex items-center justify-center mr-1.5 transition-colors duration-200
					{showTopFixedNotices ? 'text-primary' : 'text-muted-foreground/70'}">
					<Icon icon="eye" size={15} stroke_width={showTopFixedNotices ? 2.5 : 1.8} />
				</div>
				<span class="whitespace-nowrap font-medium">상단고정 공지 보기</span>
			</button>
			
			<button
				on:click={() => hideViewedNotices = !hideViewedNotices}
				class="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none"
				aria-label="읽은 공지 숨기기 토글"
			>
				<div class="w-5 h-5 flex items-center justify-center mr-1.5 transition-colors duration-200
					{hideViewedNotices ? 'text-primary' : 'text-muted-foreground/70'}">
					<Icon icon={hideViewedNotices ? "eye-off" : "eye"} size={15} stroke_width={hideViewedNotices ? 2.5 : 1.8} />
				</div>
				<span class="whitespace-nowrap font-medium">읽은 공지 숨기기</span>
			</button>
		</div>
	</div>
</div>