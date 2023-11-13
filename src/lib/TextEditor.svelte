<script>
	import { onMount } from 'svelte';

	import 'suneditor/dist/css/suneditor.min.css';

	// 에디터의 데이터를 담을 컬럼명인 것이 좋습니다
	export let content;
	let editor;

	onMount(async () => {
		const suneditor = await import('suneditor');
		const { ko } = await import('suneditor/src/lang');
		const plugins = await import('suneditor/src/plugins');
		editor = suneditor.default.create('editor', {
			buttonList: [
				['fontSize', 'bold', 'italic', 'list', 'formatBlock'],
				['image', 'link']
			],
			plugins,
			lang: ko
		});
		editor.onChange = (text) => {
			content = text;
		};
	});

	onMount(() => {
		() => editor.destroy();
	});
</script>

<textarea id="editor" class="w-full h-96" bind:value={content} />