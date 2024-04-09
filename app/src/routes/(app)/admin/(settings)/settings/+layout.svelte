<script>
	import SidebarNav from '$lib/components/ui/sidebar-nav/sidebar-nav.svelte';
	import { Separator } from "$lib/components/ui/separator";

	const sidebarNavItems = [
		{
			title: 'Profile',
			href: '/admin/settings/profile'
		},
		{
			title: 'Appearance',
			href: '/admin/settings/appearance'
		},
		{
			title: 'Automation',
			href: '/admin/settings/automation'
		}
	];
</script>

<main
	class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
>
	<div class="hidden space-y-6 p-10 pb-16 md:block">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
			<p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
		</div>
		<Separator class="my-6" />
		<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside class="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems} />
			</aside>
			<div class="flex-1 lg:max-w-2xl">
				<slot />
			</div>
		</div>
	</div>
</main>
