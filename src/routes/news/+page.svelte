<script>
	import Icon from '$lib/Icon.svelte';
	import Nav from '$lib/Nav.svelte';
	import NoticeCard from '$lib/NoticeCard.svelte';
	import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let fetchedNotices = [];
    let fetchedTypes;
    //리스트로 보여줄 공지사항 배열
    let showNotices = [];
    let selectedType = "";
    $: fetchedTypes = [...new Set(fetchedNotices.map((n) => n.type))];

    async function getNotices(init) {
        const response = await fetch('/api/notices', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				notices: init ? init : selectedTotalFilters
            })
		});
        const data = await response.json();

        fetchedNotices = data.notices;
        //날짜 시간대 맞추기
        fetchedNotices = fetchedNotices.map((n) => {
            let date = new Date(n.date);
            date.setHours(date.getHours() + 9);
            n.date = date.toISOString();
            return n;
        });
        //학과이름 숫자 제거
        fetchedNotices = fetchedNotices.map((n) => {
            n.type = n.type.replace(/[0-9]/g, '');
            return n;
        });
        //이미 선택하고 있던 타입이 제거된 경우
        if(selectedType == "" || fetchedNotices.filter((n) => n.type == selectedType).length == 0) {
            selectedType = fetchedNotices[0].type;
        }
        if(browser) {
            localStorage.setItem('cachedTypes', JSON.stringify([...new Set(fetchedNotices.map((n) => n.type))]));
        }
    }


    $: {
        showNotices = fetchedNotices.filter((n) => n.type == selectedType)
    }

	//UNIV_NOTICE or STUDENT_COUNCIL_NOTICE
	let tabState = 'UNIV_NOTICE';

	//일반공지, 단과대공지, 학과공지,
	//총학생회소식, 단과대학생회소식, 학과학생회소식
	let noticeFilterPage;

	let generalFilters = ['일반공지', '장학공지', '생활관', '링크사업단', '중앙도서관'];

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
		'약학대학',
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
	// let medicalDepFilters = ['의학과'];
	// let nursingDepFilters = ['간호학과'];
	// let pharmacyDepFilters = ['약학과'];

	let selectedGeneralFilters = ['일반공지', '장학공지'];
	let selectedCollegeFilters = [];
	let selectedDepFilters = [];

    let studentCouncilFilters = ['총학생회'];

    let selectedStudeneCouncilFilters = ['총학생회'];
    let selectedStudentCouncilCollegeFilters = [];
    let selectedStudentCouncilDepFilters = [];

    let selectedTotalFilters = [...selectedGeneralFilters, ...selectedCollegeFilters, ...selectedDepFilters];
    $: selectedTotalFilters = [...selectedGeneralFilters, ...selectedCollegeFilters, ...selectedDepFilters];

    let showTopFixedNotices = false;

    onMount(async() => {
        let cachedTypes = localStorage.getItem('cachedTypes');
        if(cachedTypes) {
            cachedTypes = JSON.parse(cachedTypes);
            selectedTotalFilters = cachedTypes;
            fetchedTypes = cachedTypes;

            //각 필터 그룹군에 맞게 필터 할당
            selectedGeneralFilters = cachedTypes.filter((t) => generalFilters.includes(t));
            selectedCollegeFilters = cachedTypes.filter((t) => collegeFilters.includes(t));
            selectedDepFilters = cachedTypes.filter((t) => [...engineeringDepFilters, ...informationDepFilters, ...softwareConvergenceDepFilters, ...naturalSciencesDepFilters, ...businessDepFilters, ...humanitiesDepFilters, ...socialSciencesDepFilters].includes(t));

            await getNotices(cachedTypes);
        } else {
            console.log("캐싱된 타입 없음");
            await getNotices(['일반공지', '장학공지']);
        }
    })
</script>

