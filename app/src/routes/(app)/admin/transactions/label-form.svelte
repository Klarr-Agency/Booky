<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { labelSchema, type LabelSchema } from './schema';
	import { isLabelDialogOpen, labelDialogState, labelFormSubmitted } from './store';

	export let data: SuperValidated<Infer<LabelSchema>>;
	export let labels: any[];

	type ModalText = {
		title: string;
		description: string;
		saveButton: string;
	};

	type ValidFieldNames = keyof typeof labelSchema.shape;

	const form = superForm(data, {
		validators: zodClient(labelSchema)
	});

	const { form: formData, enhance } = form;

	let modalText: ModalText;
	let selectedLabel: { value: string; label: string } | undefined;

	$: modalText = {
		title:
			$labelDialogState === 'create'
				? 'Add Label'
				: $labelDialogState === 'edit'
					? 'Edit Label'
					: 'Delete Label',
		description:
			$labelDialogState === 'create'
				? 'Create a new label for categorizing transactions.'
				: $labelDialogState === 'edit'
					? 'Update your label details.'
					: 'Select a label to delete.',
		saveButton:
			$labelDialogState === 'create'
				? 'Save Label'
				: $labelDialogState === 'edit'
					? 'Update Label'
					: 'Delete Label'
	};

	const fieldNames: ValidFieldNames[] = Object.keys(labelSchema.shape) as ValidFieldNames[];

	async function validateFormAndManageDialog(event: Event) {
		event.preventDefault();
		$labelFormSubmitted = true;
		let allFieldsValid = true;

		const fieldsToValidate: ValidFieldNames[] =
			$labelDialogState === 'delete' ? ['id'] : fieldNames;

		for (const fieldName of fieldsToValidate) {
			const validationErrors = await form.validate(fieldName);
			if (validationErrors) {
				allFieldsValid = false;
				console.error(`Validation error in ${fieldName}:`, validationErrors);
			}
		}

		if (allFieldsValid) {
			$isLabelDialogOpen = false;

			setTimeout(function () {
				location.reload();
			}, 200);
		} else {
			console.error('Form has errors:', form.errors);
		}
	}

	function resetDialog() {
		if ($isLabelDialogOpen && !$labelFormSubmitted) {
			$formData = {
				id: '',
				name: '',
				color: '#000000'
			};
		}
		$labelFormSubmitted = false;
	}
</script>

<Dialog.Root bind:open={$isLabelDialogOpen} onOpenChange={resetDialog}>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{modalText.title}</Dialog.Title>
			<Dialog.Description>
				{modalText.description}
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action={$labelDialogState === 'create'
				? '?/createLabel'
				: $labelDialogState === 'edit'
					? '?/editLabel'
					: '?/deleteLabel'}
			class="grid items-start gap-2"
			use:enhance
			on:submit={validateFormAndManageDialog}
		>
			{#if $labelDialogState === 'edit' || $labelDialogState === 'delete'}
				<Form.Field {form} name="id">
					<Form.Control let:attrs>
						<Form.Label>Select Label</Form.Label>
						<Select.Root
							selected={selectedLabel}
							onSelectedChange={(v) => {
								if (v) {
									$formData.id = v.value;
									const label = labels.find((l) => l.id === v.value);
									if (label) {
										$formData.name = label.name;
										$formData.color = label.color;
									}
								}
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select a label" />
							</Select.Trigger>
							<Select.Content>
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
						<input hidden bind:value={$formData.id} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			{#if $labelDialogState !== 'delete'}
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Label Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="color">
					<Form.Control let:attrs>
						<Form.Label>Color</Form.Label>
						<div class="flex gap-2">
							<Input type="color" {...attrs} bind:value={$formData.color} class="h-10 w-10 p-1" />
							<Input {...attrs} bind:value={$formData.color} placeholder="#000000" class="h-10" />
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
			<Form.Button
				class="mt-4"
				variant={$labelDialogState === 'delete' ? 'destructive' : 'default'}
			>
				{modalText.saveButton}
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
