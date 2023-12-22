<script>
    import BackAppbar from "$lib/BackAppbar.svelte";
    import Icon from "$lib/Icon.svelte";
    import { goto } from "$app/navigation";
    import { toastMessage, ACCESS_TOKEN } from "$lib/stores.js";
    import { onMount } from "svelte";

    let isCreatingCategory = false;
    let categoryName = "";
    let categoryDescription = "";

    let categories = [];

	onMount(async () => {
		const accessToken = $ACCESS_TOKEN || localStorage.getItem('h5prc2wcOyaKvGNQZZKiS');
		if (accessToken) {
			$ACCESS_TOKEN = accessToken;
		}
        const response = await fetch('/api/wiki/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            categories = await response.json();
        } else {
            toastMessage.set("카테고리 목록을 불러오는데 실패했어요.")
        }
	});

    async function createCategory() {
        const response = await fetch('/api/wiki/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $ACCESS_TOKEN,
            },
            body: JSON.stringify({
                name: categoryName,
                description: categoryDescription,
            }),
        });
        if (response.ok) {
            location.reload();
        } else {
            toastMessage.set("카테고리 생성에 실패했어요.")
        }
    }
</script>
{#if !isCreatingCategory}
    <BackAppbar title="위키 카테고리"/>

    <main class="p-4">
        <div class="grid grid-cols-3 gap-4">
            {#each categories as category, i}
                <div class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1">
                    <a href="/wiki/아주위키:카테고리/{category.name}" class="">
                        <div class="font-bold">{category.name}</div>
                        <div class="text-gray-500 text-sm">{category.description}</div>
                    </a>
                </div>
            {/each}
            <button class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1"
                on:click={()=>{
                    isCreatingCategory = true;
                }}>
                <div class="font-bold flex justify-center"><Icon icon="plus" size={36} /></div>
            </button>
        </div>
    </main>
{:else}
    <div class="relative sticky top-0 bg-white h-14 items-center border-b flex z-20">
        <button on:click={()=>{
            isCreatingCategory = false
            }} class="absolute p-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="gray"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-left"
        >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        </button>
        <div class="text-center w-full font-bold">
        새 카테고리 생성
        </div>
    </div>
    <main class="p-4">
        <label class="block mt-4">
            <div class="font-semibold text-gray-700">카테고리 이름</div>
            <input
                bind:value={categoryName}
                placeholder="카테고리는 중복될 수 없어요."
                type="text"
                class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg"
            />
        </label>
        <label class="block mt-4">
            <div class="font-semibold text-gray-700">설명</div>
            <input
                bind:value={categoryDescription}
                placeholder="최대 30자까지 입력할 수 있어요."
                maxlength="30"
                type="text"
                class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div class="text-gray-500 text-sm text-right mt-1">{categoryDescription.length}/30</div>
        </label>
    </main>

    <button
        on:click={createCategory}
        class="{categoryName.length > 0 && categoryDescription.length > 0 ? 'bg-blue-500' : 'bg-gray-300'} fixed bottom-0 text-white py-4 text-lg w-full max-w-4xl"
        disabled={categoryName.length <= 0 || categoryDescription.length <= 0}
    >
        생성하기
    </button>
{/if}