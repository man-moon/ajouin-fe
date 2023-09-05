<script>
	import '../app.css';
	import Toast from "$lib/Toast.svelte";
</script>

<svelte:head>
	<title>아주인 : 아주대학교 커뮤니티</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<div class="w-full bg-gray-50">
	<div class="flex">
		<!-- 여백 -->
		<div class="hidden lg:block w-1/5" />

		<!-- 모바일 뷰 -->
		<div class="max-w-lg w-full min-h-screen bg-white">
			<slot />
		</div>

		<!-- 설명 -->
		<div class="hidden lg:block grow w-1/2">
			<div class="sticky top-0 flex items-center justify-center min-h-screen">
                설명
			</div>
		</div>
	</div>
</div>
<Toast />