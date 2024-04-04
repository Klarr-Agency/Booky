<script>
	export let theme = '';
</script>

{#if theme === 'dark'}
	<div
		class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1"
	>
		<div class="space-y-2 rounded-sm bg-slate-950 p-2">
			<div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
				<div class="h-2 w-[80px] rounded-lg bg-slate-400" />
				<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
			</div>
			<div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
				<div class="h-4 w-4 rounded-full bg-slate-400" />
				<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
			</div>
			<div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
				<div class="h-4 w-4 rounded-full bg-slate-400" />
				<div class="h-2 w-[100px] rounded-lg bg-slate-400" />
			</div>
		</div>
	</div>
	<span class="block w-full p-2 text-center font-normal"> Dark </span>
{:else}
	<div class="border-muted hover:border-accent items-center rounded-md border-2 p-1">
		<div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
			<div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
				<div class="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
				<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
			</div>
			<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
				<div class="h-4 w-4 rounded-full bg-[#ecedef]" />
				<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
			</div>
			<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
				<div class="h-4 w-4 rounded-full bg-[#ecedef]" />
				<div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
			</div>
		</div>
	</div>
	<span class="block w-full p-2 text-center font-normal"> Light </span>
{/if}
