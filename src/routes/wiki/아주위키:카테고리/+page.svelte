<script>
    import BackAppBar from "$lib/BackAppBar.svelte";
    import Icon from "$lib/Icon.svelte";

    let categories = [
        {
            name: "맛집",
            description: "아주대의 맛집을 다루는 카테고리입니다.",
        },
        {
            name: "동아리",
            description: "아주대의 동아리를 다루는 카테고리입니다.",
        },
        {
            name: "학과",
            description: "아주대의 학과를 다루는 카테고리입니다.",
        },
        {
            name: "수업",
            description: "아주대의 수업을 다루는 카테고리입니다.",
        },
        {
            name: "행사",
            description: "아주대의 행사를 다루는 카테고리입니다.",
        },
        {
            name: "교수진",
            description: "아주대의 교수진을 다루는 카테고리입니다.",
        },
    ]
</script>

<BackAppBar title="위키 카테고리"/>

<main class="p-4">
    <div class="grid grid-cols-3 gap-4">
        {#each categories as category, i}
        <div class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1">
            <a href="/wiki/category/{category.name}" class="">
                <div class="font-bold">{category.name}</div>
                <div class="text-gray-500 text-sm">{category.description}</div>
            </a>
        </div>
        {/each}
      
    </div>
</main>