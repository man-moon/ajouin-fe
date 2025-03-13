<script>
	import { page } from '$app/stores';
	import { reminderStore, bookmarkStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import BackAppbar from '$lib/BackAppbar.svelte';
	import { DatePicker } from '@svelte-plugins/datepicker';
	import { format } from 'date-fns';
	import Icon from '$lib/Icon.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	export const prerender = true;

	export async function entries() {
	const notices = [
		{ id: '3973' },
		{ id: '3974' },
		{ id: '3976' },
	];
	return notices.map((notice) => {
		return { id: notice.id };
	});
}


	let startDate = new Date();
	let dateFormat = 'MM월 dd일 HH:mm';
	let isOpen = false;
	let setRemind = $reminderStore.some((reminder) => reminder.noticeId == $page.params.id);
	$: {
		setRemind = $reminderStore.some((reminder) => reminder.noticeId == $page.params.id);
	}
	let setBookmark = $bookmarkStore.some((bookmark) => bookmark.noticeId == $page.params.id);
	$: {
		setBookmark = $bookmarkStore.some((bookmark) => bookmark.noticeId == $page.params.id);
	}

	const formatDate = (dateString) => {
		return (dateString && format(new Date(dateString), dateFormat)) || '';
	};

	let formattedStartDate = formatDate(startDate);

	let noticeData = {
			isTopFixed: '',
			createdAt: '',
			fetchId: '',
			id: '',
			originalUrl: '',
			title: '',
			html: '',
			noticeType: '',
			summary: '',
			date: '',
		};

	onMount(async () => {
		const response = await fetch(`/api/notice/${$page.params.id}`, {
			method: 'GET'
		});
		noticeData = await response.json();
	});

	function formatSummary(summary) {
		return summary
			.split('\n')
			.map((paragraph, index) => `${index + 1}. ${paragraph.trim()}`)
			.join('<br><br>');
	}

	async function addReminder() {
		const response = await fetch('/api/reminder', {
			method: 'POST',
			body: JSON.stringify({
				noticeId: noticeData.id,
				remindAt: startDate
			})
		});
		if(response.status == 401) {
			toast.push('로그인이 필요한 서비스에요');
			return;
		}

		const data = await response.json();
		if (data.status == 'SCHEDULED') {
			formattedStartDate = formatDate(startDate);
			$reminderStore = [...$reminderStore, { noticeId: noticeData.id, status: 'SCHEDULED' }];
			toast.push(
				`<span class="font-bold">${formattedStartDate}</span>에 리마인드 메일을 보내드릴게요`
			);
		} else if (data.code == 'C007') {
			toast.push('중복된 리마인드 설정이에요');
		}
	}

	async function removeReminder() {
		const response = await fetch(`/api/reminder?noticeId=${noticeData.id}`, {
			method: 'DELETE'
		});
		if (response.status == 200) {
			$reminderStore = $reminderStore.filter((reminder) => reminder.noticeId != noticeData.id);
			toast.push('리마인드 메일을 보내지 않도록 설정했어요');
		} else {
			toast.push('리마인드 해제 도중 문제가 발생했어요');
		}
	}

	async function addBookmark() {
		const response = await fetch(`/api/bookmark?noticeId=${noticeData.id}`, {
			method: 'POST',
		});
		if(response.status == 401) {
			toast.push('로그인이 필요한 서비스에요');
			return;
		}
		if(response.status == 200) {
			setBookmark = true;
			$bookmarkStore = [...$bookmarkStore, { noticeId: noticeData.id }];
			toast.push('북마크에 추가했어요');
		} else {
			toast.push('북마크 추가에 실패했어요');
		}
	}

	async function removeBookmark() {
		const response = await fetch(`/api/bookmark?noticeId=${noticeData.id}`, {
			method: 'DELETE',
		});
		if (response.status == 200) {
			$bookmarkStore = $bookmarkStore.filter((bookmark) => bookmark.noticeId != noticeData.id);
			toast.push('북마크를 해제했어요');
		} else {
			toast.push('북마크 해제 도중 문제가 발생했어요');
		}
	}

	const onDayClick = async () => {
		await addReminder();
	};
</script>

<BackAppbar title="공지사항" />

<h4 class="p-4 break-all">
	{noticeData.title}
</h4>
<div class="px-4">
	<hr />
</div>
<main class="px-4 pt-1">
	<div class="mt-2 flex justify-between items-start">
		<div class="text-sm text-gray-600">
			{noticeData.date}
		</div>
		<div class="flex gap-2">
			<button
				class="p-1.5 rounded-lg border {setBookmark
					? 'text-white bg-blue-500 border-blue-500'
					: 'text-gray-500 border-gray-500'}"
				on:click={async () => {
						if(setBookmark) {
							await removeBookmark();
						} else {
							await addBookmark();
						}
					}}
			>
				<Icon icon="bookmark" size={18} />
			</button>
			<div>
				<button
					class="p-1.5 rounded-lg border {setRemind
						? 'text-white bg-blue-500 border-blue-500'
						: 'text-gray-500 border-gray-500'}"
					on:click={async () => {
						if (setRemind) {
							await removeReminder();
						} else {
							isOpen = !isOpen;
						}
					}}
				>
					<Icon icon="bell" size={18} />
				</button>
				<DatePicker
					{onDayClick}
					bind:isOpen
					bind:startDate
					showTimePicker
					enablePastDates={false}
					enableFutureDates={true}
					align="right"
					showYearControls={false}
					dowLabels={['일', '월', '화', '수', '목', '금', '토']}
					monthLabels={[
						'1월',
						'2월',
						'3월',
						'4월',
						'5월',
						'6월',
						'7월',
						'8월',
						'9월',
						'10월',
						'11월',
						'12월'
					]}
					includeFont={false}
				>
					<input
						class="hidden"
						type="text"
						placeholder="Select date"
						bind:value={formattedStartDate}
					/>
				</DatePicker>
			</div>
		</div>
	</div>

	<div class="mt-4">
		<div class="font-bold text-lg">세 줄 요약</div>
		<div class="mt-1 rounded-lg text-sm bg-blue-50 p-4">
			{@html formatSummary(noticeData.summary)}
		</div>
	</div>

	<div class="mt-8">
		<div class="font-bold text-lg mb-1">본문</div>
		{@html noticeData.html}
	</div>

	<hr class="mt-12" />

	<a href="/" class="block mt-4 w-full py-3 bg-blue-500 rounded-lg text-white text-center">
		공지사항 목록
	</a>
	<a
		href={noticeData.originalUrl}
		target="_blank"
		class="block mt-2 mb-12 w-full py-3 bg-blue-500 rounded-lg text-white text-center"
	>
		원문 바로가기
	</a>
</main>