<!-- 헤더 -->
{#if tabState == 'UNIV_NOTICE'}
    <!-- 필터 선택창 닫았을 때 화면 -->
	{#if noticeFilterPage == null}
		<header class="flex pt-4 sticky top-0 font-semibold text-sm text-center text-gray-400 bg-white">
			<button
				on:click={() => {
					tabState = 'UNIV_NOTICE';
				}}
				class="w-full px-2 pb-3 {tabState == 'UNIV_NOTICE'
					? 'text-black pb-2 border-b-2 border-blue-500'
					: 'pb-2 border-b'}">공지사항</button
			>
			<button
				on:click={() => {
					tabState = 'STUDENT_COUNCIL_NOTICE';
				}}
				class="w-full px-2 pb-3 {tabState == 'STUDENT_COUNCIL_NOTICE'
					? 'text-black pb-2 border-b-2 border-blue-500'
					: 'pb-2 border-b'}">학생회 소식</button
			>
		</header>
		<!-- 필터 -->
		<div
			class="w-full px-4 py-2 {fetchedTypes.length > 0 ? 'border-b-0' : 'border-b'} flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap"
		>
			<button
				on:click={() => {
					noticeFilterPage = '일반공지';
				}}
				class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
			>
				포탈 공지 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			<button
				on:click={() => {
					noticeFilterPage = '단과대공지';
				}}
				class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
			>
				단과대 선택
				<Icon icon="chevron-down" size={16} />
			</button>
			<button
				on:click={() => {
					noticeFilterPage = '학과공지';
				}}
				class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
			>
				학과 선택
				<Icon icon="chevron-down" size={16} />
			</button>
		</div>
        <!-- 필터2 -->
        {#if fetchedTypes.length > 0}
            <ul class="sticky top-12 bg-white w-full px-4 pb-2 border-b-4 flex items-center gap-2 text-xs overflow-x-auto whitespace-nowrap">
                {#each fetchedTypes as t, i}
                    <li>
                        <input
                            type="radio"
                            bind:group={selectedType}
                            id={i}
                            name="themeColor"
                            value={t}
                            class="peer hidden"
                        />
                        <label
                            for={i}
                            class="flex px-2 py-1 items-center justify-center {selectedType == t ? 'text-white bg-blue-500 border border-blue-500' : 'text-gray-500 border border-gray-300'} cursor-pointer rounded-full"
                        >
                            {t}
                        </label>
                    </li>
                {/each}
            </ul>
        {/if}

        <!-- 본문 -->
        <main>
            {#if showNotices.length > 0}
                <!-- 상단고정 공지사항 확인 -->
                <label class="text-sm flex items-center px-4 py-4 bg-gray-100">
                    <input type="checkbox" bind:checked={showTopFixedNotices} class="w-4 h-4 border accent-blue-500" />
                    <div class="ml-2">상단고정 공지사항 보기</div>
                </label>
                {#if showTopFixedNotices}
                    {#each showNotices.filter((n) => n.isTopFixed) as n, i}
                        <NoticeCard notice={n} />
                        <hr class="" />
                    {/each}
                {/if}
                {#each showNotices.filter((n) => !n.isTopFixed) as n, i}
                    <NoticeCard notice={n} />
                    <hr class="" />
                {/each}
                <div class="h-20" />
            {/if}
        </main>
		<Nav currentPath="/news" />
	{:else if noticeFilterPage == '일반공지'}
        <h3 class="p-4">공지사항을 확인할 포탈을 선택하세요</h3>
        <ul class="p-4 flex flex-wrap items-center text-center">
            {#each generalFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i}
                        value={filter}
                        bind:group={selectedGeneralFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>
        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={async() => {
                    noticeFilterPage = null;
                    await getNotices();
                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {:else if noticeFilterPage == '단과대공지'}
        <h3 class="p-4">공지사항을 확인할 단과대학을 선택하세요</h3>
        <ul class="p-4 flex flex-wrap items-center text-center">
            {#each collegeFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i}
                        value={filter}
                        bind:group={selectedCollegeFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>
        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={async() => {
                    noticeFilterPage = null;
                    await getNotices();
                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {:else if noticeFilterPage == '학과공지'}
        <h3 class="p-4">공지사항을 확인할 학과를 선택하세요</h3>

        <h4 class="p-4">공과대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each engineeringDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">정보통신대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each informationDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 11}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 11}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">소프트웨어융합대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each softwareConvergenceDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 13}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 13}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">자연과학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each naturalSciencesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 18}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 18}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">경영대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each businessDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 22}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 22}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">인문대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each humanitiesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 26}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 26}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">사회과학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each socialSciencesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 31}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 31}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <!-- <h4 class="p-4">의학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each medicalDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 37}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 37}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">간호대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each nursingDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 38}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 38}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">약학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each pharmacyDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 39}
                        value={filter}
                        bind:group={selectedDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 39}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul> -->

        <div class="h-24" />

        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={async() => {
                    noticeFilterPage = null;
                    await getNotices();

                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {/if}
{:else if tabState == 'STUDENT_COUNCIL_NOTICE'}
	{#if noticeFilterPage == null}
        <header class="flex pt-4 sticky top-0 font-semibold text-sm text-center text-gray-400 bg-white">
            <button
                on:click={() => {
                    tabState = 'UNIV_NOTICE';
                }}
                class="w-full px-2 pb-3 {tabState == 'UNIV_NOTICE'
                    ? 'text-black pb-2 border-b-2 border-blue-500'
                    : 'pb-2 border-b'}">공지사항</button
            >
            <button
                on:click={() => {
                    tabState = 'STUDENT_COUNCIL_NOTICE';
                }}
                class="w-full px-2 pb-3 {tabState == 'STUDENT_COUNCIL_NOTICE'
                    ? 'text-black pb-2 border-b-2 border-blue-500'
                    : 'pb-2 border-b'}">학생회 소식</button
            >
        </header>
        <!-- 필터 -->
        <div
            class="w-full px-4 py-2 border-b flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap"
        >
            <button
                on:click={() => {
                    noticeFilterPage = '총학생회소식';
                }}
                class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
            >
                총 학생회 소식
                <Icon icon="chevron-down" size={16} />
            </button>
            <button
                on:click={() => {
                    noticeFilterPage = '단과대학생회소식';
                }}
                class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
            >
                단과대 선택
                <Icon icon="chevron-down" size={16} />
            </button>
            <button
                on:click={() => {
                    noticeFilterPage = '학과학생회소식';
                }}
                class="flex gap-1 items-center bg-white text-gray-500 border border-gray-300 rounded-full px-2.5 py-1.5"
            >
                학과 선택
                <Icon icon="chevron-down" size={16} />
            </button>
        </div>
        <Nav currentPath="/news" />
    {:else if noticeFilterPage == '총학생회소식'}
        <h3 class="p-4">총학생회 소식을 듣고 싶으신가요?</h3>
        <ul class="p-4 flex flex-wrap items-center text-center">
            {#each studentCouncilFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 100}
                        value={filter}
                        bind:group={selectedStudeneCouncilFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 100}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>
        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={() => {
                    noticeFilterPage = null;
                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {:else if noticeFilterPage == '단과대학생회소식'}
        <h3 class="p-4">어떤 단과대학생회 소식을 듣고싶으신가요?</h3>
        <ul class="p-4 flex flex-wrap items-center text-center">
            {#each collegeFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 101}
                        value={filter}
                        bind:group={selectedStudentCouncilCollegeFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 101}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>
        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={() => {
                    noticeFilterPage = null;
                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {:else if noticeFilterPage == '학과학생회소식'}
        <h3 class="p-4">어떤 학과학생회 소식을 듣고싶으신가요?</h3>

        <h4 class="p-4">공과대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each engineeringDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 102}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 102}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">정보통신대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each informationDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 113}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 113}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">소프트웨어융합대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each softwareConvergenceDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 115}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 115}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">자연과학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each naturalSciencesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 120}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 120}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">경영대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each businessDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 124}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 124}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">인문대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each humanitiesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 128}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 128}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">사회과학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each socialSciencesDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 133}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 133}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <!-- <h4 class="p-4">의학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each medicalDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 139}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 139}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">간호대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each nursingDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 140}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 140}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul>

        <h4 class="p-4">약학대학</h4>
        <ul class="px-4 flex flex-wrap items-center text-center">
            {#each pharmacyDepFilters as filter, i}
                <li>
                    <input
                        type="checkbox"
                        id={i + 141}
                        value={filter}
                        bind:group={selectedStudentCouncilDepFilters}
                        class="peer hidden"
                    />
                    <label
                        for={i + 141}
                        class="px-3.5 py-2 text-sm mr-2.5 mb-2.5 bg-gray-100 inline-flex items-center justify-between text-gray-500 rounded-2xl cursor-pointer peer-checked:text-white peer-checked:bg-blue-500"
                    >
                        <div class="w-full text-sm">{filter}</div>
                    </label>
                </li>
            {/each}
        </ul> -->

        <div class="h-24" />

        <!-- 완료 버튼 -->
        <div class="fixed bottom-0 w-full max-w-4xl">
            <button
                on:click={() => {
                    noticeFilterPage = null;
                }}
                class="bg-blue-500 text-white py-4 text-lg w-full"
            >
                완료
            </button>
        </div>
    {/if}
{/if}
