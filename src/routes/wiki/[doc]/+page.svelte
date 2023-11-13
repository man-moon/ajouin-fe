<script>
    import { page } from '$app/stores';
    import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
    import BackAppbar from '$lib/BackAppbar.svelte';
    import { goto } from '$app/navigation';

    const doc = $page.params.doc
    const ver = $page.url.searchParams.get('ver');

    let category = '';
    let title = '';
    let content = '';
    let h2Contents = [];

    let histories = [];

    function addIDsToH2Tags(htmlString) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, 'text/html');

        // 모든 h2 태그를 찾아 순회
        var h2Tags = doc.querySelectorAll('h2');
        h2Tags.forEach(function(h2, index) {
            h2.id = 'h2-' + index;
        });

        return doc.body.innerHTML;
    }

    onMount(async()=> {
        const response = await fetch(`/api/wiki/versions?title=${doc}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok) {
            const data = await response.json();
            histories = data.documents;
            histories.forEach(history => {
                const date = new Date(history.createdAt);
                history.createdAt = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
            })
        }
    })

    onMount(async() => {
        if(ver) {
            const response = await fetch(`/api/wiki?doc=${doc}&ver=${ver}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            category = data.category.name;
            title = data.title;
            content = addIDsToH2Tags(data.content);
        } else {
            const response = await fetch(`/api/wiki?doc=${doc}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            category = data.category.name;
            title = data.title;
            content = addIDsToH2Tags(data.content);
        }
        if(content) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            // h2 태그 추출
            const h2Elements = doc.querySelectorAll('h2');
            h2Contents = Array.from(h2Elements).map(h2 => ({
                id: h2.id,
                text: h2.textContent
            }));
        }
    })
</script>

<BackAppbar title={title}/>
<header class="p-4">
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
            <a href="/wiki/아주위키:카테고리/{category}" class="underline text-blue-500">
                카테고리: {category}
            </a>
            <a href="/wiki" class="underline text-blue-500">
                위키 홈으로
            </a>
        </div>
        
        <button class="bg-blue-500 px-4 py-1.5 rounded-lg text-white"
            on:click={()=>{
                goto(`/wiki/아주위키:편집/${doc}`);
            }}>
            편집하기
        </button>
    </div>
    <h1 class="mt-8 font-bold text-3xl">
        {title}
    </h1>
    <section class="mt-12">
        <div class="border rounded-lg p-6 relative flex flex-col">
            <!-- h2~h4 태그 값을 뽑아 나타내기 -->
            <div class="text-xl absolute -top-3 bg-white px-1">
                목차
            </div>
            <ul>
                {#each h2Contents as h2Content, i}
                    <li><a href={`#${h2Content.id}`}><span class="text-blue-500">{i + 1}.</span> {h2Content.text}</a></li>
                {/each}
            </ul>
        </div>
    </section>
</header>

<hr class="mt-4 h-4 bg-gray-100" />

<main class="p-4">
    {@html DOMPurify.sanitize(content)}
</main>

<hr class="my-4 h-4 bg-gray-100" />

<div class="px-4 pt-4 pb-20">
    <h3 class="mb-4">
        문서 히스토리
    </h3>
    {#each histories as history, i}
        <a data-sveltekit-reload href='/wiki/{title}?ver={i}' class="block">
            <span class="text-blue-500">{i + 1}. </span> {history.createdAt}
            {#if i == ver || (ver == null && i == histories.length - 1)}
                <span class="text-blue-500"> (현재 문서)</span>
            {/if}
        </a>
    {/each}
</div>
