<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import RegisterForm from './register-form.svelte';

	export let data: PageData;
</script>

<Card.Root class="max-w-sm md:min-w-[500px]">
	<Card.Header class="min-h-[120px]">
		<Card.Title class="text-2xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<RegisterForm data={data.form} />
	</Card.Content>
</Card.Root>
