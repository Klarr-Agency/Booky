<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/register"  use:enhance>
	<div class="grid gap-4">
		<div class="grid gap-2">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>
					<Input {...attrs} bind:value={$formData.email} placeholder="m@example.com"/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
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
						<Form.Label>Confirm Password</Form.Label>
					</div>
					<Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<RadioGroup.Root class="flex justify-center">
			<div class="flex items-center space-x-2">
			  <RadioGroup.Item value="personal" id="option-one" />
			  <Label for="option-one">Personal</Label>
			</div>
			<div class="flex items-center space-x-2">
			  <RadioGroup.Item value="business" id="option-two" />
			  <Label for="option-two">Business</Label>
			</div>
		  </RadioGroup.Root>
		<Form.Button class="w-full mt-3">Create an account</Form.Button>
	</div>
	<div class="mt-4 text-center text-sm">
        Already have an account?
        <a href="/auth/login" class="underline"> Sign in </a>
    </div>
</form>
