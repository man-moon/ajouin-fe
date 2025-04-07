<script>
	// Filter 선택 페이지 컴포넌트
	
	export let noticeFilterPage = null;
	export let selectedGeneralFilters = [];
	export let selectedCollegeFilters = [];
	export let selectedDepFilters = [];
	export let getNotices;
	export let onComplete;
	
	// 필터 데이터
	export let generalFilters = [];
	export let collegeFilters = [];
	export let engineeringDepFilters = [];
	export let informationDepFilters = [];
	export let softwareConvergenceDepFilters = [];
	export let naturalSciencesDepFilters = [];
	export let businessDepFilters = [];
	export let humanitiesDepFilters = [];
	export let socialSciencesDepFilters = [];
</script>

{#if noticeFilterPage === '일반공지'}
	<div class="container mx-auto px-4">
		<h3 class="mb-4 mt-4 text-lg font-medium">공지사항을 확인할 포탈을 선택하세요</h3>
		<div class="flex flex-wrap gap-2 pb-20">
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
						class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
						       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
					>
						{filter}
					</label>
				</div>
			{/each}
		</div>
		
		<div class="fixed bottom-0 left-0 w-full border-t bg-background p-4">
			<div class="container mx-auto">
				<button
					on:click={async () => {
						await getNotices();
						onComplete();
					}}
					class="w-full rounded-md bg-primary p-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
				>
					완료
				</button>
			</div>
		</div>
	</div>

{:else if noticeFilterPage === '단과대공지'}
	<div class="container mx-auto px-4">
		<h3 class="mb-4 mt-4 text-lg font-medium">공지사항을 확인할 단과대학을 선택하세요</h3>
		<div class="flex flex-wrap gap-2 pb-20">
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
						class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
						       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
					>
						{filter}
					</label>
				</div>
			{/each}
		</div>
		
		<div class="fixed bottom-0 left-0 w-full border-t bg-background p-4">
			<div class="container mx-auto">
				<button
					on:click={async () => {
						await getNotices();
						onComplete();
					}}
					class="w-full rounded-md bg-primary p-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
				>
					완료
				</button>
			</div>
		</div>
	</div>

{:else if noticeFilterPage === '학과공지'}
	<div class="container mx-auto px-4 pb-20">
		<h3 class="mb-4 mt-4 text-lg font-medium">공지사항을 확인할 학과를 선택하세요</h3>
		
		<!-- 공과대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">공과대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 정보통신대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">정보통신대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 소프트웨어융합대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">소프트웨어융합대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 자연과학대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">자연과학대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 경영대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">경영대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 인문대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">인문대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- 사회과학대학 -->
		<div class="mb-4">
			<h4 class="mb-2 font-medium">사회과학대학</h4>
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
							class="inline-flex cursor-pointer items-center justify-center rounded-full border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
						>
							{filter}
						</label>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="fixed bottom-0 left-0 w-full border-t bg-background p-4">
			<div class="container mx-auto">
				<button
					on:click={async () => {
						await getNotices();
						onComplete();
					}}
					class="w-full rounded-md bg-primary p-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
				>
					완료
				</button>
			</div>
		</div>
	</div>
{/if}
