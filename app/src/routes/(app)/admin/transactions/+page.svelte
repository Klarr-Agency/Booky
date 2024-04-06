<script lang="ts">
	import DataTable from '$lib/components/ui/data-table/transactions/data-table.svelte';
	import data from './transactions.json';


</script>

<div class=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<DataTable {data} />
</div>
