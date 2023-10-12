<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Nav from '$lib/Nav.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toastMessage, ACCESS_TOKEN, myBookMark } from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';

	let email = '';
	let showLoading = true;
	let isWithdrawaling = false;

	onMount(async () => {
		showLoading = true;
		const accessToken = $ACCESS_TOKEN || localStorage.getItem('accessToken');
		if (accessToken) {
			$ACCESS_TOKEN = accessToken;
			if ($myBookMark.length == 0) {
				await getBookMarks();
			}
		}
		showLoading = false;
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
				$myBookMark = data.bookMarks;
				$myBookMark.forEach((bookMark) => {
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

	async function withdrawal() {
		const response = await fetch('/api/auth/withdrawal', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});
		if (response.ok) {
			localStorage.removeItem('accessToken');
			$ACCESS_TOKEN = null;
			toastMessage.set('회원탈퇴가 완료되었어요. 그동안 이용해주셔서 감사합니다.');
			goto('/login');
		} else {
			response.json().then((data) => {
				toastMessage.set(data.message);
			});
		}
	}
</script>

<BackAppbar title="마이페이지" />

<main>
	{#if showLoading}
		<div class="itmes-center mt-24 flex justify-center text-blue-500 z-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				class="animate-spin"
				fill="CurrentColor"
				viewBox="0 0 256 256"
			>
				<path
					d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
				/>
			</svg>
		</div>
	{:else if $ACCESS_TOKEN == null}
		<div class="p-4">
			<div class="mt-12 text-lg flex flex-col items-center text-gray-500">
				<Icon icon="alert-circle" size={64} />
				<div class="mt-4">로그인이 필요한 서비스에요</div>
			</div>
			<button
				on:click={() => {
					goto('/login');
				}}
				class="mt-12 bg-blue-500 text-white py-3 text-lg w-full rounded-lg"
			>
				로그인 하러가기
			</button>
		</div>
	{:else}
		{#if isWithdrawaling}
		<h3 class="pt-4 px-4">
			정말로 회원탈퇴를 하시겠어요?
		</h3>
		<div class="p-4 text-gray-700">
			회원가입 시 입력한 모든 정보가 삭제돼요.<br />
			북마크 목록도 함께 삭제되니, 주의해주세요.
		</div>
		<div class="fixed bottom-0 max-w-4xl w-full flex text-lg">
			<button on:click={()=>{isWithdrawaling = false}} class="block w-1/3 py-4 bg-gray-100">
				취소할게요
			</button>
			<button on:click={withdrawal} class="block w-2/3 bg-blue-500 text-white py-4">
				탈퇴할게요
			</button>
		</div>
		{:else}
		<!-- 즐겨찾기 한 학교 소식 -->
			<div class="flex items-center justify-between p-4">
				<h3>
					<div class="text-gray-700">북마크 목록</div>
				</h3>
			</div>
			<div class="pb-4">
				{#each $myBookMark as bookMark, idx}
					<NoticeCard notice={bookMark} />
					{#if idx != $myBookMark.length - 1}
						<hr />
					{/if}
				{/each}
			</div>

			<hr class="h-2 bg-gray-50" />

			<a href="#" class="p-4 flex items-center justify-between text-gray-700">
				문의하기
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</a>
			<button
				on:click={() => {
					localStorage.removeItem('accessToken');
					$ACCESS_TOKEN = null;
					toastMessage.set('로그아웃 되었어요');
					goto('/login');
				}}
				class="p-4 flex items-center justify-between text-gray-700 block w-full"
			>
				로그아웃
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</button>
			<button
				on:click={() => {
					isWithdrawaling = true;
				}}
				class="p-4 flex items-center justify-between text-gray-700 block w-full"
			>
				회원탈퇴
				<div class="text-gray-500">
					<Icon icon="chevron-right" size={24} />
				</div>
			</button>
			{/if}
	{/if}
</main>

<div class="h-24" />