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

<form method="POST" action="?/login"  use:enhance>
	<div class="grid gap-4">
		<div class="grid gap-2">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid gap-2">
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<div class="flex items-end">
						<Form.Label>Password</Form.Label>
						<a href="/auth/reset-password" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Button class="w-full">Login</Form.Button>
	</div>
	<div class="mt-4 text-center text-sm">
		Don&apos;t have an account?
		<a href="/auth/register" class="underline"> Sign up </a>
	</div>
</form>
