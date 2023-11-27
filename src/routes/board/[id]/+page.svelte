<script>
	import { page } from '$app/stores';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import { ACCESS_TOKEN, toastMessage } from '$lib/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let carousel; // for calling methods of the carousel instance
	let showPrevPage;
	let showNextPage;
	const postId = $page.params.id;

	let post,
		commentInput = '';

	let parentCommentId = null;

	let inputRef;

	let toggleMenu = false;
	let activateCommentNumber = null;

	async function getPost() {
		const response = await fetch(`/api/board/post?id=${postId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});
		if (response.ok) {
			const data = await response.json();
			post = data;
		}
	}

	async function deletePost() {
		const response = await fetch(`/api/board/post?id=${postId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});
		if (response.ok) {
			goto('/board');
		}
	}

	async function deleteComment(commentId) {
		const response = await fetch(`/api/board/comment?id=${commentId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});
		if (response.ok) {
			getPost();
		}
	}

	async function addComment() {
		if ($ACCESS_TOKEN == null) {
			toastMessage.set('로그인이 필요합니다.');
			return;
		}
		if (commentInput.length == 0) {
			toastMessage.set('댓글을 입력해주세요.');
			return;
		}
		const response = await fetch(`/api/board/comment?id=${postId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			},
			body: JSON.stringify({
				content: commentInput,
				parent: parentCommentId,
				isAnonymous: true
			})
		});
		if (response.ok) {
			commentInput = '';
			parentCommentId = null;
			getPost();
		}
	}

	onMount(() => {
		const accessToken = $ACCESS_TOKEN || localStorage.getItem('h5prc2wcOyaKvGNQZZKiS');
		if (accessToken) {
			$ACCESS_TOKEN = accessToken;
		}
		getPost();
	});
</script>

