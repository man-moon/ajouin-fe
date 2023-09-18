<script>
	import { goto } from '$app/navigation';
	export let title = 'TEXT';
</script>

<div class="fixed w-full max-w-4xl top-0 bg-white h-14 items-center border-b flex">
	<button
		on:click={() => {
			goto('/');
		}}
		class="absolute p-4"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="gray"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-home"
			><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
				points="9 22 9 12 15 12 15 22"
			/></svg
		>
	</button>
	<div class="text-center w-full font-bold">
		{title}
	</div>
</div>
