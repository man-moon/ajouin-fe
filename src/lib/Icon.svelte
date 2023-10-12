<script>
	import feather from 'feather-icons';
	export let icon = 'home';
	export let size = 24;
	export let stroke_width = 2;
	export let className = '';
</script>

{#if icon === 'heart-fill'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		fill="currentColor"
		stroke="currentColor"
		stroke-width={stroke_width}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-heart {className}"
		><path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		/></svg
	>
{:else if icon === 'star-fill'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		fill="currentColor"
		stroke="currentColor"
		stroke-width={stroke_width}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-star {className}"
		><polygon
			points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
		/></svg
	>
{:else if icon === 'bookmark-fill'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-bookmark"
		><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg
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
