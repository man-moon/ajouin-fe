<script>
	import '../app.css';
	import Toast from "$lib/Toast.svelte";
	import { page } from '$app/stores';
	import { currentPath, ACCESS_TOKEN } from '$lib/stores';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import ChatBot from '$lib/ChatBot.svelte';

	onMount(()=>{
		const accessToken = localStorage.getItem('h5prc2wcOyaKvGNQZZKiS')
		if(accessToken) {
			$ACCESS_TOKEN = accessToken;
		}
	})

	inject({ mode: dev ? 'development' : 'production' });

</script>

<svelte:head>
	<title>아주대학교 커뮤니티</title>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
	<meta name="google-site-verification" content="ScdjlAdeP35cHRtM5BFG0wK8bYi7xSJxwivMF0fexPg" />
	<link rel="icon" href="/favicon.png">
</svelte:head>

<div id=main class="w-full bg-gray-50 flex justify-center min-h-screen bg-cover bg-fixed">
<!-- <div id=main class="w-full sm:pl-48 bg-gray-50 flex min-h-screen bg-cover bg-fixed"> -->
	<div class="max-w-4xl w-full bg-white">
		<slot />
		<!-- <script>window.__EESEL_CUSTOM_ERROR="아직 해당 질문에 대한 데이터가 없어요. 죄송해요🥺";window.__EESEL_WELCOME_MSG="안녕하세요, 저는 아주대학교 챗봇입니다. 궁금하신 점이 있으신가요?";window.__EESEL_BOT_NAME="아주대학교 챗봇";window.__EESEL_NAMESPACE="ca3a60fe-bfcd-4635-9fa9-158bc6f1f8db";
			var e=document.createElement("script");e.src="https://cdn.eesel.ai/ChatWidget.d0cf70d.js",e.onload=function(){ChatWidget.default({
				  EESEL_LOGO_URL: 'https://www.ajou.in/favicon.png',
				  EESEL_COLOR_PALETTE: { primary:'#3b82f6' },  EESEL_DEFAULT_OPEN:false,
				  EESEL_SUGGEST_QUESTION:true
			})},document.body.appendChild(e);
		</script> -->
	</div>
	<!-- <div class="flex justify-center ">
		
	</div> -->
</div>
<Toast />
<!-- <ChatBot /> -->