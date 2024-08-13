<script>
	import BackAppbar from '$lib/BackAppbar.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		reminderStore,
		bookmarkStore,
		bookmarkSnapshotStore,
		reminderSnapshotStore
	} from '$lib/stores';
	import NoticeCard from '$lib/NoticeCard.svelte';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { toast } from '@zerodevx/svelte-toast';

	let step = 'main';

	onMount(() => {
		if ($page.data.session == null) {
			goto('/');
		}
	});

	$: if ($bookmarkStore.length > 0) {
		(async () => {
			const response = await fetch('/api/user-bookmark', {
				method: 'POST',
				body: JSON.stringify({
					bookmark: $bookmarkStore
				})
			});
			const data = await response.json();
			$bookmarkSnapshotStore = data;
		})();
	}

	$: if ($reminderStore.length > 0) {
		(async () => {
			const response = await fetch('/api/user-reminder', {
				method: 'POST',
				body: JSON.stringify({
					reminder: $reminderStore
				})
			});
			const data = await response.json();
			$reminderSnapshotStore = data;
		})();
	}

	async function withdrawal() {
		const response = await fetch('/api/auth/withdrawal', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			localStorage.removeItem('h5prc2wcOyaKvGNQZZKiS');
			goto('/');
		} else {
		}
	}

	let contactClassification;
	let content = '';
	async function contact() {
		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				classification: contactClassification,
				content: content
			})
		});
		// if (response.ok) {
		// toastMessage.set('문의가 접수되었어요.');
		// 	step = 'main';
		// } else {
		// 	response.json().then((data) => {
		// toastMessage.set(data.message);
		// 	});
		// }
	}
</script>

<BackAppbar title="마이페이지" />

<main>
	{#if step == 'withdrawal'}
		<h3 class="pt-4 px-4">정말로 회원탈퇴를 하시겠어요?</h3>
		<div class="p-4 text-gray-700">
			회원가입 시 입력한 모든 정보가 삭제돼요.<br />
			북마크 목록도 함께 삭제되니, 주의해주세요.
		</div>
		<div class="fixed bottom-0 max-w-4xl w-full flex text-lg">
			<button
				on:click={() => {
					step = 'main';
				}}
				class="block w-1/3 py-4 bg-gray-100"
			>
				취소할게요
			</button>
			<button on:click={withdrawal} class="block w-2/3 bg-blue-500 text-white py-4">
				탈퇴할게요
			</button>
		</div>
	{:else if step == 'contact'}
		<form on:submit={contact}>
			<h3 class="p-4">문의하기</h3>

			<section class="mt-4 px-4">
				<h4>분류</h4>
				<select
					bind:value={contactClassification}
					class="relative mt-2 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg"
				>
					<option>건의</option>
					<option>버그</option>
					<option>기타</option>
				</select>
			</section>

			<section class="mt-8 px-4">
				<h4>내용</h4>
				<textarea
					bind:value={content}
					class="mt-2 block w-full h-48 px-4 py-2 border border-gray-300 rounded-lg"
				/>
				<div class="text-right text-gray-500">({content.length}/1000)</div>
			</section>

			<button
				type="submit"
				disabled={content.length <= 0}
				class="{content.length > 0
					? 'bg-blue-500'
					: 'bg-gray-300'} block text-white py-4 text-lg w-full fixed bottom-0 w-full max-w-4xl"
			>
				문의하기
			</button>
		</form>
	{:else}
		<div class="flex items-center justify-between p-4">
			<h3>
				<div class="text-gray-700">북마크</div>
			</h3>
		</div>
		{#each $bookmarkSnapshotStore as n, idx}
			{#if idx < 5}
				<NoticeCard notice={n} />
				{#if idx != 4 && idx != n.length - 1}
					<hr />
				{/if}
			{/if}
		{/each}
		<a
			href="/mypage/bookmark"
			class="block text-sm text-gray-500 py-4 flex items-center justify-center w-full"
		>
			더보기
			<Icon icon="chevron-right" size={16} />
		</a>

		<hr class="h-2 bg-gray-50" />

		<div class="flex items-center justify-between p-4">
			<h3>
				<div class="text-gray-700">리마인드</div>
			</h3>
		</div>
		{#each $reminderSnapshotStore as n, idx}
			{#if idx < 5}
				<NoticeCard notice={n} />
				{#if idx != 4 && idx != n.length - 1}
					<hr />
				{/if}
			{/if}
		{/each}
		<a
			href="/mypage/reminder"
			class="block text-sm text-gray-500 py-4 flex items-center justify-center w-full"
		>
			더보기
			<Icon icon="chevron-right" size={16} />
		</a>

		<hr class="h-2 bg-gray-50" />

		<button
			on:click={() => {
				step = 'contact';
			}}
			class="p-4 flex items-center justify-between text-gray-700 block w-full"
		>
			문의하기
			<div class="text-gray-500">
				<Icon icon="chevron-right" size={24} />
			</div>
		</button>
		<button
			on:click={signOut}
			class="p-4 flex items-center justify-between text-gray-700 block w-full"
		>
			로그아웃
			<div class="text-gray-500">
				<Icon icon="chevron-right" size={24} />
			</div>
		</button>
		<button
			on:click={() => {
				step = 'withdrawal';
			}}
			class="p-4 flex items-center justify-between text-gray-700 block w-full"
		>
			회원탈퇴
			<div class="text-gray-500">
				<Icon icon="chevron-right" size={24} />
			</div>
		</button>
	{/if}
</main>

<div class="h-24" />
