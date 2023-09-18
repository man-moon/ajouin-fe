<script>
	import '../app.css';
	import Toast from "$lib/Toast.svelte";
	import { page } from '$app/stores';
	import { currentPath } from '$lib/stores';
	import { onMount } from 'svelte';

</script>

<svelte:head>
	<title>아주위키: Ajou Wiki</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<div class="w-full bg-gray-50 flex justify-center min-h-screen">
	<div class="max-w-4xl w-full bg-white">
		<slot />
	</div>
</div>
<Toast />