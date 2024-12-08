<script lang="ts">
	import type { PageData } from './$types.js';
	import DataTable from '$lib/components/ui/data-table/transactions/data-table.svelte';
	import TransactionForm from './transaction-form.svelte';
	import LabelForm from './label-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ChevronDown } from 'lucide-svelte';
	import { isTransactionDialogOpen, isLabelDialogOpen, labelDialogState } from './store.js';

	export let data: PageData;

	let formData: any = data.form;
	let labelFormData: any = data.labelForm;
	let labelData: any = data.props.labels;
	let transactionData: any = data.props.transactions;
	let transactionLabelData: any = data.props.transactionLabels;

	function labelDialogStates(state: string) {
		if (state === 'edit') {
			$labelDialogState = 'edit';
		} else if (state === 'delete') {
			$labelDialogState = 'delete';
		} else if (state === 'create') {
			$labelDialogState = 'create';
		}
		$isLabelDialogOpen = true;
	}
</script>

<div class=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<!-- Maybe I should add the selected row in the store in data-table-row-actions instead of passing all the transactions here -->
	<TransactionForm
		data={formData}
		createdTransactions={transactionData}
		labels={labelData}
		transactionLabels={transactionLabelData}
	/>
	<LabelForm data={labelFormData} labels={labelData} />
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<h1 class="text-3xl font-bold tracking-tight">Transactions</h1>
		</div>
		<div class="flex items-center gap-2">
			<Button class="hidden md:flex" on:click={() => ($isTransactionDialogOpen = true)}>
				Add Transaction
			</Button>
			<Button class="h-[40px] pr-0" variant="outline" on:click={() => labelDialogStates('create')}>
				Add Label
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							class="ml-4 border-0"
							builders={[builder]}
							variant="outline"
							size="icon"
							on:click={(e) => {
								e.stopPropagation();
							}}
						>
							<ChevronDown class="h-4 w-4" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-46" align="start">
						<DropdownMenu.Group>
							<DropdownMenu.Item on:click={() => labelDialogStates('edit')}>
								Edit Label
							</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => labelDialogStates('delete')}>
								Delete Label
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Button>
		</div>
	</div>
	<DataTable data={transactionData} labels={labelData} transactionLabels={transactionLabelData} />
</div>
