<script>
    import Icon from "$lib/Icon.svelte";
    import { truncate } from "$lib/utils.js";

    export let notice = {
        id: "",
        title: "",
        date: "",
        type: "",
        link: "",
        isTopFixed: false,
    };
</script>

<a href={notice.link} target='_blank' class="block px-4 py-2">
    <h4 class="text-gray-700 font-medium text-sm whitespace-wrap">
        {notice.title}
    </h4>
    <div class="flex gap-4 mt-2 text-xs text-gray-500">
        <div class="flex items-center gap-2">
            {notice.date.substring(0, 10)}
            <!-- <div class="px-2 py-0.5 bg-green-200 rounded-full text-black">
                {notice.type}
            </div> -->
            {#if notice.isTopFixed}
                <div class="px-2 py-0.5 bg-yellow-200 rounded-full text-black">
                    상단고정공지
                </div>
            {/if}
        </div>
    </div>
</a>