<script>
	import Appbar from '$lib/Appbar.svelte';
	import Nav from '$lib/Nav.svelte';
	import Icon from '$lib/Icon.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toastMessage, ACCESS_TOKEN, API_BASE_URL } from '$lib/stores';

	let nickname = '닉네임',
		email = 'example@ajou.ac.kr',
		enrollYear = '18',
		department = '소프트웨어';

	onMount(async () => {
		const accessToken = $ACCESS_TOKEN || localStorage.getItem('accessToken');
		if (accessToken) {
			$ACCESS_TOKEN = accessToken;
			await getMyInfo();
		}
	});

	async function getMyInfo() {
		const response = await fetch(`${API_BASE_URL}/member`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: $ACCESS_TOKEN
			}
		});

		if (response.ok) {
			response.json().then((data) => {
				nickname = data.nickname;
				email = data.email.value;
				enrollYear = data.enrollYear.toString().slice(2, 4);
			});
		}
		if (!response.ok) {
			response.json().then((data) => {
				if (data.code == 'M002') {
					goto('/login');
				}
				toastMessage.set(data.message);
			});
		}
	}
</script>

<Appbar title="마이페이지" />

<main>
	<div class="pt-8 p-4 flex gap-4">
		<div>
			<div class="bg-gray-300 w-24 h-24 rounded-full relative">
				<button class="absolute bottom-1 right-1 text-gray-500">
					<Icon icon="edit" size={20} />
				</button>
			</div>
		</div>
		<div class="w-full">
			<div class="flex justify-between items-start">
				<div class="">
					<div class="font-bold text-xl">{nickname}</div>
					<div class="text-sm text-gray-500">{enrollYear}학번</div>
					<div class="text-sm text-gray-500">{department}학과</div>
					<div class="text-sm text-gray-500">{email}</div>
				</div>
				<button class="flex items-center text-sm text-gray-600">
					수정하기
					<Icon icon="chevron-right" size={16} />
				</button>
			</div>
		</div>
	</div>

	<hr class="my-4 h-2 bg-gray-100" />

	<!-- 즐겨찾기 한 학교 소식 -->
	<div class="flex items-center justify-between px-4">
		<h3>
			<div class="font-bold text-lg text-gray-700">즐겨찾기 한 학교 소식</div>
		</h3>
		<button class="text-sm text-gray-600 flex items-center">
			더 보기
			<Icon icon="chevron-right" size={16} />
		</button>
	</div>
	<div class="px-4">
		{#each [1, 2, 3] as i}
			<a href="#" class="flex justify-between gap-4 py-4 {i != 3 ? 'border-b' : ''}">
				<div class="h-24 font-semibold text-lg text-gray-700">소식 제목</div>
			</a>
		{/each}
	</div>
	<hr class="my-4 h-2 bg-gray-100" />

	<!-- 즐겨찾기 한 문서 -->
	<div class="flex items-center justify-between px-4">
		<h3>
			<div class="font-bold text-lg text-gray-700">즐겨찾기 한 문서</div>
		</h3>
		<button class="text-sm text-gray-600 flex items-center">
			더 보기
			<Icon icon="chevron-right" size={16} />
		</button>
	</div>
	<div class="px-4">
		{#each [1, 2, 3] as i}
			<div class="flex justify-between gap-4 py-4 {i != 3 ? 'border-b' : ''}">
				<div class="flex flex-col">
					<div class="font-semibold text-lg text-gray-700">문서 제목</div>
					<div class="text-sm text-gray-500">내용</div>
				</div>
				<div class="bg-gray-300 w-24 h-24 rounded-lg" />
			</div>
		{/each}
	</div>

	<hr class="my-4 h-2 bg-gray-100" />

	<!-- 앱 관련 -->
	<h3 class="px-4 font-bold text-lg text-gray-700">앱 관련</h3>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		설정
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		공지사항
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		문의하기
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		앱 정보
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<a href="/login" class="p-4 flex items-center justify-between text-gray-700">
		로그아웃
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<a href="#" class="p-4 flex items-center justify-between text-gray-700">
		회원탈퇴
		<div class="text-gray-500">
			<Icon icon="chevron-right" size={24} />
		</div>
	</a>
	<div class="p-4 flex items-center justify-between text-gray-700">
		앱 버전
		<div class="text-gray-500">v1.0.0</div>
	</div>
</main>

<div class="h-24" />

<Nav currentPath="/mypage" />
