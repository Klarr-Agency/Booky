<script lang="ts">
	import Receipt from 'lucide-svelte/icons/receipt';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	import type { PageData } from './$types.js';
	import { formatDate } from '$lib/utils/utils.js';
	
	export let data: PageData;

	const totalRevenue = data.props.totalRevenue;
	const totalExpense = data.props.totalExpense;
	const lastTransactions = data.props.lastTransaction.items;
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
	<div class="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
				<DollarSign class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-bold">${totalRevenue}</div>
				<!--<p class="text-muted-foreground text-xs">+20.1% from last month</p>-->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Expenses</Card.Title>
				<Receipt class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-bold">${totalExpense}</div>
				<!--<p class="text-muted-foreground text-xs">+180.1% from last month</p>-->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Sales</Card.Title>
				<CreditCard class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">+12,234</div>
				<p class="text-muted-foreground text-xs">+19% from last month</p>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Transactions</Card.Title>
					<Card.Description>Recently created transactions.</Card.Description>
				</div>
				<Button href="/admin/transactions" size="sm" class="ml-auto gap-1">
					View All
					<ArrowUpRight class="h-4 w-4" />
				</Button>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Transaction Name</Table.Head>
							<Table.Head class="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each lastTransactions as transaction}
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">{transaction.title}</div>
								<div class="text-muted-foreground hidden text-sm md:inline">{formatDate(transaction.date)}</div>
							</Table.Cell>
							<Table.Cell class="text-right">${transaction.amount}</Table.Cell>
						</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</main>
