<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { toast } from '@zerodevx/svelte-toast';
	import { noticeStore, selectedType, bookmarkStore, reminderStore } from '$lib/stores';
	
	// Import separated components
import { 
	Header, 
	FilterNavigation, 
	NoticeFilters,
	SidebarTypeSelector,
	NoticeList, 
	FilterSelectionPage, 
	Footer 
} from '$lib/components/home';

	// Setup state variables
	let latestUpdateTime = '';
	let fetchedTypes;
	let showNotices = $noticeStore.filter((n) => n.noticeType == $selectedType);
	$: fetchedTypes = [...new Set($noticeStore.map((n) => n.noticeType))];

	// For pagination
	let offsetPerType = {
		일반공지: 0,
		장학공지: 0,
		생활관: 0,
		링크사업단: 0,
		중앙도서관: 0,
		공과대학: 0,
		정보통신대학: 0,
		소프트웨어융합대학: 0,
		자연과학대학: 0,
		경영대학: 0,
		인문대학: 0,
		사회과학대학: 0,
		의과대학: 0,
		간호대학: 0,
		약학대학: 0,
		기계공학과: 0,
		산업공학과: 0,
		응용화학생명공학과: 0,
		화학공학과: 0,
		첨단신소재공학과: 0,
		환경안전공학과: 0,
		건설시스템공학과: 0,
		교통시스템공학과: 0,
		건축학과: 0,
		융합시스템공학과: 0,
		AI모빌리티공학과: 0,
		전자공학과: 0,
		지능형반도체공학과: 0,
		소프트웨어학과: 0,
		인공지능융합학과: 0,
		사이버보안학과: 0,
		디지털미디어학과: 0,
		국방디지털융합학과: 0,
		수학과: 0,
		물리학과: 0,
		화학과: 0,
		생명과학과: 0,
		경영학과: 0,
		e비즈니스학과: 0,
		금융공학과: 0,
		글로벌경영학과: 0,
		국어국문학과: 0,
		영어영문학과: 0,
		불어불문학과: 0,
		사학과: 0,
		문화콘텐츠학과: 0,
		경제학과: 0,
		행정학과: 0,
		심리학과: 0,
		사회학과: 0,
		정치외교학과: 0,
		스포츠레저학과: 0
	};

	// 더 많은 공지사항을 로드하는 함수
	async function loadMore() {
		offsetPerType[$selectedType] += 20;
		const url = new URL(`api/notices?types=${$selectedType}`, window.location.origin);
		url.searchParams.append('offset', offsetPerType[$selectedType]);
		url.searchParams.append('limit', 20);
		url.searchParams.append('includeTopFixed', false);
		
		const response = await fetch(url, {
			method: 'GET'
		});
		
		const data = await response.json();
		let additionalNotices = data.notice;
		
		additionalNotices = additionalNotices.map((n) => {
			if (showNotices.length > 0 && showNotices[showNotices.length - 1].id == n.id) {
				showNotices.pop();
			}
			return n;
		});

		// 학과이름 숫자 제거
		additionalNotices = additionalNotices.map((n) => {
			n.noticeType = n.noticeType.replace(/[0-9]/g, '');
			return n;
		});
		
		showNotices = [...showNotices, ...additionalNotices];
	}

	// 공지사항을 가져오는 함수
	async function getNotices(init) {
		const notices = init ? init : selectedTotalFilters;
		
		if(notices.length == 0) {
			toast.push('최소 하나 이상의 필터는 선택되어있어야 해요');
			return;
		}
		
		const queryString = notices.map((notice) => `types=${encodeURIComponent(notice)}`).join('&');
		const url = new URL(`api/notices?${queryString}`, window.location.origin);
		url.searchParams.append('offset', 0);
		url.searchParams.append('limit', 20);
		url.searchParams.append('includeTopFixed', true);

		const response = await fetch(url, {
			method: 'GET'
		});

		const data = await response.json();
		let fetchedNotices = data.notice;

		fetchedNotices = fetchedNotices.map((n) => {
			n.noticeType = n.noticeType.replace(/[0-9]/g, '');
			return n;
		});
		
		$noticeStore = fetchedNotices;

		// 이미 선택하고 있던 타입이 제거된 경우
		if (
			$selectedType == '' ||
			$noticeStore.filter((n) => n.noticeType == $selectedType).length == 0
		) {
			$selectedType = $noticeStore[0].noticeType;
		}
		
		if (browser) {
			localStorage.setItem(
				'lugTcOmCFqTv9T35Detf',
				JSON.stringify([...new Set($noticeStore.map((n) => n.noticeType))])
			);
		}
	}

	// Filter data
	let noticeFilterPage = null;
	let generalFilters = ['일반공지', '장학공지', '생활관'];
	let collegeFilters = [
		'공과대학',
		'정보통신대학',
		'소프트웨어융합대학',
		'자연과학대학',
		'경영대학',
		'인문대학',
		'사회과학대학',
		'의과대학',
		'간호대학',
		'약학대학'
	];
	let engineeringDepFilters = [
		'기계공학과',
		'산업공학과',
		'응용화학생명공학과',
		'화학공학과',
		'첨단신소재공학과',
		'환경안전공학과',
		'건설시스템공학과',
		'교통시스템공학과',
		'건축학과',
		'융합시스템공학과',
		'AI모빌리티공학과'
	];
	let informationDepFilters = ['전자공학과', '지능형반도체공학과'];
	let softwareConvergenceDepFilters = [
		'소프트웨어학과',
		'인공지능융합학과',
		'사이버보안학과',
		'디지털미디어학과',
		'국방디지털융합학과'
	];
	let naturalSciencesDepFilters = ['수학과', '물리학과', '화학과', '생명과학과'];
	let businessDepFilters = ['경영학과', 'e비즈니스학과', '금융공학과', '글로벌경영학과'];
	let humanitiesDepFilters = [
		'국어국문학과',
		'영어영문학과',
		'불어불문학과',
		'사학과',
		'문화콘텐츠학과'
	];
	let socialSciencesDepFilters = [
		'경제학과',
		'행정학과',
		'심리학과',
		'사회학과',
		'정치외교학과',
		'스포츠레저학과'
	];

	// 선택된 필터
	let selectedGeneralFilters = ['일반공지', '장학공지'];
	let selectedCollegeFilters = [];
	let selectedDepFilters = [];
	let selectedTotalFilters = [
		...selectedGeneralFilters,
		...selectedCollegeFilters,
		...selectedDepFilters
	];
	$: selectedTotalFilters = [
		...selectedGeneralFilters,
		...selectedCollegeFilters,
		...selectedDepFilters
	];

	// UI state
	let showTopFixedNotices = false;
	let hideViewedNotices = false;
	let hideHeader = false;
	let lastScrollPosition = 0;
	let scrollDirection = 'up';
	let isLoadingMore = false;

	// 선택된 필터 타입에 따라 공지사항 필터링
	$: {
		showNotices = $noticeStore.filter((n) => n.noticeType == $selectedType);
		offsetPerType[$selectedType] = 0;
		if (typeof window !== 'undefined') {
			window.scrollTo({
				top: 0
			});
		}
	}

	// 스크롤 핸들러 - 개선된 버전
	const handleScroll = () => {
		const currentScrollPosition = window.scrollY;
		const scrollDelta = currentScrollPosition - lastScrollPosition;
		
		// 방향 감지 (15px 이상의 변화가 있을 때만 방향 변경)
		if (Math.abs(scrollDelta) >= 15) {
			scrollDirection = scrollDelta > 0 ? 'down' : 'up';
		}
		
		// 현재 스크롤 위치가 50px 이상이고 아래로 스크롤 중일 때만 필터를 숨김
		if (currentScrollPosition > 50 && scrollDirection === 'down') {
			hideHeader = true;
		} else if (scrollDirection === 'up') {
			hideHeader = false;
		}
		
		lastScrollPosition = currentScrollPosition;
	};

	// 무한 스크롤 핸들러
	const handleInfinityScroll = () => {
		if (isLoadingMore) return;
		
		const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 100) {
			isLoadingMore = true;
			loadMore().finally(() => {
				isLoadingMore = false;
			});
		}
	};

	// 필터 선택 핸들러
	const handleFilterSelect = (type) => {
		noticeFilterPage = type;
	};

	// 필터 선택 완료 핸들러
	const handleFilterComplete = () => {
		noticeFilterPage = null;
	};

	onMount(async () => {
		if ($noticeStore.length == 0) {
			let cachedTypes = localStorage.getItem('lugTcOmCFqTv9T35Detf');
			if (cachedTypes) {
				cachedTypes = JSON.parse(cachedTypes);
				selectedTotalFilters = cachedTypes;
				fetchedTypes = cachedTypes;

				// 각 필터 그룹군에 맞게 필터 할당
				selectedGeneralFilters = cachedTypes.filter((t) => generalFilters.includes(t));
				selectedCollegeFilters = cachedTypes.filter((t) => collegeFilters.includes(t));
				selectedDepFilters = cachedTypes.filter((t) =>
					[
						...engineeringDepFilters,
						...informationDepFilters,
						...softwareConvergenceDepFilters,
						...naturalSciencesDepFilters,
						...businessDepFilters,
						...humanitiesDepFilters,
						...socialSciencesDepFilters
					].includes(t)
				);

				await getNotices(cachedTypes);
			} else {
				await getNotices(['일반공지', '장학공지']);
			}
		}

		// 스크롤 이벤트 최적화: debounce 적용
		let scrollTimeout;
		const handleScrollDebounced = () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(handleScroll, 10);
		};

		window.addEventListener('scroll', handleScrollDebounced, { passive: true });
		window.addEventListener('scroll', handleInfinityScroll, { passive: true });
		
		return () => {
			clearTimeout(scrollTimeout);
			window.removeEventListener('scroll', handleScrollDebounced);
			window.removeEventListener('scroll', handleInfinityScroll);
		};
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('scroll', handleInfinityScroll);
		}
	});
