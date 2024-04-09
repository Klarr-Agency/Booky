<script lang="ts">
	import '$lib/app.pcss';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { page } from '$app/stores';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Menu from 'lucide-svelte/icons/menu';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Book from 'lucide-svelte/icons/book';
	import { onMount } from 'svelte';
	export let data: any;
	let theme: 'light' | 'dark' | 'system' = data.props.theme;

	let navItem = [
		{
			label: 'Dashboard',
			url: '/admin/dashboard'
		},
		{
			label: 'Transactions',
			url: '/admin/transactions'
		},
		{
			label: 'Settings',
			url: '/admin/settings'
		}
	];
	onMount(() => {
		setMode(theme);
	});
</script>

<ModeWatcher />
<div class="flex min-h-screen w-full flex-col">
	<header class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="/admin/dashboard" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<Book class="h-6 w-6" />
				<span class="sr-only">Acme Inc</span>
			</a>
			{#each navItem as item}
				<a
					href={item.url}
					class="{$page.url.pathname.includes(item.url)
						? 'text-foreground'
						: 'text-muted-foreground'} hover:text-foreground transition-colors"
				>
					{item.label}
				</a>
			{/each}
		</nav>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="##" class="flex items-center gap-2 text-lg font-semibold">
						<span class="sr-only">Acme Inc</span>
					</a>
					{#each navItem as item}
						<a
							href={item.url}
							class="{$page.url.pathname.includes(item.url)
								? 'text-foreground'
								: 'text-muted-foreground'} hover:text-foreground"
						>
							{item.label}
						</a>
					{/each}
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<div class="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
						<CircleUser class="h-5 w-5" />
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />

					<DropdownMenu.Item><a href="/admin/settings">Settings</a></DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<form action="logout" method="POST">
							<button>Logout</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>
	<slot />
</div>
