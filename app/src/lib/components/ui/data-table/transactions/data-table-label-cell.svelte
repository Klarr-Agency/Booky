<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";

	export let value: string = '';
	export let labels: any[] = [];

	$: label = value && labels ? labels.find(l => l.name === value) : null;
</script>

{#if label && label.name && label.color}
	<Badge style="background-color: {label.color}; color: white;">
		{label.name}
	</Badge>
{:else}
	<span>-</span>
{/if}