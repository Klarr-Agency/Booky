<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/confirm"  use:enhance>
	<div class="grid gap-4">
		<div class="grid gap-2">
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<div class="flex items-end">
						<Form.Label>Password</Form.Label>
					</div>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
        <div class="grid gap-2">
			<Form.Field {form} name="passwordConfirm">
				<Form.Control let:attrs>
					<div class="flex items-end">
						<Form.Label>Confirm password</Form.Label>
					</div>
					<Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Button class="w-full">Change password</Form.Button>
	</div>
</form>
