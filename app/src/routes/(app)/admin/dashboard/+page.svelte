<script lang="ts">
	import { ArrowUpRight, CreditCard, DollarSign, Download, Receipt } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageData } from './$types.js';
	import { formatDate, toDate, type DateObject } from '$lib/utils/utils.js';
	import DateFilter from '$lib/components/ui/date-filter/date-filter.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import DonutChart from '$lib/components/ui/donutChart/donutChart.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { DateRange } from 'bits-ui';
	import { parseDate } from '@internationalized/date';

	export let data: PageData;

	$: revenue = Number(data.props.totalRevenue.toFixed(2));
	$: expense = Number(data.props.totalExpense.toFixed(2));
	$: result = Number((revenue - expense).toFixed(2));
	const lastTransactions = data.props.lastTransactions;

	let dateFilter: DateRange = {
		start: parseDate(data.props.startDate),
		end: parseDate(data.props.endDate)
	};

	$: {
		if (dateFilter && dateFilter.start && dateFilter.end) {
			updateData(dateFilter.start, dateFilter.end);
		}
	}

	function updateData(startObj: DateObject, endObj: DateObject) {
		const startDate = toDate(startObj);
		const endDate = toDate(endObj);

		// Format dates to ISO string for query parameters
		const startISO = startDate.toISOString().split('T')[0];
		const endISO = endDate.toISOString().split('T')[0];

		if (browser) {
			goto(`/admin/dashboard?startDate=${startISO}&endDate=${endISO}`, { replaceState: true });
		}
	}

	function formatValue(value: number): number {
		return Number(value.toFixed(2));
	}

	function processChartData(
		labelTotals: PageData['props']['labelTotals'],
		type: 'revenue' | 'expense'
	) {
		const chartData = Object.values(labelTotals)
			.map((data: any) => ({
				category: data.name,
				value: data[type],
				color: data.color
			}))
			.filter((item) => item.value > 0)
			.sort((a, b) => b.value - a.value);
		//.slice(0, 4); // Take top 4 categories

		if (chartData.length === 0) {
			return {
				categories: ['No Data'],
				values: [0],
				colors: ['#CCCCCC']
			};
		}

		return {
			categories: chartData.map((item) => item.category),
			values: chartData.map((item) => formatValue(item.value)),
			colors: chartData.map((item) => item.color)
		};
	}

	$: revenueChartData = processChartData(data.props.labelTotals, 'revenue');
	$: expenseChartData = processChartData(data.props.labelTotals, 'expense');
</script>

<svelte:head>
	<title>Booky - Dashboard</title>
	<meta name="description" content="Transaction overview" />
</svelte:head>

<div class="flex items-center justify-between px-7 pt-7">
	<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
	<div class="flex items-center">
		<DateFilter bind:value={dateFilter} />
	</div>
</div>
<main class="flex flex-1 flex-col gap-4 p-7 md:gap-7 md:p-7">
	<div class="grid gap-4 md:grid-cols-1 md:gap-7 lg:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total</Card.Title>
				<DollarSign class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-bold">${result > 0 ? result : 0}</div>
				<!--<p class="text-muted-foreground text-xs">+20.1% from last month</p>-->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Revenue</Card.Title>
				<Receipt class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-bold">${revenue}</div>
				<!--<p class="text-muted-foreground text-xs">+180.1% from last month</p>-->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Expenses</Card.Title>
				<CreditCard class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-bold">${expense}</div>
				<!--<p class="text-muted-foreground text-xs">+180.1% from last month</p>-->
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
					View More
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
									<div class="text-muted-foreground hidden text-sm md:inline">
										{formatDate(transaction.date)}
									</div>
								</Table.Cell>
								<Table.Cell class="text-right">${transaction.amount}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title>Breakdown</Card.Title>
				<button>
					<Download class="h-4 w-4" />
				</button>
			</Card.Header>
			<Card.Content>
				<Tabs.Root value="revenue" class="mt-2">
					<Tabs.List>
						<Tabs.Trigger value="revenue">Revenue</Tabs.Trigger>
						<Tabs.Trigger value="expense">Expense</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="revenue">
						<DonutChart
							label="Revenue"
							categories={revenueChartData.categories}
							colors={revenueChartData.colors}
							values={revenueChartData.values}
						/>
					</Tabs.Content>
					<Tabs.Content value="expense">
						<DonutChart
							label="Expense"
							categories={expenseChartData.categories}
							colors={expenseChartData.colors}
							values={expenseChartData.values}
						/>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Content>
		</Card.Root>
	</div>
</main>
