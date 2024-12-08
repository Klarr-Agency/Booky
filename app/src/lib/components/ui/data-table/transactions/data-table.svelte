<script lang="ts">
	import { get, readable } from 'svelte/store';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addColumnFilters,
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import type { Transactions } from './schemas';
	import {
		DataTableToolbar,
		DataTableTypeCell,
		DataTableColumnHeader,
		DataTablePagination,
		DataTableRowActions,
		DataTableTitleCell,
		DataTableDateCell,
		DataTableLabelCell
	} from './index.js';
	/* Default import */
	import { DataTableCheckbox } from '../index.js';
	import {
		getLocalTimeZone,
		today,
		startOfMonth,
		endOfMonth,

	} from '@internationalized/date';
	let now = today(getLocalTimeZone());

	import * as Table from '$lib/components/ui/table';

	export let data: Transactions[];
	export let labels: any[];
	export let transactionLabels: any[];

	function formatDate(dateString: string) {
		// Split the dateString by the space to ignore the time part
		const datePart = dateString.split(' ')[0];

		// Create a date object from the date part
		const date = new Date(datePart);

		// Extract the day, month, and year components
		const day = date.getUTCDate().toString().padStart(2, '0');
		const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // January is 0
		const year = date.getUTCFullYear();

		// Return the formatted string
		return `${day}/${month}/${year}`;
	}

	function toDate(dateObj: { year: number; month: number; day: number }): Date {
		return new Date(dateObj.year, dateObj.month - 1, dateObj.day);
	}

	type FilterValue =
		| string
		| {
				start: { year: number; month: number; day: number } | undefined;
				end: { year: number; month: number; day: number } | undefined;
		  };

	const table = createTable(readable(data), {
		select: addSelectedRows(),
		sort: addSortBy({ toggleOrder: ['asc', 'desc'] }),
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }: { filterValue: FilterValue; value: string }) => {

				if (
					filterValue &&
					typeof filterValue === 'object' &&
					'start' in filterValue &&
					'end' in filterValue &&
					filterValue.start &&
					filterValue.end
				) {
					const date = new Date(value);
					const startDate = toDate(filterValue.start);
					const endDate = toDate(filterValue.end);

					if (startDate && endDate) {
						return date >= startDate && date <= endDate;
					}
				}

				return value.toLowerCase().includes((filterValue as string).toLowerCase());
			}
		}),
		colFilter: addColumnFilters(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.display({
			id: 'select',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected,
					'aria-label': 'Select all'
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected,
					'aria-label': 'Select row',
					class: 'translate-y-[2px]'
				});
			},
			plugins: { sort: { disable: true } }
		}),
		table.column({
			accessor: 'receiptNumber',
			header: () => '# Transaction',
			id: 'receiptNumber',
			plugins: { sort: { disable: true } }
		}),
		table.column({
			accessor: 'date',
			header: 'Date',
			id: 'date',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(DataTableDateCell, {
						value: formatDate(value)
					});
				}
				return formatDate(value);
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }: { filterValue: FilterValue; value: string }) => {
						if (
							filterValue &&
							typeof filterValue === 'object' &&
							filterValue.start &&
							filterValue.end
						) {
							const date = new Date(value);
							const startDate = toDate(filterValue.start);
							const endDate = toDate(filterValue.end);

							if (startDate && endDate) {
								return date >= startDate && date <= endDate;
							}
						}
						return true;
					},
					initialFilterValue: { start: startOfMonth(now), end: endOfMonth(now)  },
					render: ({ filterValue }) => get(filterValue)
				}
			}
		}),
		table.column({
			accessor: 'title',
			header: 'Title',
			id: 'title',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(DataTableTitleCell, {
						value,
						labelValue: row.original.label
					});
				}
				return value;
			}
		}),
		/*table.column({
			accessor: "status",
			header: "Status",
			id: "status",
			cell: ({ value }) => {
				return createRender(DataTableStatusCell, {
					value,
				});
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== "string") return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					},
				},
			},
		}),*/
		table.column({
			accessor: 'type',
			id: 'type',
			header: 'Type',
			cell: ({ value }) => createRender(DataTableTypeCell, { value }),
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
						return filterValue.some(filter => value.includes(filter));
					},
					initialFilterValue: [],
					render: ({ filterValue }) => get(filterValue)
				}
			}
		}),
		table.column({
			accessor: (row) => {
				if (!row || !row.id || !Array.isArray(transactionLabels) || !Array.isArray(labels)) {
					return '';
				}
				const transactionLabel = transactionLabels.find((tl) => tl.transactionId === row.id);
				if (transactionLabel && transactionLabel.labelId) {
					const label = labels.find((l) => l.id === transactionLabel.labelId);
					return label ? label.name : '';
				}
				return '';
			},
			header: 'Label',
			id: 'label',
			cell: ({ value }) => createRender(DataTableLabelCell, { value, labels: labels || [] })
		}),
		table.column({
			accessor: 'amount',
			header: 'Amount',
			id: 'amount'
		}),
		table.display({
			id: 'actions',
			header: () => '',
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(DataTableRowActions, {
						row: row.original
					});
				}
				return '';
			}
		})
	]);

	const tableModel = table.createViewModel(columns);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableModel;
</script>

<div class="space-y-4">
	<DataTableToolbar {tableModel} {data} />
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id !== 'select' && cell.id !== 'actions'}
											<DataTableColumnHeader {props} {tableModel} cellId={cell.id}>
												<Render of={cell.render()} />
											</DataTableColumnHeader>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#if $pageRows.length}
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											{#if cell.id === 'actions'}
												<div class="w-[10px]">
													<Render of={cell.render()} />
												</div>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				{:else}
						<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
	<DataTablePagination {tableModel} />
</div>