</script>

<div class="min-h-screen flex flex-col bg-background text-foreground">
	{#if noticeFilterPage === null}
		<!-- 메인 페이지 UI -->
		<Header />
		<NoticeFilters
			{hideHeader}
			{noticeFilterPage}
			onFilterSelect={handleFilterSelect}
			{fetchedTypes}
			{generalFilters}
			{collegeFilters}
			{engineeringDepFilters}
			{informationDepFilters}
			{softwareConvergenceDepFilters}
			{naturalSciencesDepFilters}
			{businessDepFilters}
			{humanitiesDepFilters}
			{socialSciencesDepFilters}
			bind:selectedGeneralFilters={selectedGeneralFilters}
			bind:selectedCollegeFilters={selectedCollegeFilters}
			bind:selectedDepFilters={selectedDepFilters}
			{getNotices}
		/>
		
		<main class="flex-1 pt-1">
			<!-- PC 레이아웃: 사이드바와 컨텐츠 -->
			<div class="container px-0 sm:px-4 md:px-6">
				<div class="flex flex-row lg:gap-6">
					<!-- 사이드바 (lg 화면 크기 이상에서만 표시) -->
					<SidebarTypeSelector 
						{fetchedTypes} 
						bind:showTopFixedNotices 
						bind:hideViewedNotices 
					/>
					
					<!-- 공지사항 목록 -->
					<div class="w-full">
						<NoticeList {showNotices} bind:showTopFixedNotices bind:hideViewedNotices />
					</div>
				</div>
			</div>
		</main>
		
		<Footer />
	{:else}
		<!-- 필터 선택 페이지 UI -->
		<FilterSelectionPage 
			{noticeFilterPage}
			{generalFilters}
			{collegeFilters}
			{engineeringDepFilters}
			{informationDepFilters}
			{softwareConvergenceDepFilters}
			{naturalSciencesDepFilters}
			{businessDepFilters}
			{humanitiesDepFilters}
			{socialSciencesDepFilters}
			bind:selectedGeneralFilters
			bind:selectedCollegeFilters
			bind:selectedDepFilters
			{getNotices}
			onComplete={handleFilterComplete}
		/>
	{/if}
</div>
