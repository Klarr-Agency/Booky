<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import DataTable from '$lib/components/ui/data-table/transactions/data-table.svelte';
	import data from './transactions.json';

	let open = false;
	let innerWidth: number;

	let modalText = {
		title: 'Add transaction',
		description: 'Tracks your revenus and expenses by adding a new transaction.',
		saveButton: 'Save transaction'
	};
</script>

<svelte:window bind:innerWidth />

<div class=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<div class="grid justify-start gap-2">
		<Button on:click={() => (open = true)} class="ml-auto gap-1">Add transaction</Button>
	</div>
	{#if innerWidth > 768}
		<Dialog.Root bind:open>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{modalText.title}</Dialog.Title>
					<Dialog.Description>
						{modalText.description}
					</Dialog.Description>
				</Dialog.Header>
				<form class="grid items-start gap-4">
					<div class="grid gap-2">
						<Label for="importFile">Import PDF</Label>
						<Input type="file" id="importFile" />
					</div>
					<div class="grid gap-2">
						<Label for="transactionType">Transaction type</Label>
						<Select.Root>
							<Select.Trigger>
								<Select.Value placeholder="Revenu" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="light">Revenu</Select.Item>
								<Select.Item value="dark">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="grid gap-2">
						<Label for="amount">Amount (USD)</Label>
						<Input type="number" id="amount" value="$10.12" />
					</div>
					<Button class="mt-3" type="submit">{modalText.saveButton}</Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	{:else if innerWidth < 768}
		<Drawer.Root bind:open>
			<Drawer.Content>
				<Drawer.Header class="text-left">
					<Drawer.Title>{modalText.title}</Drawer.Title>
					<Drawer.Description>
						{modalText.description}
					</Drawer.Description>
				</Drawer.Header>
				<form class="grid items-start gap-4 px-4">
					<div class="grid gap-2">
						<Label for="importFile">Import PDF</Label>
						<Input type="file" id="importFile" />
					</div>
					<div class="grid gap-2">
						<Label for="transactionType">Transaction type</Label>
						<Select.Root>
							<Select.Trigger>
								<Select.Value placeholder="Revenu" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="light">Revenu</Select.Item>
								<Select.Item value="dark">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="grid gap-2">
						<Label for="amount">Amount (USD)</Label>
						<Input type="number" id="amount" value="$10.12" />
					</div>
					<Button type="submit">{modalText.saveButton}</Button>
				</form>
				<Drawer.Footer class="pt-2">
					<Drawer.Close asChild let:builder>
						<Button variant="outline" builders={[builder]}>Cancel</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
	<DataTable {data} />
</div>
