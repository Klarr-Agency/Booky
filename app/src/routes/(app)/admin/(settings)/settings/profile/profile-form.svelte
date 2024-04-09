<script lang="ts">
    import { type Infer, type SuperValidated, superForm } from "sveltekit-superforms";
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from "$lib/components/ui/input";
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let userInfo: any;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		//Not working resetForm: false
	});

	const { form: formData, enhance } = form;

    $: if (userInfo) {
        $formData.name = userInfo.name;
        $formData.username = userInfo.username;
    }
</script>

<form method="POST" class="space-y-8" id="profile-form">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input placeholder="Jean-Claude Dubuc" {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input placeholder="@Booky" {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.Description>
			This is your public display name. It can be your real name or a pseudonym. You can only change
			this once every 30 days.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Update profile</Form.Button>
</form>
