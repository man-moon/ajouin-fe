<script>
    import {page} from "$app/stores";
    import { SignIn, SignOut } from "@auth/sveltekit/components"
</script>

<p>
    {#if $page.data.session}
        <span>
            <small>Signed in as</small><br/>
            <strong>{$page.data.session.user?.name ?? "User"}</strong>
            {$page.data.session.user?.email}
        </span>
        <!-- <button on:click={() => signOut()} class="button">Sign out</button> -->
        <div class="w-fit m-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-lg">
            <SignOut />
        </div>
    {:else}
        <span>You are not signed in</span>
        <!-- <button on:click={() => signIn("google")}>
            Sign In with Google
        </button> -->
        <div class="w-fit m-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-lg">
            <SignIn provider="google" signInPage="signin" />
        </div>
    {/if}
    <button class="bg-blue-500"
    on:click={async() => {
        	const response = await fetch('/api/test', {
			method: 'GET',
		});
    }}>
        asdf
    </button>
</p>