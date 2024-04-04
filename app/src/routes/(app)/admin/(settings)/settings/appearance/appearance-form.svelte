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

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-8">
	<Form.Field {form} name="font">
		<Form.Control let:attrs>
			<Form.Label>Font</Form.Label>
			<div class="relative w-max">
				<select
					{...attrs}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[200px] appearance-none font-normal'
					)}
					bind:value={$formData.font}
				>
					<option value="inter">Inter</option>
					<option value="manrope">Manrope</option>
					<option value="system">System</option>
				</select>
				<ChevronDown class="absolute right-3 top-2.5 size-4 opacity-50" />
			</div>
		</Form.Control>
		<Form.Description>Set the font you want to use in the dashboard.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Fieldset {form} name="theme">
		<Form.Legend>Theme</Form.Legend>
		<Form.Description>Select the theme for the dashboard.</Form.Description>
		<Form.FieldErrors />
		<RadioGroup.Root
			class="grid max-w-md grid-cols-2 gap-8 pt-2"
			orientation="horizontal"
			bind:value={$formData.theme}
		>
			<Form.Control let:attrs>
				<Label class="[&:has([data-state=checked])>div]:border-primary">
					<RadioGroup.Item {...attrs} value="light" class="sr-only" on:click={() => setMode('light')} />
					<ThemeBlock theme="light" />
				</Label>
			</Form.Control>
			<Form.Control let:attrs>
				<Label class="[&:has([data-state=checked])>div]:border-primary">
					<RadioGroup.Item {...attrs} value="dark" class="sr-only" on:click={() => setMode('dark')} />
					<ThemeBlock theme="dark" />
				</Label>
			</Form.Control>
			<RadioGroup.Input name="theme" />
		</RadioGroup.Root>
	</Form.Fieldset>
	<Form.Button>Update preferences</Form.Button>
</form>
