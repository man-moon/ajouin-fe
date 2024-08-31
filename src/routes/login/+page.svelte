<script>
    import { goto } from "$app/navigation";
    import { toastMessage, ACCESS_TOKEN } from '$lib/stores';
    import { onMount } from "svelte";
    import Icon from "$lib/Icon.svelte";

    onMount(async () => {
        const accessToken = localStorage.getItem('h5prc2wcOyaKvGNQZZKiS');
        if(accessToken) {
            $ACCESS_TOKEN = accessToken;
            toastMessage.set("이미 로그인 되어있습니다.");
            goto('/');
        }
    });

    let email = "";
    let password = "";

    async function login() {
        const response = await fetch('api/auth/login', {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                email: {value: email + "@ajou.ac.kr"},
                password: password
            })
		});

        if(response.ok) {
            const accessToken = response.headers.get('Authorization');
            if(accessToken) {
                localStorage.setItem('h5prc2wcOyaKvGNQZZKiS', accessToken);
                $ACCESS_TOKEN = accessToken;
                goto('/');
            }
        }
		if (!response.ok) {
            response.json().then(data => {
                toastMessage.set(data.message)
            });
		}
    }
</script>

<header class="mt-32 flex flex-col items-center justify-center">
    <a href="/">
        <h1 class="flex text-blue-500 text-3xl font-extrabold">
            아주대 공지 허브
        </h1>
    </a>
    <div class="mt-2 font-bold text-gray-400">아주대학교 공지를 한 눈에!</div>
    <!-- <a href="/" class="border-b border-gray-700 flex items-center text-gray-500 mt-2 text-center text-sm">
        둘러보기
        <Icon icon={"chevron-right"} size={18} />
    </a> -->
</header>

<form on:submit|preventDefault={login} class="mt-12 px-4 md:px-48">
    <label class="relative flex">
        <input bind:value={email} type="text" placeholder="이메일" class="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg" />
        <div class="absolute top-3 right-4 text-gray-400">@ajou.ac.kr</div>
    </label>
    <input bind:value={password} type="password" placeholder="비밀번호" class="mt-2 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg" />

    <div class="mt-4 w-full">
        <button type="submit" class="bg-blue-500 text-white py-3 text-lg w-full rounded-lg">
            로그인
        </button>
    </div>

    <a href="/resetpassword">
        <div class="text-sm mt-4 w-full text-center text-gray-500 underline underline-offset-4">
            비밀번호를 잊으셨나요?
        </div>
    </a>

    <div class="mt-24 w-full">
        <button type="button" on:click={()=>{goto("/signup")}} class="text-blue-500 border border-blue-500 bg-white py-3 text-lg w-full rounded-lg">
            학교 이메일로 회원가입
        </button>
    </div>
</form>