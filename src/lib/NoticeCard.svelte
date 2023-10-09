<script>
    import Icon from "$lib/Icon.svelte";
    import { toastMessage, ACCESS_TOKEN } from '$lib/stores';

    async function toggleBookMark() {
        if(!$ACCESS_TOKEN) {
            toastMessage.set("로그인이 필요합니다.");
            return;
        }
        const response = await fetch("/api/bookmark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": $ACCESS_TOKEN,
            },
            body: JSON.stringify({
                noticeId: notice.id,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.isBookMarked) {
                notice.isBookMarked = true;
                toastMessage.set("북마크가 추가되었습니다.");
            } else {
                notice.isBookMarked = false;
                toastMessage.set("북마크가 삭제되었습니다.");
            }
        } else {
            if(response.status === 400) {
                toastMessage.set("로그인이 필요합니다.");
                return;
            }
        }
    }

    export let notice = {
        id: "",
        title: "",
        date: "",
        type: "",
        link: "",
        isTopFixed: false,
        isBookMarked: false,
    };
</script>

<div class="px-4 py-2 flex items-center justify-between">
    <a data-sveltekit-preload-data="eager" href={notice.link} target='_blank' class="block grow">
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
    <button on:click={toggleBookMark}
    class="text-gray-500">
    {#if notice.isBookMarked}
        <div class="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
    {:else}
        <div class="text-gray-500">
            <Icon icon="bookmark" size={24} />
        </div>
    {/if}
    </button>
</div>