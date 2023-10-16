<script>
    import { blur } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Icon from '$lib/Icon.svelte';
    import { toastMessage } from '$lib/stores';
    import BackAppbar from '$lib/BackAppbar.svelte';

    let step = 0;
    let showLoading = false;

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
			}
		}, 1000);
	}
	async function sendVerificationEmail() {
		const response = await fetch('/api/auth/emailrequest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                emailRequest: {value: email+"@ajou.ac.kr"}
            })
		});

        if(response.ok) {
            response.json().then(data => {
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
		const response = await fetch('/api/auth/emailverify', {
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
                    toastMessage.set('인증이 완료되었어요');
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

    async function signUp() {
        showLoading = true;
        const response = await fetch('api/auth/signup', {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "email": {"value": email+"@ajou.ac.kr"},
                "password": password,
            })
		});

        if(response.ok) {
            showLoading = false;
            response.json().then(data => {
                if(data) {
                    toastMessage.set('회원가입이 완료되었어요');
                    goto('/login');
                }
            });
        }
		if (!response.ok) {
            showLoading = false;
            response.json().then(data => {
                toastMessage.set(data.message);
            });
		}
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
    let capsLockOn = false;

    function checkCapsLock(event) {
        capsLockOn = event.getModifierState('CapsLock');
    }
</script>

<!-- step 0: 이메일 인증 -->
<BackAppbar title="회원가입" />



{#if step == 0}
<main class="m-4">
    <h3>
        회원가입을 시작할게요
    </h3>
    <div class="mt-2 text-gray-500 ">
        원활한 서비스 이용을 위해서는<br />학교 이메일 인증이 필요해요.
        <div class="mt-2 text-xs text-gray-400">※ 제공된 이메일은 중복가입을 방지하고, 이용자 식별을 위한 목적으로만 사용됩니다.</div>
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
</main>
<div class="fixed bottom-0 w-full max-w-4xl">
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
    {#if showLoading}
        <div class="itmes-center mt-24 flex justify-center text-blue-500 z-0">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                class="animate-spin"
                fill="CurrentColor"
                viewBox="0 0 256 256"
            >
                <path
                    d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
                />
            </svg>
        </div>
    {/if}
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
    <main class="m-4">
        <h3>
            사용할 비밀번호를 입력해주세요
        </h3>
        <div class="mt-2 text-gray-500 ">
            최소 8자 이상, 최대 20자의 비밀번호를 입력해주세요.
        </div>
        <input bind:value={password} on:keydown={checkCapsLock} minlength="8" type="password" placeholder="비밀번호" class="mt-24 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordValid ? 'border-blue-500' : 'border-gray-300'} p-4" />
        {#if capsLockOn}
            <div class="mt-1 text-red-500 text-right text-sm">Caps Lock이 켜져있어요</div>
        {/if}
        <input bind:value={password2} on:keydown={checkCapsLock} minlength="8" type="password" placeholder="비밀번호 재입력" class="mt-8 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordSame ? 'border-blue-500' : 'border-gray-300'} p-4" />
        {#if !isPasswordSame && password2.length > 0 && password.length > 0}
            <div class="mt-1 text-red-500 text-right text-sm">비밀번호가 일치하지 않아요</div>
        {/if}
    </main>
    <button on:click={async()=>{
        await signUp();
    }}
    disabled={isStep1ButtonDisabled}
    class="{isStep1ButtonDisabled ? 'bg-gray-300': 'bg-blue-500'} text-white py-4 text-lg w-full fixed bottom-0 w-full max-w-4xl">
        완료
    </button>
</form>
{/if}