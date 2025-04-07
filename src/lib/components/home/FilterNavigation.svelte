<script>
	import Icon from '$lib/Icon.svelte';
	import { selectedType } from '$lib/stores';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	
	export let hideHeader = false;
	export let fetchedTypes = [];
	export let noticeFilterPage = null;
	export let onFilterSelect = (type) => {};
</script>

<div class="sticky top-16 z-40 bg-background shadow-sm"
     class:hide-filter-navigation={hideHeader}>
	<div class="container">
		<!-- 필터 버튼 영역 -->
		<div class="flex items-center gap-2 overflow-x-auto py-2 whitespace-nowrap">
			<button
				on:click={() => onFilterSelect('일반공지')}
				class="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm 
				       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
			>
				포탈 공지 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			
			<button
				on:click={() => onFilterSelect('단과대공지')}
				class="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm 
				       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
			>
				단과대 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			
			<button
				on:click={() => onFilterSelect('학과공지')}
				class="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm 
				       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
			>
				학과 선택
				<Icon icon="chevron-down" size={16} />
			</button>
		</div>
		
		<!-- 타입 선택 영역 (모바일용, 태블릿용 - lg 화면 크기 이하에서만 표시) -->
		{#if fetchedTypes.length > 0}
			<div class="lg:hidden border-b-4">
				<ul class="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2">
					{#each fetchedTypes as type, i}
						<li>
							<input
								type="radio"
								bind:group={$selectedType}
								id={"type-" + i}
								name="noticeType"
								value={type}
								class="peer hidden"
							/>
							<label
								for={"type-" + i}
								class="inline-flex cursor-pointer items-center justify-center rounded-full border px-3 py-1.5 text-xs 
								       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
								       text-muted-foreground border-muted transition-colors"
							>
								{type}
							</label>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	.hide-filter-navigation {
		transform: translateY(calc(-100%));
		opacity: 0;
		transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease;
		position: absolute;
		width: 100%;
		pointer-events: none;
	}
	
	div:not(.hide-filter-navigation) {
		transform: translateY(0);
		opacity: 1;
		transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease;
	}
</style>
