<script>
	import '$lib/app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="flex justify-center items-center h-screen">
	<slot />
</div>
