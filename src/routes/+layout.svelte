<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { page } from '$app/stores';
	import { bookmarkStore, reminderStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const options = {
		duration: 3000,
		initial: 1,
		next: 0,
		pausable: false,
		dismissable: true,
		reversed: false,
		intro: { x: 256 },
		theme: {},
		classes: []
	};

	onMount(async () => {
		if ($page.data.session) {
			// 해당 유저의 북마크 목록과 리마인더 목록을 가져온다.
			const reminderResponse = await fetch('/api/reminder', {
				method: 'GET',
			});
			const bookmarkResponse = await fetch('/api/bookmark', {
				method: 'GET',
			});
			$reminderStore = await reminderResponse.json();
			$bookmarkStore = await bookmarkResponse.json();

		}
	});
</script>

<svelte:head>
	<title>아주대 공지 허브</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
	<meta name="google-site-verification" content="ScdjlAdeP35cHRtM5BFG0wK8bYi7xSJxwivMF0fexPg" />
	<meta name="description" content="아주대학교의 모든 공지사항을 여기에서 한 눈에 확인해보세요." />
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div id="main" class="w-full bg-gray-50 flex justify-center min-h-screen bg-cover bg-fixed">
	<div class="max-w-4xl w-full bg-white">
		<slot />
	</div>
</div>
<!-- <Toast /> -->

<div class="text-sm">
	<SvelteToast {options} />
</div>

<style>
	:root {
		--toastBorderRadius: 0.5rem;
		--toastBtnWidth: 2rem;
		--toastBackground: #fff;
		--toastColor: #252525;
		--toastBorder: 1px solid #ececec;
	}
</style>
