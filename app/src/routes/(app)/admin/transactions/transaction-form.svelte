<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { formSchema, type FormSchema } from './schema';
	import { currentSelectedTransaction, isTransactionDialogOpen, formSubmitted } from './store';
	import { convertStringToNumber } from '$lib/utils/utils';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let createdTransactions: FormData[];
	export let labels: any[];
	export let transactionLabels: any[];

	type ModalText = {
		title: string;
		description: string;
		saveButton: string;
	};

	type FormData = {
		id: string;
		receiptNumber: string;
		title: string;
		type: 'revenue' | 'expense';
		date: Date | string;
		currency: 'usd' | 'cad';
		amount: number;
		document?: File | null;
	};

	type ValidFieldNames<T> = {
		[P in keyof T]: T[P] extends Zod.ZodTypeAny ? P : never;
	}[keyof T];

	type FieldNames = ValidFieldNames<typeof formSchema.shape>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	let innerWidth: number;
	let amountString = '';
	let modalText: ModalText;
	$: hideDocumentDisplay = false;
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

	$: if ($currentSelectedTransaction !== null) {
		const transaction = createdTransactions.find((t: any) => t.id === $currentSelectedTransaction);
		if (transaction) {
			initializeFormData(transaction);
		}
		modalText = {
			title: 'Edit transaction',
			description: 'Update your transaction details.',
			saveButton: 'Update transaction'
		};
	} else {
		modalText = {
			title: 'Add transaction',
			description: 'Tracks your revenues and expenses by adding a new transaction.',
			saveButton: 'Save transaction'
		};
	}
	$: $formData.amount = convertStringToNumber(amountString);

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined;
	let placeholder: DateValue = today(getLocalTimeZone());
	$: value = $formData.date ? parseDate($formData.date) : undefined;
	let selectedLabel: { value: string; label: string } | undefined;

	async function initializeFormData(transaction: FormData) {
		const date = transaction.date;
		// Remove document from spread object
		const { document, ...otherFields } = transaction;

		$formData = {
			...otherFields,
			date: typeof date === 'string' && date.includes(' ') ? date.split(' ')[0] : String(date)
		};
		amountString = transaction.amount.toString();
		selectedTransactionType = {
			label: $formData.type.charAt(0).toUpperCase() + $formData.type.slice(1),
			value: $formData.type
		};
		selectedCurrency = {
			label: $formData.currency.toUpperCase(),
			value: $formData.currency
		};

		const transactionLabel = transactionLabels.find((tl) => tl.transactionId === transaction.id);
		if (transactionLabel) {
			const label = labels.find((l) => l.id === transactionLabel.labelId);
			if (label) {
				selectedLabel = { value: label.id, label: label.name };
				$formData.labelId = label.id;
			}
		} else {
			selectedLabel = undefined;
			$formData.labelId = '';
		}
	}

	async function getDocument(transactionId: string) {
		const formData = new FormData();
		formData.append('download', transactionId);

		try {
			const response = await fetch('?/downloadDocument', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			const dataObject = JSON.parse(result.data);
			const url = dataObject[3];

			if (url) {
				return url;
			}
		} catch (error) {
			console.error('Failed to fetch:', error);
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement; // Cast the target to HTMLInputElement
		if (input && input.files && input.files.length > 0) {
			const file = input.files[0]; // Get the first file
			if (file instanceof File) {
				$formData.document = file; // Assign the file if it is a File instance
			} else {
				console.error('The selected file is not an instance of File.');
				$formData.document = null; // Set the file to undefined if not a File instance
			}
		} else {
			console.error('No file selected or the file input is not properly configured.');
			$formData.document = null; // Set the file to undefined if no files are selected
		}
	}

	const fieldNames: FieldNames[] = Object.keys(formSchema.shape) as FieldNames[];

	async function validateFormAndManageDialog(event: Event) {
		event.preventDefault();
		$formSubmitted = true;
		// Validate each field individually
		let allFieldsValid = true;

		for (const fieldName of fieldNames) {
			const validationErrors = await form.validate(fieldName);
			if (validationErrors) {
				// This checks if there are any validation errors returned
				allFieldsValid = false;
				console.error(`Validation error in ${fieldName}:`, validationErrors);
			}
		}

		if (allFieldsValid) {
			$isTransactionDialogOpen = false;

			setTimeout(function () {
				location.reload();
			}, 200);
		} else {
			console.error('Form has errors:', form.errors);
		}
	}

	function resetDialog() {
		if ($isTransactionDialogOpen && !$formSubmitted) {
			currentSelectedTransaction.set(null);
			$isTransactionDialogOpen = false;
			amountString = '';
			$formData = {
				id: '',
				receiptNumber: '',
				title: '',
				type: 'revenue',
				date: '',
				currency: 'usd',
				amount: 0,
				document: undefined
			};
			selectedLabel = undefined;
			$formData.labelId = '';
		}
		$formSubmitted = false;
		hideDocumentDisplay = false;
	}

	function hideDocument() {
		$formData.document = null;
		hideDocumentDisplay = true;
	}
</script>

<svelte:window bind:innerWidth />

{#if innerWidth > 768}
	<Dialog.Root bind:open={$isTransactionDialogOpen} onOpenChange={resetDialog}>
		<Dialog.Content class="sm:max-w-[600px]">
			<Dialog.Header>
				<Dialog.Title>{modalText.title}</Dialog.Title>
				<Dialog.Description>
					{modalText.description}
				</Dialog.Description>
			</Dialog.Header>
			<form
				method="POST"
				action={$currentSelectedTransaction !== null ? '?/editTransaction' : '?/createTransaction'}
				class="grid items-start gap-2"
				use:enhance
				enctype="multipart/form-data"
				on:submit={validateFormAndManageDialog}
			>
				<input type="hidden" bind:value={$formData.id} name="id" />
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
						<Input type="file" {...attrs} on:change={handleFileChange} />
						{#if $currentSelectedTransaction !== null}
							{#if $formData.id !== undefined}
								{#await getDocument($formData.id) then document}
									{#if document && !hideDocumentDisplay}
										<div class="flex justify-between gap-2">
											<a
												href={document}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 underline"
											>
												View document
											</a>
											<button
												type="button"
												on:click={() => {
													hideDocument();
												}}
												class="text-red-600 underline"
											>
												Delete document
											</button>
											<input hidden bind:value={$formData.document} />
										</div>
									{/if}
								{:catch error}
									<p>Failed to load document: {error.message}</p>
								{/await}
							{/if}
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="date">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label>Transaction Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'justify-start pl-4 text-left font-normal',
										!value && 'text-muted-foreground'
									)}
								>
									{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										{value}
										bind:placeholder
										minValue={new CalendarDate(1900, 1, 1)}
										maxValue={today(getLocalTimeZone())}
										calendarLabel="Date of transaction"
										initialFocus
										onValueChange={(v) => {
											if (v) {
												$formData.date = v.toString();
											} else {
												$formData.date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
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
				<Form.Field {form} name="labelId">
					<Form.Control let:attrs>
						<Form.Label>Label</Form.Label>
						<Select.Root
							selected={selectedLabel}
							onSelectedChange={(v) => {
								v && ($formData.labelId = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select a label" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">No label</Select.Item>
								{#each labels as label}
									<Select.Item value={label.id}>
										<div class="flex items-center">
											<div
												class="mr-2 h-3 w-3 rounded-full"
												style="background-color: {label.color};"
											></div>
											{label.name}
										</div>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.labelId} name={attrs.name} />
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
	<Drawer.Root bind:open={$isTransactionDialogOpen} onOpenChange={resetDialog}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>{modalText.title}</Drawer.Title>
				<Drawer.Description>
					{modalText.description}
				</Drawer.Description>
			</Drawer.Header>
			<form
				method="POST"
				action={$currentSelectedTransaction !== null ? '?/editTransaction' : '?/createTransaction'}
				class="grid items-start gap-4 px-4"
				use:enhance
				enctype="multipart/form-data"
				on:submit={validateFormAndManageDialog}
			>
				<input type="hidden" bind:value={$formData.id} name="id" />
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
						<Input type="file" {...attrs} on:change={handleFileChange} />
						{#if $currentSelectedTransaction !== null}
							{#if $formData.id !== undefined}
								{#await getDocument($formData.id) then document}
									{#if document && !hideDocumentDisplay}
										<div class="flex justify-between gap-2">
											<a
												href={document}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 underline"
											>
												View document
											</a>
											<button
												type="button"
												on:click={() => {
													hideDocument();
												}}
												class="text-red-600 underline"
											>
												Delete document
											</button>
											<input hidden bind:value={$formData.document} />
										</div>
									{/if}
								{:catch error}
									<p>Failed to load document: {error.message}</p>
								{/await}
							{/if}
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="date">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label>Transaction Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'justify-start pl-4 text-left font-normal',
										!value && 'text-muted-foreground'
									)}
								>
									{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										{value}
										bind:placeholder
										minValue={new CalendarDate(1900, 1, 1)}
										maxValue={today(getLocalTimeZone())}
										calendarLabel="Date of transaction"
										initialFocus
										onValueChange={(v) => {
											if (v) {
												$formData.date = v.toString();
											} else {
												$formData.date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
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
