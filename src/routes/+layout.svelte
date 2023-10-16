<script>
	import '../app.css';
	import Toast from "$lib/Toast.svelte";
	import { page } from '$app/stores';
	import { currentPath, ACCESS_TOKEN } from '$lib/stores';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	onMount(()=>{
		const accessToken = localStorage.getItem('h5prc2wcOyaKvGNQZZKiS')
		if(accessToken) {
			$ACCESS_TOKEN = accessToken;
		}
	})

	inject({ mode: dev ? 'development' : 'production' });

</script>

<svelte:head>
	<title>아주대 공지모아</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
	<meta name="google-site-verification" content="ScdjlAdeP35cHRtM5BFG0wK8bYi7xSJxwivMF0fexPg" />
	<link rel="icon" href="/favicon.png">
</svelte:head>

<div class="w-full bg-gray-50 flex justify-center min-h-screen">
	<div class="max-w-4xl w-full bg-white">
		<slot />
	</div>
</div>
<Toast />