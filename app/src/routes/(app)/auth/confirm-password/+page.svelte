<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import ConfirmForm from './confirm-form.svelte';

	export let data: PageData;
</script>

<Card.Root class="min-w-[500px] max-w-sm">
	<Card.Header class="min-h-[120px]">
		<Card.Title class="text-2xl">Reset Password</Card.Title>
		<Card.Description>Enter your your new password</Card.Description>
	</Card.Header>
	<Card.Content>
		<ConfirmForm data={data.form} />
	</Card.Content>
</Card.Root>
