<script>
	import { page } from '$app/stores';
	import { reminderStore, bookmarkStore, viewedNotices } from '$lib/stores';
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
		
		// 공지사항을 읽은 것으로 표시
		viewedNotices.markAsViewed($page.params.id);
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

<div class="notice-container px-3">
	<div class="pt-4">
		<h1 class="text-xl font-semibold leading-tight break-all">
			{noticeData.title}
		</h1>
	</div>
	
	<div class="mt-2 border-b border-border/40 pb-3">
		<div class="flex justify-between items-start">
			<div class="text-sm text-muted-foreground">
				{noticeData.date}
			</div>
			<div class="flex gap-2">
				<button
					class="p-1.5 rounded-lg border {setBookmark
						? 'text-primary-foreground bg-primary border-primary'
						: 'text-muted-foreground border-input hover:bg-primary/10 hover:text-primary transition-colors'}"
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
							? 'text-primary-foreground bg-primary border-primary'
							: 'text-muted-foreground border-input hover:bg-primary/10 hover:text-primary transition-colors'}"
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
	</div>

	<div class="mt-6">
		<div class="flex items-center gap-2 mb-2">
			<div class="text-lg font-semibold">세 줄 요약</div>
		</div>
		<div class="rounded-lg text-sm bg-primary/5 p-3 border border-border/40">
			{@html formatSummary(noticeData.summary)}
		</div>
	</div>

	<div class="mt-8">
		<div class="text-lg font-semibold mb-4">본문</div>
		<div class="prose prose-sm max-w-none">
			{@html noticeData.html}
		</div>
	</div>

	<div class="border-t border-border/40 mt-10 pt-6 pb-12 flex flex-col gap-3">
		<a href="/" class="inline-flex justify-center py-2.5 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
			공지사항 목록
		</a>
		<a
			href={noticeData.originalUrl}
			target="_blank"
			class="inline-flex justify-center py-2.5 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
		>
			원문 바로가기
		</a>
	</div>
</div>
