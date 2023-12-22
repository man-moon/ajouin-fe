<script>
    import BackAppbar from "$lib/BackAppbar.svelte";
    import Icon from "$lib/Icon.svelte";
    import { onMount } from 'svelte';

    let docs = [];

    onMount(async() => {
		//모든 문서 가져오기
		const response = await fetch('/api/wiki/doc_list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.ok) {
			const data = await response.json();
			docs = data.documents;
		}
    });
</script>

<BackAppbar title="위키 문서"/>

<main class="p-4">
    <div class="flex flex-wrap gap-4">
        {#each docs as doc}
            <div class="rounded-lg bg-white p-4 shadow transition-all duration-500 ease-in-out hover:-translate-y-1">
                <a href="/wiki/{doc.title}" class="">
                    <div class="font-bold">{doc.title}</div>
                </a>
            </div>
        {/each}
    </div>
</main>