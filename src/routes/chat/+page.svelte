<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Icon from '$lib/Icon.svelte';
	import { afterUpdate, onMount, tick } from 'svelte';
	import Abot from '$lib/assets/Abot.png';
	import { useChat } from 'ai/svelte';

	const { input, handleSubmit, messages, isLoading } = useChat({
		api: '/api/chat/query',
		initialMessages: [
			{
				role: 'system',
				content: '안녕하세요! 아주챗봇입니다. 무엇을 도와드릴까요?'
			}
		]
	});

	let scrollElement, formElement, headerElement;

	let inputElement;
</script>

<BackAppbar title="아주챗봇" />

<ul bind:this={scrollElement} class="p-4 flex flex-col overflow-y-auto gap-4 text-sm">
	<!-- <div class="h-10" /> -->
	{#each $messages as message, i}
		{#if message.role == 'user'}
			<li class="flex justify-end">
				<div
					class="max-w-sm mt-1 break-words shadow-md bg-white text-gray-700 rounded-lg rounded-tr-none p-2"
				>
					{message.content}
				</div>
			</li>
		{:else}
			<li class="flex gap-2">
				<div class="flex-shrink-0">
					<img src={Abot} alt="ajou-bot" class="rounded-full w-10 h-10 border" />
				</div>
				<div class="">
					<div class="text-gray-700">아주챗봇</div>
					<div
						class="max-w-sm mt-1 break-words shadow-md bg-blue-500 text-white rounded-lg rounded-tl-none p-2"
					>
						{message.content}
					</div>
				</div>
			</li>
		{/if}
	{/each}
</ul>

<form
	on:submit|preventDefault={handleSubmit}
	bind:this={formElement}
	class="bg-white fixed bottom-0 w-full max-w-4xl gap-2 flex items-center h-16 px-4 border-t"
>
	<input
		bind:this={inputElement}
		bind:value={$input}
		class="rounded-full border flex-1 h-10 pl-4 pr-16 text-sm bg-gray-100"
	/>
	{#if $input.length > 0}
		<button
			type="submit"
			class="text-sm absolute right-6 text-blue-500 rounded-full bg-white h-8 px-3 border flex items-center justify-center"
		>
			<!-- <Icon icon="send" size={20} /> -->
			보내기
		</button>
	{/if}
</form>

{#if $isLoading}
	<div
		class="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-full px-4 py-1"
	>
		<svg
			class="animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="#3b83f6"
			viewBox="0 0 256 256"
			><path
				d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
			/></svg
		>
		<div class="text-sm text-gray-700">답변을 생각 중이에요..</div>
	</div>
{/if}
