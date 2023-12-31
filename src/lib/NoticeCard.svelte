<script>
	import Icon from '$lib/Icon.svelte';
	import { toastMessage, ACCESS_TOKEN, myBookMark } from '$lib/stores';
	import { onMount } from 'svelte';

	async function toggleBookMark() {
		if (!$ACCESS_TOKEN) {
			toastMessage.set('로그인이 필요합니다.');
			return;
		}
		if (notice.isBookMarked) {
			notice.isBookMarked = false;
			$myBookMark = $myBookMark.filter((bookMark) => bookMark.id !== notice.id);
		} else {
			notice.isBookMarked = true;
			$myBookMark = [...$myBookMark, notice];
		}
		const response = await fetch('/api/bookmark', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			},
			body: JSON.stringify({
				noticeId: notice.id
			})
		});
		if (response.ok) {
			const data = await response.json();
		} else {
			if (response.status === 400) {
				toastMessage.set('로그인이 필요합니다.');
				return;
			}
		}
	}

	export let notice = {
		id: '',
		title: '',
		date: '',
		type: '',
		link: '',
		createdAt: 'asdf',
		isTopFixed: false,
		isBookMarked: false
	};
	function getTimeAgo(createdAt) {
		const now = new Date();
		const date = new Date(createdAt);

		const diffInSeconds = Math.floor((now - date) / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);
		const diffInYears = now.getFullYear() - date.getFullYear();

		if (diffInYears > 0) {
			return;
		}

		if (diffInDays > 0) {
			return;
		}

		if (diffInHours > 0) {
			return `${diffInHours}시간 전`;
		}

		if (diffInMinutes > 5) {
			return `${diffInMinutes}분 전`;
		}

		return '방금 전';
	}
</script>

<div class="px-4 py-2 flex items-center justify-between {getTimeAgo(notice.createdAt) ? 'border-blue-50':''}">
	<button
		on:click={() => {
			fetch('/api/views', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					noticeId: notice.id
				})
			});
			window.open(notice.link, '_blank');
		}}
		class="block grow"
	>
		<h4 class="text-gray-700 font-normal text-base text-left whitespace-wrap flex items-center">
			{#if notice.isTopFixed}📌{/if}
			{notice.title}
		</h4>
		<div class="flex gap-4 items-center mt-2 text-sm text-gray-500">
			{#if getTimeAgo(notice.createdAt)}
				<div>{getTimeAgo(notice.createdAt)}</div>
			{:else}
				<div class="flex items-center gap-1">
					<Icon icon="calendar" size={12} />
					{notice.date.slice(0, 10)}
				</div>
			{/if}
			<!-- <div class="flex items-center gap-1">
				<Icon icon="eye" size={12} />
				{notice.views}
			</div> -->
		</div>
	</button>
	<button on:click={toggleBookMark} class="text-gray-500">
		{#if notice.isBookMarked}
			<div class="text-blue-500">
				<Icon icon="bookmark-fill" size={24} />
			</div>
		{:else}
			<div class="text-gray-500">
				<Icon icon="bookmark" size={24} />
			</div>
		{/if}
	</button>
</div>
