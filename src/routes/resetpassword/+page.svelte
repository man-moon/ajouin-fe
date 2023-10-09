<script>
    import { blur } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Icon from '$lib/Icon.svelte';
    import { toastMessage } from '$lib/stores';
    import BackAppbar from '$lib/BackAppbar.svelte';

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
			}
		}, 1000);
	}
	async function sendVerificationEmail() {
		const response = await fetch('/api/auth/resetpassword/emailrequest', {
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
                if(data.message == '해당 이메일로 가입된 계정이 없어요') {
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

    async function resetPassword() {
        const response = await fetch('api/auth/resetpassword', {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                "id": verificationId,
                "email": {"value": email+"@ajou.ac.kr"},
                "password": password,
            })
		});

        if(response.ok) {
            toastMessage.set('비밀번호 변경이 완료되었어요');
            goto('/login');
        }
		if (!response.ok) {
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
</script>

<!-- step 0: 이메일 인증 -->
<BackAppbar title="비밀번호 재설정" />
{#if step == 0}
<main class="m-4">
    <h3>
        비밀번호를 잊으셨나요?
    </h3>
    <div class="mt-2 text-gray-500 ">
        비밀번호를 재설정하기 위해서<br />학교 이메일 인증이 필요해요.
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
            비밀번호는 최소 8자 이상이에요.
        </div>
        <input bind:value={password} minlength="8" type="password" placeholder="비밀번호" class="mt-24 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordValid ? 'border-blue-500' : 'border-gray-300'} p-4" />

        <input bind:value={password2} minlength="8" type="password" placeholder="비밀번호 재입력" class="mt-8 w-full border border-b border-t-0 rounded-none border-x-0 {isPasswordSame ? 'border-blue-500' : 'border-gray-300'} p-4" />
    </main>
    <button on:click={async()=>{
        await resetPassword();
    }}
    disabled={isStep1ButtonDisabled}
    class="{isStep1ButtonDisabled ? 'bg-gray-300': 'bg-blue-500'} text-white py-4 text-lg w-full fixed bottom-0 w-full max-w-4xl">
        완료
    </button>
</form>
{/if}