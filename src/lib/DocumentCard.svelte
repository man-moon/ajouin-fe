<script>
    import Icon from "$lib/Icon.svelte";
    import { truncate } from "$lib/utils.js";

    export let title = "팔달관";
    export let createdAt = "2023-10-12";
</script>

<a href='/wiki/{title}' class="block px-4">
    <h4 class="text-gray-700 truncate font-medium">
        {truncate(title, 20)}
    </h4>
    <div class="mt-2 flex gap-4 justify-between items-center text-sm text-gray-400">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
                <Icon icon="calendar" size={12}/>
                {createdAt}
            </div>
        </div>
    </div>
</a>