{#if post}
	<BackAppbar title={post.title} />

	<!-- 글 헤더 -->
	<div class="gap-2 mt-4 mx-4">
		<div class="flex flex-col w-full">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-sm">
					<div>
						<div class="font-medium">{post.writerNickname}</div>
						<span class="text-gray-400 text-xs">{post.timeAgo}</span>
						<span class="text-gray-400">|</span>
						<span class="text-blue-500 text-xs">{post.tagName}</span>
					</div>
				</div>
				<button
					class="text-gray-400 relative"
					on:click={() => {
						toggleMenu = !toggleMenu;
					}}
				>
					<Icon icon="more-horizontal" size={20} />
					{#if toggleMenu}
						<div
							class="absolute top-2 right-5 py-2 bg-white rounded-lg shadow-lg whitespace-nowrap border text-sm"
						>
							{#if post.isWrittenByMe}
								<button class="block px-4" on:click={deletePost}>삭제하기</button>
							{/if}
							{#if !post.isWrittenByMe}
								<button
									class="block px-4"
									on:click={() => {
										toastMessage.set('신고가 접수되었습니다.');
									}}>신고하기</button
								>
							{/if}
						</div>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- 본문 -->
	<div class="flex-1 text-black text-left mt-4">
		<!-- 이미지 -->
		<!-- {#if browser}
        <Carousel
        >
            {#each post.images as image, i}
                <img
                    src={image}
                    alt="img"
                    class="object-contain w-16 bg-gray-200"
                />
            {/each}
        </Carousel>
    {/if} -->

		<!-- 내용 -->
		<p class="text-sm m-4">
			{post.content}
		</p>

		<div class="flex text-gray-500 m-4 justify-end">
			<!-- 조회수 -->
			<div class="flex gap-1 items-center">
				<Icon icon="eye" size={14} />
				<div class="text-sm">{post.viewCount}</div>
			</div>
			<!-- 댓글 수 -->
			<div class="ml-4 flex gap-1 items-center">
				<Icon icon="message-square" size={14} />
				<div class="text-sm">{post.commentCount}</div>
			</div>
		</div>
	</div>

	<hr />

	<!-- 댓글 -->
	{#each post.commentList as comment, i}
		<div
			class="{parentCommentId == comment.commentId ? 'bg-blue-50' : 'bg-white'} border-b px-4 py-3"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-700">
					{comment.writerNickname}
					<span class="ml-2 text-gray-400 text-xs">{comment.timeAgo}</span>
				</div>
				<button
					class="text-gray-400 relative"
					on:click={() => {
						activateCommentNumber = activateCommentNumber == i ? null : i;
					}}
				>
					{#if activateCommentNumber != null && activateCommentNumber == i}
						<div
							class="absolute top-2 right-5 py-2 bg-white rounded-lg shadow-lg whitespace-nowrap border text-sm"
						>
							{#if post.isWrittenByMe}
								<button class="block px-4" on:click={deleteComment(comment.commentId)}
									>삭제하기</button
								>
							{/if}
							{#if !post.isWrittenByMe}
								<button
									class="block px-4"
									on:click={() => {
										toastMessage.set('신고가 접수되었습니다.');
									}}>신고하기</button
								>
							{/if}
						</div>
					{/if}
					<Icon icon="more-horizontal" size={16} />
				</button>
			</div>
			<div class="text-sm mt-2">{comment.content}</div>
			<div class="flex justify-between items-center">
				<div class="text-xs mt-2 text-gray-400 flex gap-4">
					<button>좋아요 {comment.preferenceCount}</button>
					<button
						on:click={() => {
							parentCommentId ? (parentCommentId = null) : (parentCommentId = comment.commentId);
							inputRef.focus();
						}}
					>
						{#if parentCommentId == comment.commentId}
							작성 취소
						{:else}
							답글 달기
						{/if}
					</button>
				</div>
			</div>
		</div>
		{#if comment.childComments.length > 0}
			{#each comment.childComments as reply, j}
				<div class="bg-gray-100 pl-8 pr-4 py-2">
					<div class="text-xs flex gap-1">
						<div class="flex justify-between w-full">
							<div class="text-sm text-gray-700">
								{reply.writerNickname}
								<span class="ml-2 text-gray-400 text-xs">{reply.timeAgo}</span>
							</div>
							<button
								class="text-gray-400 relative"
								on:click={() => {
									activateCommentNumber = (activateCommentNumber == (i + 1)*1000 + j) ? null : (i + 1)*1000 + j;
								}}
							>
								{#if activateCommentNumber != null && activateCommentNumber == (i + 1)*1000 + j}
									<div
										class="absolute top-2 right-5 py-2 bg-white rounded-lg shadow-lg whitespace-nowrap border text-sm"
									>
										{#if post.isWrittenByMe}
											<button class="block px-4" on:click={deleteComment(reply.commentId)}
												>삭제하기</button
											>
										{/if}
										{#if !post.isWrittenByMe}
											<button
												class="block px-4"
												on:click={() => {
													toastMessage.set('신고가 접수되었습니다.');
												}}>신고하기</button
											>
										{/if}
									</div>
								{/if}
								<Icon icon="more-horizontal" size={16} />
							</button>
						</div>
					</div>
					<div class="text-sm mt-2">{reply.content}</div>
					<div class="text-xs mt-2 flex gap-4 text-gray-400">
						<button>좋아요 {reply.preferenceCount}</button>
					</div>
				</div>
			{/each}
		{/if}
	{/each}

	<div class="h-16" />

	<form
		on:submit|preventDefault={addComment}
		class="bg-white fixed bottom-0 w-full max-w-4xl gap-2 flex items-center py-3 px-4 border border-x-0"
	>
		<input
			bind:this={inputRef}
			placeholder={parentCommentId ? '대댓글을 입력하세요' : '댓글을 입력하세요'}
			bind:value={commentInput}
			class="rounded-full border flex-1 h-10 pl-4 pr-16 text-sm bg-gray-100"
		/>
		{#if commentInput.length > 0}
			<button
				type="submit"
				class="text-sm absolute right-6 text-blue-500 rounded-full bg-white h-8 px-3 border flex items-center justify-center"
			>
				<Icon icon="send" size={20} />
			</button>
		{/if}
	</form>
{/if}
