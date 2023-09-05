<script>
    import { blur } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Icon from '$lib/Icon.svelte';
    import { toastMessage, API_BASE_URL } from '$lib/stores';

    let step = 0;

    // step 0
    let email = "";
    let verificationId = "";
    let isStep0ButtonDisabled = true;
    let isSendButtonDisabled = false;
    let isVerifyButtonDisabled = true;
    let isSent = false;
    let code = '';
    let timeLeft = 180;
	let timer;
    let codeFulled = false;
    let isInputDisabled = false;
    $: {
        if(email.length > 0) {
            isSendButtonDisabled = false;
        } else {
            isSendButtonDisabled = true;
        }
    }
    $: {
        if(code.length == 4) {
            isVerifyButtonDisabled = false;
            codeFulled = true;
        } else {
            isVerifyButtonDisabled = true;
            codeFulled = false;
        }
    }
	function startTimer() {
        clearInterval(timer);
        timeLeft = 180;

		timer = setInterval(() => {
			timeLeft -= 1;

			// 타이머 종료 시간이 지났을 때
			if (timeLeft === 0) {
				clearInterval(timer);
				console.log('시간이 초과되었습니다.');
			}
		}, 1000);
	}
	async function sendVerificationEmail() {
        console.log(email);
		const response = await fetch(`${API_BASE_URL}/auth/email/request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({"email": {"value": email+"@ajou.ac.kr"}})
		});

        if(response.ok) {
            response.json().then(data => {
                console.log(data);
                verificationId = data.id;
            });
            isSendButtonDisabled = false;
		    isSent = true;
            startTimer();
        }
		else if (!response.ok) {
            response.json().then(data => {
                toastMessage.set(data.message);
                if(data.message == '이미 사용중인 이메일이에요.') {
                    goto('/login')
                }
            });
		}
	}
    async function verifyEmail() {
        isVerifyButtonDisabled = true;
		const response = await fetch(`${API_BASE_URL}/auth/email/verify`, {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: verificationId, code })
		});

        if(response.ok) {
            response.json().then(data => {
                if(data.isVerified) {
                    clearInterval(timer);
                    isStep0ButtonDisabled = false;
                    isSendButtonDisabled = true;
                    isInputDisabled = true;
                    codeFulled = false;
                }
                else toastMessage.set('인증코드가 일치하지 않아요');
            });
        }
		if (!response.ok) {
            isVerifyButtonDisabled = false;
            response.json().then(data => {
                toastMessage.set(data.message)
            });
		}
	}
	async function sendCode() {
        isSendButtonDisabled = true;
		//이메일 검증
        const regex = /^[a-zA-Z0-9]+$/;
        if(regex.test(email)) {
            await sendVerificationEmail();
        } else {
            toastMessage.set('이메일 형식이 올바르지 않아요');
        }
        isSendButtonDisabled = false;
	}

    //step 1
    let password = "";
    let password2 = "";
    let isStep1ButtonDisabled = true;
    let isPasswordValid = false;
    let isPasswordSame = false;
    $: {
        if(password.length >= 8) {
            isPasswordValid = true;
        } else {
            isPasswordValid = false;
        }
    }
    $: {
        if(password == password2 && password.length >= 8) {
            isPasswordSame = true;
            isStep1ButtonDisabled = false;
        } else {
            isStep1ButtonDisabled = true;
            isPasswordSame = false;
        }
    }



    //step 2
    let nickname = "";
    let timeout;
    let isValidnickname = false;
    let nicknameErrorMessage = "";
    async function checkValidNickname() {
        if(nickname.length < 2 || nickname.length > 10) {
            isValidnickname = false;
            nicknameErrorMessage = "닉네임은 2~10글자까지 가능해요."
            return;
        }
        const response = await fetch(`${API_BASE_URL}/auth/nickname`, {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: nickname
		});

        if(response.ok) {
            response.json().then(data => {
                if(data) {
                    isValidnickname = true;
                    nicknameErrorMessage = "";
                }
            });
        }
		if (!response.ok) {
            response.json().then(data => {
                isValidnickname = false;
                nicknameErrorMessage = data.message;
            });
		}
    }

    function handleInput() {
        clearTimeout(timeout);
        timeout = setTimeout(checkValidNickname, 500);
    }

    //step 4
    let enrollYear = 2023;
    async function signUp() {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "nickname": nickname,
                "email": {"value": email+"@ajou.ac.kr"},
                "password": password,
                "enrollYear": enrollYear,
            })
		});

        if(response.ok) {
            response.json().then(data => {
                if(data) {
                    toastMessage.set('회원가입이 완료되었어요');
                    goto('/login');
                }
            });
        }
		if (!response.ok) {
            response.json().then(data => {
                toastMessage.set(data.message)
            });
		}
    }



</script>

<!-- step 0: 이메일 인증 -->
{#if step == 0}
<main class="m-4 h-screen">
    <h3>
        회원가입을 시작할게요
    </h3>
    <div class="mt-2 text-gray-500 ">
        원활한 서비스 이용을 위해서는<br />학교 이메일 인증이 필요해요.
    </div>
    <div class="flex items-center mt-24 gap-4">
        <label class="relative w-full">
            <input bind:value={email} disabled={isInputDisabled} type="text" class="block w-full border border-b border-t-0 rounded-none border-x-0 {isSendButtonDisabled ? 'border-gray-300' : 'border-blue-500'} p-4 pr-28 disabled:bg-white" />
            <div class="absolute top-4 right-4 text-gray-400">@ajou.ac.kr</div>
        </label>
        <button disabled={isSendButtonDisabled} on:click={sendCode} class="p-2 rounded-lg {isSendButtonDisabled ? "bg-gray-300" : "bg-blue-500"} text-white">
            <Icon icon="send" size={24} />
        </button>
    </div>

    {#if isSent}
        <div in:blur="{{delay: 300}}" class="mt-8 flex justify-center items-end">
            <div class="w-full relative items-center flex h-14 rounded-none border-b {codeFulled ? 'border-blue-500' : 'border-gray-300'} focus:outline-none mr-4">
                <input
                    disabled={isInputDisabled}
                    type="text"
                    class="w-full px-4 disabled:bg-transparent"
                    placeholder="인증번호를 입력하세요"
                    maxlength="4"
                    bind:value={code}
                />
                <div class="mt-2 text-sm text-gray-500 flex justify-end whitespace-nowrap">
                    <span class="font-bold">{Math.floor(timeLeft / 60)}분 {timeLeft % 60}초</span>
                </div>
            </div>
            <button disabled={isVerifyButtonDisabled}
                class="px-4 py-2.5 rounded-lg {isVerifyButtonDisabled ? "bg-gray-300" : "bg-blue-500"} text-sm text-white whitespace-nowrap"
                on:click={verifyEmail}
            >
                인증하기
            </button>
        </div>

    {/if}

    {#if !isStep0ButtonDisabled}
        <div in:blur="{{delay: 300}}" class="mt-12 text-center text-blue-500 shadow p-4 rounded-lg">
            인증이 완료되었어요
        </div>
    {/if}
</main>
<div class="sticky bottom-0 inset-x-0">
    <button disabled={isStep0ButtonDisabled}
        on:click={()=>{
            step = 1;
        }}
    class="{isStep0ButtonDisabled ? 'bg-gray-300': 'bg-blue-500'} text-white py-4 text-lg w-full">
        다음
    </button>
</div>
{/if}

<!-- step 1: 비밀번호 -->
{#if step == 1}
<form on:submit|preventDefault={()=>{
    if(password != password2) {
        toastMessage.set('비밀번호가 일치하지 않아요')
        return;
    } else if(password < 8) {
        toastMessage.set('비밀번호는 최소 8자 이상이에요')
        return;
    } else {
        step = 2;
    }
}}>
    <main class="m-4 h-screen">
        <h3>
            사용할 비밀번호를 입력해주세요
        </h3>
        <div class="mt-2 text-gray-500 ">
            비밀번호는 최소 8자 이상이에요.
        </div>
        <input bind:value={password} minlength="8" type="password" placeholder="비밀번호" class="mt-24 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordValid ? 'border-blue-500' : 'border-gray-300'} p-4" />

        <input bind:value={password2} minlength="8" type="password" placeholder="비밀번호 재입력" class="mt-8 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordSame ? 'border-blue-500' : 'border-gray-300'} p-4" />
    </main>
    <div class="sticky bottom-0 inset-x-0">
        <button disabled={isStep1ButtonDisabled} type="submit" class="{isStep1ButtonDisabled ? 'bg-gray-300': 'bg-blue-500'} text-white py-4 text-lg w-full">
            다음
        </button>
    </div>
</form>
{/if}


<!-- step 2: 닉네임 -->
{#if step == 2}
<main class="m-4 h-screen">
    <h3>
        사용할 닉네임을 알려주세요
    </h3>
    <div class="mt-2 text-gray-500 ">
        닉네임은 2~10글자까지 가능해요.
    </div>
    <input bind:value={nickname} on:input={handleInput} maxlength="10" type="text" placeholder="닉네임" class="mt-24 w-full border border-b border-t-0 rounded-none border-x-0 {isValidnickname ? 'border-blue-500' : 'border-gray-300'} p-4" />
    <div class="mt-1 flex items-center justify-between">
        {#if nicknameErrorMessage}
            <div class="text-red-500 text-sm">{nicknameErrorMessage}</div>
        {:else}
            <div></div>
        {/if}
        <div class="text-gray-500 text-sm">({nickname.length}/10)</div>
    </div>
</main>
<div class="sticky bottom-0 inset-x-0">
    <button disabled={!isValidnickname} on:click={()=>{
        step = 3;
    }}
    class="{isValidnickname ? 'bg-blue-500': 'bg-gray-300'} text-white py-4 text-lg w-full">
        다음
    </button>
</div>
{/if}

<!-- step 3: 입학년도 -->
{#if step == 3}
<main class="m-4 h-screen">
    <h3>
        입학년도를 알려주세요
    </h3>
    <select
        bind:value={enrollYear}
        name="region"
        class="mt-24 text-center w-full bg-white font-bold text-base border rounded-lg h-12"
    >
        {#each [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000] as year}
            <option value={year}>{year}</option>
        {/each}
    </select>
</main>
<div class="sticky bottom-0 inset-x-0">
    <button on:click={async()=>{
        await signUp();
    }}
    class="bg-blue-500 text-white py-4 text-lg w-full">
        완료
    </button>
</div>
{/if}