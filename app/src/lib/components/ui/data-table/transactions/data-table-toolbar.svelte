<script lang="ts">
	import type { TableViewModel } from 'svelte-headless-table';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import type { Writable } from 'svelte/store';
	import { types } from './data';
	import type { Transactions } from './schemas';
	import { DataTableFacetedFilter, DataTableViewOptions, DataTableDateFilter } from './index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { DateRange } from 'bits-ui';

	export let tableModel: TableViewModel<Transactions>;
	export let data: Transactions[];

	const counts = data.reduce<{ type: { [index: string]: number } }>(
		(acc, { type }) => {
			acc.type[type] = (acc.type[type] || 0) + 1;
			return acc;
		},
		{ type: {} }
	);

	const { pluginStates } = tableModel;
	const { filterValue }: { filterValue: Writable<string> } = pluginStates.filter;
	const { filterValues }: { filterValues: Writable<{ type: string[]; date: DateRange }> } = pluginStates.colFilter;

	$: showReset =
		($filterValue && $filterValue.length > 0) ||
		($filterValues.type && $filterValues.type.length > 0) ||
		($filterValues.date && $filterValues.date.start && $filterValues.date.end);

</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			placeholder="Filter transactions..."
			class="h-8 w-[150px] lg:w-[250px]"
			type="search"
			bind:value={$filterValue}
		/>
		<DataTableDateFilter bind:value={$filterValues.date} />
		<DataTableFacetedFilter
			bind:filterValues={$filterValues.type}
			title="Type"
			options={types}
			counts={counts.type}
		/>
		{#if showReset}
			<Button
				on:click={() => {
					$filterValue = '';
					$filterValues.type = [];
					$filterValues.date = { start: undefined, end: undefined };
				}}
				variant="ghost"
				class="h-8 px-2 lg:px-3"
			>
				Reset
				<Cross2 class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>

	<DataTableViewOptions {tableModel} />
</div>
