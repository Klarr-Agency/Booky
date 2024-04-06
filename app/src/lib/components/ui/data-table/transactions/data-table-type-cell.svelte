<script lang="ts">
	import { types } from "./data";
	export let value: string;
	const type = types.find((type) => type.value === value);
	const Icon = type?.icon;
</script>

{#if type}
	<div class="flex items-center">
		{#if Icon}
			<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
		{/if}
		<span>{type.label}</span>
	</div>
{/if}