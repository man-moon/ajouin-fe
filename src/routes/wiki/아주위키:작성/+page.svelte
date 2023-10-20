<script>
    import TextEditor from "$lib/TextEditor.svelte";
    import BackAppBar from "$lib/BackAppBar.svelte";
	let content;
    let category;
    let agreeTerm = false;
</script>

<BackAppBar title="위키 글 작성"/>

<main class="p-4">
    <label>
        <div class="font-semibold text-gray-700">카테고리</div>
        <select bind:value={category} class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option>맛집</option>
            <option>교수진</option>
            <option>건물</option>
        </select>
    </label>
    <label class="block mt-4">
        <div class="font-semibold text-gray-700">제목</div>
        <input type="text" class="relative mt-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-lg" />
    </label>
    <div class="mt-4">
        <div class="font-semibold text-gray-700">본문</div>
        <TextEditor bind:content />
    </div>
    <!-- 약관 동의 -->
    <div class="mt-4">
        <label class="flex items-center">
            <input type="checkbox" bind:checked={agreeTerm} />
            <span class="ml-2 text-sm text-gray-600">약관에 동의합니다.</span>
        </label>
    </div>
</main>

<button on:click={async()=>{
}}
class="{agreeTerm ? 'bg-blue-500' : 'bg-gray-300'} text-white py-4 text-lg w-full max-w-4xl"
disabled={!agreeTerm}>
    작성하기
</button>