<script lang="ts">
	import type { PageData } from './$types.js';
	import DataTable from '$lib/components/ui/data-table/transactions/data-table.svelte';
	import TransactionForm from './transaction-form.svelte';
	
	export let data: PageData;

	let formData: any = data.form;
	let transactionData: any = data.props.transactions;

</script>

<div class=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<TransactionForm data={formData} />
	<DataTable data={transactionData} />
</div>
