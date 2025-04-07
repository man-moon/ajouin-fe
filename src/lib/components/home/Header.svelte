<script>
	import Icon from '$lib/Icon.svelte';
	import logo from '$lib/assets/logo.png';
	import { page } from '$app/stores';
	import { SignIn } from '@auth/sveltekit/components';
</script>

<div class="sticky top-0 z-50 w-full border-b bg-background">
	<div class="container flex h-16 items-center justify-between">
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center">
				<img src={logo} alt="아주대 공지 허브" class="h-10 w-10" />
				<div class="ml-1">
					<h1 class="text-xl font-semibold tracking-tight">아주대 공지 허브</h1>
					<p class="text-xs text-muted-foreground">최신 공지사항을 한 눈에</p>
				</div>
			</a>
		</div>
		
		<div>
			{#if $page.data.session}
				<a 
					href="/mypage" 
					class="flex items-center gap-1 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<img 
						src={$page.data.session.user.image} 
						class="h-8 w-8 rounded-full" 
						alt="{$page.data.session.user.name}의 프로필" 
					/>
					<Icon icon="chevron-right" size={18} />
				</a>
			{:else}
				<div class="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 text-sm font-medium">
					<SignIn provider="google" signInPage="signin">
						<div slot="submitButton">구글로 로그인</div>
					</SignIn>
				</div>
			{/if}
		</div>
	</div>
</div>
