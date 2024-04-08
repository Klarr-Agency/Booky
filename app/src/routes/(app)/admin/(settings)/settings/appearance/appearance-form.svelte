<script lang="ts">
	import ChevronDown from 'svelte-radix/ChevronDown.svelte';
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import ThemeBlock from './theme-block.svelte';
	import { formSchema, type FormSchema } from './schema';
	import { setMode } from 'mode-watcher';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let theme: any;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-8">
	<Form.Fieldset {form} name="theme">
		<Form.Legend>Theme</Form.Legend>
		<Form.Description>Select the theme for the dashboard.</Form.Description>
		<Form.FieldErrors />
		<RadioGroup.Root
			class="grid max-w-md grid-cols-2 gap-8 pt-2"
			orientation="horizontal"
			bind:value={theme}
		>
			<Form.Control let:attrs>
				<Label class="[&:has([data-state=checked])>div]:border-primary">
					<RadioGroup.Item {...attrs} value="light" class="sr-only" />
					<ThemeBlock theme="light" />
				</Label>
			</Form.Control>
			<Form.Control let:attrs>
				<Label class="[&:has([data-state=checked])>div]:border-primary">
					<RadioGroup.Item {...attrs} value="dark" class="sr-only" />
					<ThemeBlock theme="dark" />
				</Label>
			</Form.Control>
			<RadioGroup.Input name="theme" />
		</RadioGroup.Root>
	</Form.Fieldset>
	<Form.Button on:click={() => setMode(theme)}>Update preferences</Form.Button>
</form>
