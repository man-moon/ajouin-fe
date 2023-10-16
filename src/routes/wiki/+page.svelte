<script>
	import Icon from '$lib/Icon.svelte';
	import Nav from '$lib/Nav.svelte';
	import DocumentCard from '$lib/DocumentCard.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.png';

	let hideHeader = false;
	let lastScrollPosition = 0;

	let userRanking = [
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
		{
			email: 'mo**29',
		},
	];

	onMount(() => {
		const handleScroll = () => {
			const currentScrollPosition = window.scrollY;

			if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 50) {
				hideHeader = true;
			} else {
				hideHeader = false;
			}

			lastScrollPosition = currentScrollPosition;
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<header class="z-30 sticky top-0 {hideHeader ? 'hide-animation' : ''} border-b">
	<div class="flex items-center max-w-4xl justify-between gap-4 p-4 bg-white">
		<a href="/"><img src={logo} alt="홈아이콘" class="inline rounded-xl w-14" /></a>
		<div
			class="flex items-center justify-center w-full h-10 px-4 bg-gray-100 rounded-full border-none gap-2"
		>
			<Icon icon="search" size={20} />
			<input
				class="w-full h-10 px-2 text-base border-none bg-transparent ring:border-none rounded-full placeholder-neutral-400 focus:outline-none"
				type="text"
				placeholder="검색어를 입력하세요"
			/>
		</div>
		<button class="relative">
			<Icon icon="bell" />
			<div
				class="absolute -right-1 -top-1 flex justify-center items-center w-2 h-2 rounded-full bg-red-500 text-xs text-white"
			/>
		</button>
	</div>
</header>

<main>
	<!-- 설명 -->
	<div class="mt-4 px-4 grid place-items-center text-lg font-bold text-gray-500">
		<div class="text-center">
			아주대학교의 모든 것,<br />
			<span class="text-blue-500">아주위키</span>에 오신 것을 환영합니다.
			<div class="mt-4 text-sm font-normal whitespace-wrap">
				아주 위키는 아주대학교 학생들이 함께 만들어가는 위키입니다.<br />
				아주대학교 구성원이라면 누구나 자유롭게 문서를 편집할 수 있습니다.
			</div>
		</div>
	</div>

	<!-- 리더보드 -->
	<h3 class="px-4 pt-4">
		리더보드
	</h3>
	<div class="relative border rounded-lg p-4 m-4">
		<div class="absolute left-4 -top-2.5 text-gray-500 text-sm font-normal bg-white px-1">
			이번 주 아주위키 기여도 TOP 10
		</div>
		<div class="grid grid-rows-5 grid-flow-col text-gray-700 gap-1">
			{#each userRanking as user, i}
				<div class="flex items-center gap-1">
					<div class="rounded-full w-5 h-5 flex items-center justify-center { i == 0 ? 'bg-yellow-300' : (i == 1 ? 'bg-gray-200' : (i == 2 ? 'bg-yellow-500' : 'bg-blue-200'))}">
						{i+1}
					</div>
					{user.email}
				</div>
			{/each}
		</div>
	</div>

    <!-- 카테고리 목록 -->
    <h3 class="px-4 pt-4">
        카테고리
    </h3>
    <table>
        
    </table>

	<!-- 최근 가장 많이 검색된 문서 -->
	<h3 class="px-4 pt-4">
		최근 가장 많이 검색된 문서
	</h3>
	<ul class="mt-4">
		{#each "012" as i}
			<DocumentCard />
			<hr class="my-2" />
		{/each}
	</ul>

	<!-- 최근 수정/등록된 문서 -->
	<h3 class="px-4 pt-4">
		최근 수정/등록된 문서
	</h3>
	<ul class="mt-4">
		{#each "012" as i}
			<DocumentCard />
			<hr class="my-2" />
		{/each}
	</ul>
</main>

<div class="h-16" />

<Nav currentPath="/wiki" />

<style>
	header {
	  transition: transform 0.3s ease-in-out;
	}
	.hide-animation {
	  transform: translateY(-100%);
	}
</style>