<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Nav from '$lib/Nav.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toastMessage, ACCESS_TOKEN, API_BASE_URL } from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';

	let email = '';
	let bookMarks = [];

	onMount(async () => {
		const accessToken = $ACCESS_TOKEN || localStorage.getItem('accessToken');
		if (accessToken) {
			$ACCESS_TOKEN = accessToken;
			await getBookMarks();
		}
	});

	async function getBookMarks() {
		const response = await fetch('/api/bookmark', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});

		if (response.ok) {
			response.json().then((data) => {
				bookMarks = data.bookMarks;
				bookMarks.forEach((bookMark) => {
					bookMark.isBookMarked = true;
				});
			});
		}
		if (!response.ok) {
			response.json().then((data) => {
				if (data.code == 'M002') {
					goto('/login');
				}
				toastMessage.set(data.message);
			});
		}
	}
</script>

<BackAppbar title="마이페이지" />

<main>
	{#if $ACCESS_TOKEN == null}
	<div class="p-4">
		<div class="mt-12 text-lg flex flex-col items-center text-gray-500">
			<Icon icon="alert-circle" size={64} />
			<div class="mt-4">로그인이 필요한 서비스에요</div>
		</div>
		<button on:click={()=>{
			goto('/login');
		}} class="mt-12 bg-blue-500 text-white py-3 text-lg w-full rounded-lg">
			로그인 하러가기
		</button>
	</div>

	{:else}
	<!-- 즐겨찾기 한 학교 소식 -->
	<div class="flex items-center justify-between p-4">
		<h3>
			<div class="font-bold text-lg text-gray-700">북마크 목록</div>
		</h3>
	</div>
	<div class="pb-4">
		{#each bookMarks as bookMark, idx}
		<NoticeCard notice={bookMark} />
	{/each}
	</div>

	<hr class="h-2 bg-gray-50" />

	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		문의하기
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<button on:click={()=>{
		localStorage.removeItem('accessToken');
		$ACCESS_TOKEN = null;
		toastMessage.set('로그아웃 되었어요');
		goto('/login');
	}} class="p-4 flex items-center justify-between text-gray-700 block w-full">
		로그아웃
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</button>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		회원탈퇴
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	{/if}
</main>

<div class="h-24" />
