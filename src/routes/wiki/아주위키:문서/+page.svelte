<script>
    import BackAppBar from "$lib/BackAppBar.svelte";
    import Icon from "$lib/Icon.svelte";
</script>

<BackAppBar title="위키 문서"/>

<main class="p-4">
    <div class="flex flex-wrap">
        <div class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1">
            <a href="/wiki/category/맛집" class="">
                <div class="font-bold">맛집</div>
                <div class="text-gray-500">아주대의 맛집들을 확인해보세요</div>
            </a>
        </div>
        <div class="p-2">
            <a href="/wiki/category/교수진" class="block bg-white rounded-lg shadow-lg p-4">
                <div class="font-bold text-xl">교수진</div>
                <div class="text-gray-500">교수님들을 소개합니다.</div>
            </a>
        </div>
        <div class="p-2">
            <a href="/wiki/category/건물" class="block bg-white rounded-lg shadow-lg p-4">
                <div class="font-bold text-xl">건물</div>
                <div class="text-gray-500">건물들을 소개합니다.</div>
            </a>
        </div>
    </div>
</main>