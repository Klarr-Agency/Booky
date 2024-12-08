<script lang="ts">
	import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte';
	import { labels } from './data';
	import { type Transactions, transactionSchema } from './schemas';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		currentSelectedTransaction,
		isTransactionDialogOpen
	} from '../../../../../routes/(app)/admin/transactions/store';

	export let row: Transactions;
	const transaction = transactionSchema.parse(row);

	async function openDocument(e: Event) {
		e.preventDefault();
		const formData = new FormData();
		formData.append('download', transaction.id);

		try {
			const response = await fetch('?/downloadDocument', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			const dataObject = JSON.parse(result.data);
			const url = dataObject[3];

			if (url) {
				window.open(url, '_blank');
			} else {
				console.error('URL not found in the response:', result);
			}
		} catch (error) {
			console.error('Failed to fetch:', error);
		}
	}

	function editTransaction() {
		return () => {
			currentSelectedTransaction.set(transaction.id);
			isTransactionDialogOpen.set(true);
		};
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			class="data-[state=open]:bg-muted flex h-8 w-8 p-0"
		>
			<DotsHorizontal class="h-4 w-4" />
			<span class="sr-only">Open Menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[160px]" align="end">
		<button on:click={editTransaction()} class="w-full">
			<DropdownMenu.Item>Edit</DropdownMenu.Item>
		</button>
		<form method="POST" action="?/downloadDocument" on:submit={openDocument}>
			<input hidden value={transaction.id} name="download" />
			<button type="submit" class="w-full">
				<DropdownMenu.Item>Download</DropdownMenu.Item>
			</button>
		</form>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Labels</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={transaction.label}>
					{#each labels as label}
						<DropdownMenu.RadioItem value={label.value}>
							{label.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<form method="POST" action="?/deleteTransaction">
			<input hidden value={transaction.id} name="transactionId" />
			<button type="submit" class="w-full">
				<DropdownMenu.Item>
					Delete
					<DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</button>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
