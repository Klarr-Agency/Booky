<script lang="ts">
	import type { PageData } from "./$types.js";
	import * as Card from '$lib/components/ui/card/index.js';
	import LoginForm from './login-form.svelte';
	export let data: PageData;
</script>

<Card.Root class="min-w-[500px] max-w-sm">
	<Card.Header class="min-h-[120px]">
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
	<LoginForm data={data.form} />
		<!--<form action="?/login" method="POST">
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" value={form.data.email}
					 required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-end">
						<Label for="password">Password</Label>
						<a href="/auth/reset-password" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
					</div>
					<Input id="password" type="password" value={form.data.password} required />
				</div>
				<Button type="submit" class="w-full">Login</Button>
				<Button variant="outline" class="w-full">Login with Google</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Don&apos;t have an account?
				<a href="/auth/register" class="underline"> Sign up </a>
			</div>
		</form>-->
	</Card.Content>
</Card.Root>
