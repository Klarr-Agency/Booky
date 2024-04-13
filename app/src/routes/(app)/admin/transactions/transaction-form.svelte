<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import DatePicker from '$lib/components/ui/date-picker/data-picker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	let innerWidth: number;
	let amountString = '';
	let open = false;

	let modalText = {
		title: 'Add transaction',
		description: 'Tracks your revenus and expenses by adding a new transaction.',
		saveButton: 'Save transaction'
	};

	$: selectedTransactionType = $formData.type
		? {
				label: $formData.type.charAt(0).toUpperCase() + $formData.type.slice(1),
				value: $formData.type
			}
		: undefined;

	$: selectedCurrency = $formData.currency
		? {
				label: $formData.currency.toUpperCase(),
				value: $formData.currency
			}
		: undefined;
	// Convert string to number
	$: amountNumber = Number(amountString);
	$: $formData.amount = amountNumber;

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
	async function handleSubmit(event: Event) {
		event.preventDefault();
		amountString = '';
		open = false;
		location.reload();
	}
</script>

<svelte:window bind:innerWidth />

<div class="grid justify-start gap-2">
	<Button on:click={() => (open = true)} class="ml-auto gap-1">Add transaction</Button>
</div>
{#if innerWidth > 768}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-[600px]">
			<Dialog.Header>
				<Dialog.Title>{modalText.title}</Dialog.Title>
				<Dialog.Description>
					{modalText.description}
				</Dialog.Description>
			</Dialog.Header>
			<form
				method="POST"
				class="grid items-start gap-2"
				use:enhance
				enctype="multipart/form-data"
				on:submit={handleSubmit}
			>
				<div class="flex gap-4">
					<Form.Field {form} name="title" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Title</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="receiptNumber" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Receipt Number</Form.Label>
							<Input {...attrs} bind:value={$formData.receiptNumber} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="document">
					<Form.Control let:attrs>
						<Form.Label>Import PDF</Form.Label>
						<Input type="file" {...attrs} bind:value={$formData.document} />
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
				<Form.Field {form} name="type">
					<Form.Control let:attrs>
						<Form.Label>Transaction Type</Form.Label>
						<Select.Root
							selected={selectedTransactionType}
							onSelectedChange={(v) => {
								v && ($formData.type = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Revenue" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="revenue">Revenu</Select.Item>
								<Select.Item value="expense">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.type} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex gap-4">
					<Form.Field {form} name="amount" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Amount</Form.Label>
							<Input type="number" {...attrs} bind:value={amountString} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="currency" class="min-w-[100px]">
						<Form.Control let:attrs>
							<Form.Label>Currency</Form.Label>
							<Select.Root
								selected={selectedCurrency}
								onSelectedChange={(v) => {
									v && ($formData.currency = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="USD" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="usd">USD</Select.Item>
									<Select.Item value="cad">CAD</Select.Item>
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.currency} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
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
			<form
				method="POST"
				class="grid items-start gap-4 px-4"
				use:enhance
				enctype="multipart/form-data"
			>
				<div class="flex gap-4">
					<Form.Field {form} name="title" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Title</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="receiptNumber" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Receipt Number</Form.Label>
							<Input {...attrs} bind:value={$formData.receiptNumber} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="document">
					<Form.Control let:attrs>
						<Form.Label>Import PDF</Form.Label>
						<Input type="file" {...attrs} bind:value={$formData.document} />
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
				<Form.Field {form} name="type">
					<Form.Control let:attrs>
						<Form.Label>Transaction Type</Form.Label>
						<Select.Root
							selected={selectedTransactionType}
							onSelectedChange={(v) => {
								v && ($formData.type = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Revenue" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="revenue">Revenu</Select.Item>
								<Select.Item value="expense">Expense</Select.Item>
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.type} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex gap-4">
					<Form.Field {form} name="amount" class="flex-grow">
						<Form.Control let:attrs>
							<Form.Label>Amount</Form.Label>
							<Input type="number" {...attrs} bind:value={amountString} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="currency" class="min-w-[100px]">
						<Form.Control let:attrs>
							<Form.Label>Currency</Form.Label>
							<Select.Root
								selected={selectedCurrency}
								onSelectedChange={(v) => {
									v && ($formData.currency = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="USD" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="usd">USD</Select.Item>
									<Select.Item value="cad">CAD</Select.Item>
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.currency} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
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
