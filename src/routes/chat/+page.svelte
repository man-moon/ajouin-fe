<script>
	import BackAppbar from "$lib/BackAppbar.svelte";
    import Icon from "$lib/Icon.svelte";
    import { onMount, tick } from 'svelte';

    let scrollElement;

    onMount(async() => {
        await tick(500);
        const lastMessage = document.querySelector('.last-message');
        if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    });

    /**
     * message: {
     *     content: string,
     *     isUser: boolean,
     * }
     */
    let messages = [
        {
            isUser: false,
            content: "안녕하세요, 저는 아주대학교 학생들을 위한 챗봇입니다. 궁금하신 점이 있다면 언제든 물어봐주세요!",
            created_at: "2021-10-10 10:10:10",
            link: null,
        },
        {
            isUser: true,
            content: `4학년 1학기 이수 후, 현장실습(하계 방학 ~ 2학기) 6개월 과정을 진행하고 있어. 여름 계절 6학점이 1학기 이수 학점으로 들어가는지 아닌지 알려줘.`,
            created_at: "2021-10-10 10:10:15",
            link: null,
        },
        {
            isUser: false,
            content: "하계 방학 현장실습은 '계절학기 학점'으로 인정되며, 1학기 이수학점에 포함되지 않습니다.",
            created_at: "2021-10-10 10:10:10",
            link: "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=166529&article.offset=0&articleLimit=10"
        },
    ],
        messageInput = "";
        let inputElement;

    function send() {
        messages = [
            ...messages,
            {
                isUser: true,
                content: inputMessage,
                created_at: new Date().toISOString(),
            },
        ];
        inputMessage = "";
    }

</script>

<BackAppbar title="아주챗봇" />

<ul bind:this={scrollElement} class="p-4 flex flex-col overflow-y-auto gap-4 text-sm">
    <!-- <div class="h-14" /> -->
    {#each messages as message, i}
        {#if message.isUser}
            <li class="flex justify-end {i == messages.length - 1 ? 'last-message' : ''}">
                <div class="max-w-xxs mt-1 break-words shadow-md bg-white text-gray-700 rounded-lg rounded-tr-none p-2">
                    {message.content}
                </div>
            </li>
        {:else}
            <li class="flex gap-2 {i == messages.length - 1 ? 'last-message' : ''}">
                <div>
                    <div class="bg-blue-200 rounded-full w-10 h-10" />
                </div>
                <div class="">
                    <div class="text-gray-700">챗봇</div>
                    <div class="max-w-xxs mt-1 break-words shadow-md bg-blue-500 text-white rounded-lg rounded-tl-none p-2">
                        {message.content}
                        <!-- {#if message.link}
                            <a href={message.link} target="_blank"
                            class="mt-2 py-2 block rounded-lg bg-white text-gray-700 grid place-items-center underline">
                                링크 바로가기
                            </a>
                        {/if} -->
                    </div>
                </div>
            </li>
        {/if}
    {/each}
    <div class="h-16" />
</ul>

<form on:submit|preventDefault={send}
    class="bg-white fixed bottom-0 w-full max-w-4xl gap-2 flex items-center h-16 px-4 border-t">
    <button type="button" class="text-gray-500">
        <Icon icon="plus" size={24} />
    </button>
    <input bind:this={inputElement} bind:value={messageInput} class="rounded-full border flex-1 h-10 pl-4 pr-16 text-sm bg-gray-100" />
    {#if messageInput.length > 0}
        <button type="submit" class="text-sm absolute right-6 text-blue-500 rounded-full bg-white h-8 px-3 border flex items-center justify-center">
            <!-- <Icon icon="send" size={20} /> -->
            보내기
        </button>
    {/if}
</form>