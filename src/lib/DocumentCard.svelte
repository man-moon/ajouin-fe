<script>
    import Icon from "$lib/Icon.svelte";
    import { truncate } from "$lib/utils.js";

    export let heading = "건물/팔달관";
    export let content = "2021년 06월 21일, 팔달관 1층에 편의점이 입점했다.";
    export let star = 231;
    export let view = 1193;
</script>

<a href="#post" class="block px-4">
    <h4 class="text-gray-700 truncate font-medium">
        {truncate(heading,20)}
    </h4>
    <div class="flex gap-4 mt-2 text-sm text-gray-500">
        <div class="w-4/5">
            {truncate(content, 80)}
        </div>
    </div>
    <div class="mt-2 flex gap-4 justify-between items-center text-sm text-gray-400">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
                <Icon icon="star" size={12}/>
                {star}
            </div>
            <div class="flex items-center gap-1">
                <Icon icon="eye" size={12}/>
                {view}
            </div>
        </div>
    </div>
</a>