<script>
	import { selectedType } from '$lib/stores';
	
	export let fetchedTypes = [];
	export let hideHeader = false;
</script>

{#if fetchedTypes.length > 0}
	<div class="sticky top-[104px] z-30 border-b-4 bg-background {hideHeader ? 'transform -translate-y-full' : ''} transition-transform duration-300">
		<div class="container mx-auto">
			<ul class="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 pb-2 pt-1">
				{#each fetchedTypes as type, i}
					<li>
						<input
							type="radio"
							bind:group={$selectedType}
							id={"type-" + i}
							name="noticeType"
							value={type}
							class="peer hidden"
						/>
						<label
							for={"type-" + i}
							class="inline-flex cursor-pointer items-center justify-center rounded-full border px-3 py-1.5 text-xs 
							       peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary
							       text-muted-foreground border-muted transition-colors"
						>
							{type}
						</label>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}