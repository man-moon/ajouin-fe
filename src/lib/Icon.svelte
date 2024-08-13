<script>
	import feather from 'feather-icons';
	export let icon = 'home';
	export let size = 24;
	export let stroke_width = 2;
	export let className = '';
</script>

{#if icon === 'bookmark-fill'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-bookmark"
		><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg
	>
{:else if icon === 'bell-fill'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-bell"
		><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path
			d="M13.73 21a2 2 0 0 1-3.46 0"
		/></svg
	>
{:else}
	{@html feather.icons[icon]
		? feather.icons[icon].toSvg({
				width: size,
				height: size,
				'stroke-width': stroke_width,
				class: className
		  })
		: '-'}
{/if}
