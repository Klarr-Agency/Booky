<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import DatePicker from '$lib/components/ui/date-picker/data-picker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	let open = false;
	let innerWidth: number;

	let modalText = {
		title: 'Add transaction',
		description: 'Tracks your revenus and expenses by adding a new transaction.',
		saveButton: 'Save transaction'
	};

	$: selectedTransactionType = $formData.transactionType
		? {
				label: $formData.transactionType,
				value: $formData.transactionType
			}
		: undefined;

	function handleDateChange(event: CustomEvent) {
		const dateDetail = event.detail.date;
		// Check if the necessary properties are available
		if (
			!dateDetail ||
			typeof dateDetail.year !== 'number' ||
			typeof dateDetail.month !== 'number' ||
			typeof dateDetail.day !== 'number'
		) {
			console.error('Date detail is missing or incorrect:', dateDetail);
			// Handle the case where the date is not as expected
			return;
		}

		// Since month in JavaScript Date is 0-indexed, subtract 1 from the month
		$formData.date = new Date(dateDetail.year, dateDetail.month - 1, dateDetail.day);
	}
</script>

<svelte:window bind:innerWidth />

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
			<form method="POST" class="grid items-start gap-2">
				<Form.Field {form} name="title">
					<Form.Control let:attrs>
						<Form.Label>Title</Form.Label>
						<Input {...attrs} bind:value={$formData.title} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="importFile">
					<Form.Control let:attrs>
						<Form.Label>Import PDF</Form.Label>
						<Input type="file" {...attrs} bind:value={$formData.importFile} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="transactionType">
					<Form.Control let:attrs>
						<Form.Label>Transaction Type</Form.Label>
						<Select.Root
							selected={selectedTransactionType}
							onSelectedChange={(v) => {
								v && ($formData.transactionType = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Revenu" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="Revenu">Revenu</Select.Item>
								<Select.Item value="Expense">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.transactionType} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="date">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label>Transaction Date</Form.Label>
							<DatePicker on:dateChange={handleDateChange} />
						</div>
						<input hidden bind:value={$formData.date} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="amount">
					<Form.Control let:attrs>
						<Form.Label>Amount (USD)</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.amount} />
					</Form.Control>
				</Form.Field>
				<Form.Button class="mt-4">{modalText.saveButton}</Form.Button>
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
			<form method="POST" class="grid items-start gap-4 px-4" use:enhance>
				<Form.Field {form} name="title">
					<Form.Control let:attrs>
						<Form.Label>Title</Form.Label>
						<Input {...attrs} bind:value={$formData.title} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="importFile">
					<Form.Control let:attrs>
						<Form.Label>Import PDF</Form.Label>
						<Input type="file" {...attrs} bind:value={$formData.importFile} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="transactionType">
					<Form.Control let:attrs>
						<Form.Label>Transaction Type</Form.Label>
						<Select.Root
							selected={selectedTransactionType}
							onSelectedChange={(v) => {
								v && ($formData.transactionType = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Revenu" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="Revenu">Revenu</Select.Item>
								<Select.Item value="Expense">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.transactionType} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="date">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label>Transaction Date</Form.Label>
							<DatePicker on:dateChange={handleDateChange} />
						</div>
						<input hidden bind:value={$formData.date} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="amount">
					<Form.Control let:attrs>
						<Form.Label>Amount (USD)</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.amount} />
					</Form.Control>
				</Form.Field>
				<Form.Button class="mt-4">{modalText.saveButton}</Form.Button>
			</form>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}