<script>
	import Icon from '$lib/Icon.svelte';
	import { browser } from '$app/environment';
	import { fade, scale, slide } from 'svelte/transition';
	import { selectedType } from '$lib/stores';
	
	export let hideHeader = false;
	export let noticeFilterPage = null;
	export let onFilterSelect = (type) => {};
	
	// 필터 데이터 (main 페이지에서 전달받음)
	export let fetchedTypes = [];
	export let generalFilters = [];
	export let collegeFilters = [];
	export let engineeringDepFilters = [];
	export let informationDepFilters = [];
	export let softwareConvergenceDepFilters = [];
	export let naturalSciencesDepFilters = [];
	export let businessDepFilters = [];
	export let humanitiesDepFilters = [];
	export let socialSciencesDepFilters = [];
	
	// 선택된 필터 (양방향 바인딩)
	export let selectedGeneralFilters = [];
	export let selectedCollegeFilters = [];
	export let selectedDepFilters = [];
	export let getNotices;
	
	// 화면 크기 추적용 변수
	let isDesktop = false;
	// 팝업 상태 관리 변수
	let showPopup = false;
	let activeFilterType = '';
	
	// 브라우저 환경에서만 실행되는 코드
	if (browser) {
		// 초기 로드 시 화면 크기 확인
		isDesktop = window.innerWidth >= 1024; // 1024px 이상을 데스크탑으로 간주 (lg 브레이크포인트)
		
		// 화면 크기 변경 감지 리스너
		window.addEventListener('resize', () => {
			isDesktop = window.innerWidth >= 1024;
		});
	}
	
	// 필터 선택 핸들러
	function handleFilterClick(type) {
		if (isDesktop) {
			showPopup = true;
			activeFilterType = type;
		} else {
			// 모바일에서는 기존 방식으로 페이지 전환
			onFilterSelect(type);
		}
	}
	
	// 팝업 닫기 핸들러
	function closePopup() {
		showPopup = false;
		activeFilterType = '';
	}
	
	// 외부 클릭으로 팝업 닫기
	function handleClickOutside(event) {
		const popup = document.getElementById('filter-popup');
		if (popup && !popup.contains(event.target) && !event.target.classList.contains('filter-button')) {
			closePopup();
		}
	}
	
	// 팝업 선택 완료 핸들러
	function handleSelectComplete() {
		// 필터를 적용하고 팝업 닫기
		getNotices && getNotices();
		showPopup = false;
		activeFilterType = '';
	}
</script>

<div class="sticky top-16 z-40 bg-background {hideHeader ? 'transform -translate-y-full' : ''} transition-transform duration-300">
	<div class="container mx-auto">
		<!-- 필터 버튼 영역 -->
		<div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b px-4 py-2">
			<button
				on:click={() => handleFilterClick('일반공지')}
				class="filter-button inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
			>
				포탈 공지 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			
			<button
				on:click={() => handleFilterClick('단과대공지')}
				class="filter-button inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
			>
				단과대 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			
			<button
				on:click={() => handleFilterClick('학과공지')}
				class="filter-button inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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

<!-- 데스크탑 팝업 오버레이 -->
{#if isDesktop && showPopup}
<div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" 
     on:click={handleClickOutside} transition:fade={{ duration: 180 }}>
	<!-- 팝업 컨테이너 -->
	<div id="filter-popup" 
	     class="bg-background rounded-lg border shadow-lg max-w-md w-full overflow-hidden" 
	     transition:scale={{ duration: 220, start: 0.98, opacity: 0 }}>
		
		<div class="flex items-center justify-between px-6 py-4 border-b">
			<h2 class="text-xl font-semibold tracking-tight">
				{#if activeFilterType === '일반공지'}
					포탈 공지 선택
				{:else if activeFilterType === '단과대공지'}
					단과대 선택
				{:else if activeFilterType === '학과공지'}
					학과 선택
				{/if}
			</h2>
			<button 
				on:click={closePopup} 
				class="rounded-full h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				aria-label="닫기"
			>
				<Icon icon="x" size={18} />
			</button>
		</div>
		
		{#if activeFilterType === '단과대공지'}
			<div class="px-6 py-5">
				<p class="text-sm text-muted-foreground mb-5">
					공지사항을 확인할 단과대학을 선택하세요
				</p>
				<div class="flex flex-wrap gap-2 pb-2">
					{#each collegeFilters as filter, i}
						<div>
							<input
								type="checkbox"
								id={"college-" + i}
								value={filter}
								bind:group={selectedCollegeFilters}
								class="peer hidden"
							/>
							<label
								for={"college-" + i}
								class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
								       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
								       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
							>
								{filter}
							</label>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeFilterType === '일반공지'}
			<div class="px-6 py-5">
				<p class="text-sm text-muted-foreground mb-5">
					공지사항을 확인할 포털을 선택하세요
				</p>
				<div class="flex flex-wrap gap-2 pb-2">
					{#each generalFilters as filter, i}
						<div>
							<input
								type="checkbox"
								id={"general-" + i}
								value={filter}
								bind:group={selectedGeneralFilters}
								class="peer hidden"
							/>
							<label
								for={"general-" + i}
								class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
								       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
								       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
							>
								{filter}
							</label>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeFilterType === '학과공지'}
			<div class="px-6 py-5 max-h-[60vh] overflow-y-auto">
				<p class="text-sm text-muted-foreground mb-5">
					공지사항을 확인할 학과를 선택하세요
				</p>
				
				<!-- 공과대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">공과대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each engineeringDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"eng-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"eng-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 정보통신대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">정보통신대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each informationDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"info-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"info-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 소프트웨어융합대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">소프트웨어융합대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each softwareConvergenceDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"sw-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"sw-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 자연과학대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">자연과학대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each naturalSciencesDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"science-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"science-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 경영대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">경영대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each businessDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"business-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"business-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 인문대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">인문대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each humanitiesDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"humanities-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"humanities-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 사회과학대학 -->
				<div class="mb-5">
					<h4 class="text-sm font-medium mb-3 text-foreground">사회과학대학</h4>
					<div class="flex flex-wrap gap-2">
						{#each socialSciencesDepFilters as filter, i}
							<div>
								<input
									type="checkbox"
									id={"social-" + i}
									value={filter}
									bind:group={selectedDepFilters}
									class="peer hidden"
								/>
								<label
									for={"social-" + i}
									class="inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm
									       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
									       text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
								>
									{filter}
								</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
		
		<div class="px-6 py-4 border-t flex justify-end gap-3 bg-muted/30">
			<button 
				on:click={closePopup}
				class="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
			>
				취소
			</button>
			<button 
				on:click={handleSelectComplete}
				class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium shadow-sm transition-all"
			>
				계속
			</button>
		</div>
	</div>
</div>
{/if}
