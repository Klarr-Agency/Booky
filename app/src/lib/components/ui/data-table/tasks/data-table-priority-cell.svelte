<script lang="ts">
	import { priorities } from "./data";
	export let value: string;
	const priority = priorities.find((priority) => priority.value === value);
	const Icon = priority?.icon;
</script>

{#if priority}
	<div class="flex items-center">
		{#if Icon}
			<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
		{/if}
		<span>{priority.label}</span>
	</div>
{/if}