<script>
    import Icon from "$lib/Icon.svelte";
    import { fade } from 'svelte/transition';

    let inputElement,
        inputMessage = "",
        isChatBotOpen = false,
        waitingResponse = false;

    let messages = [
        {
            isUser: false,
            content: "안녕하세요, 저는 아주대학교 학생들을 위한 챗봇입니다. 궁금하신 점이 있다면 언제든 물어봐주세요!",
        },
    ];

    async function send() {
        messages = [
            ...messages,
            {
                isUser: true,
                content: inputMessage,
            },
        ];
        waitingResponse = true;
        inputMessage = "";
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                context: messages.map(message => {
                    return `${message.isUser ? '<human>' : '<bot>'}:${message.content}`;
                }).join('\n') + "\n<bot>:",
                temperature: 1.0
            })
        });
        if(response) {
            waitingResponse = false;
            const data = await response.json();
            messages = [
                ...messages,
                {
                    isUser: false,
                    content: data,
                },
            ];
        }
    }
</script>

<div class="fixed bottom-20 left-4 z-50">
    {#if isChatBotOpen}
    <div transition:fade={{ delay: 50, duration: 150 }} class="border rounded-lg bg-white mb-4">
        <h3 class="px-4 pt-4">챗봇</h3>
        <hr class="mt-4" />
        <ol class="px-4 pb-4 h-96 overflow-y-auto">
            {#each messages as message, i}
                {#if message.isUser}
                    <li class="flex justify-end {i == messages.length - 1 ? 'last-message' : ''}">
                        <div class="max-w-xxs mt-2 break-words bg-blue-500 text-white rounded-lg rounded-tr-none p-3">
                            {message.content}
                        </div>
                    </li>
                {:else}
                    <li class="flex pr-16">
                        <div class="max-w-xxs mt-2 break-words bg-gray-100 rounded-lg rounded-tl-none p-3">
                            {message.content}
                        </div>
                    </li>
                {/if}
            {/each}
            {#if waitingResponse}
            <div class="wave">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            {/if}
        </ol>
        <form on:submit|preventDefault={send}
            class="bg-white w-full max-w-4xl gap-2 flex items-center py-2 px-4 border-t rounded-lg">
            <input bind:this={inputElement} bind:value={inputMessage} class="rounded-full border flex-1 h-10 pl-4 pr-16 text-sm bg-gray-100" />
            {#if inputMessage.length > 0}
                <button type="submit" class="text-sm absolute right-6 text-blue-500 rounded-full bg-white h-8 px-3 border flex items-center justify-center">
                    <Icon icon="send" size={20} />
                </button>
            {/if}
        </form>
    </div>
    {/if}
    <button on:click={() => isChatBotOpen = !isChatBotOpen}
        class="rounded-full w-14 h-14 bg-white text-blue-500 grid place-items-center shadow-xl duration-300 ease-in-out hover:-translate-y-1">
           {#if isChatBotOpen}
               <Icon icon="chevron-down" size={28} />
           {:else}
               <Icon icon="chat-fill" size={28} />
           {/if}
       </button>
</div>

<style>
    .wave .dot {
        background-color: #3498db;
        border-radius: 50%;
        width: 4px;
        height: 4px;
        margin: 1px;
        display: inline-block;
        animation: wave 1.5s ease-in-out infinite;
    }

    .wave .dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    .wave .dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    @keyframes wave {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
</style>