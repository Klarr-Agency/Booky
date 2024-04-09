<script lang="ts">
	import type { PageData } from './$types.js';
	import ProfileForm from './profile-form.svelte';
	import { Separator } from '$lib/components/ui/separator';
	export let data: PageData;

	let formData: any = data.form;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Appearance</h3>
		<p class="text-muted-foreground text-sm">
			Customize the appearance of the app. Automatically switch between day and night themes.
		</p>
	</div>
	<Separator />
	<ProfileForm data={formData}/>
</div>
