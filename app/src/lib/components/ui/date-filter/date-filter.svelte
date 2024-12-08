<script lang="ts">
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import type { DateRange } from 'bits-ui';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
		startOfMonth,
		endOfMonth,
		startOfYear,
		endOfYear
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let now = today(getLocalTimeZone());
	let currentMonthStart = startOfMonth(now);
    let currentMonthEnd = endOfMonth(now);
    export let value: DateRange | undefined = {
        start: currentMonthStart,
        end: currentMonthEnd
    };
	let startValue: DateValue | undefined = undefined;

	const items = [
		{ value: 'today', label: 'Today' },
		{ value: 'yesterday', label: 'Yesterday' },
		{ value: 'last_month', label: 'Last Month' },
		{ value: 'this_month', label: 'This Month' },
		{ value: 'this_year', label: 'This Year' },
		{ value: 'last_year', label: 'Last Year' },
		{ value: 'all_time', label: 'All Time' }
	];

	function updateDateFilter(selectedValue: string) {
        switch (selectedValue) {
            case 'today':
            case 'yesterday':
                const singleDate = now.subtract({ days: selectedValue === 'today' ? 0 : 1 });
                value = { start: singleDate, end: singleDate };
                break;
            case 'last_month':
                const lastMonth = now.subtract({ months: 1 });
                value = {
                    start: startOfMonth(lastMonth),
                    end: endOfMonth(lastMonth)
                };
                break;
            case 'this_month':
                value = {
                    start: startOfMonth(now),
                    end: endOfMonth(now)
                };
                break;
            case 'this_year':
                value = {
                    start: startOfYear(now),
                    end: endOfYear(now)
                };
                break;
            case 'last_year':
                const lastYear = now.subtract({ years: 1 });
                value = {
                    start: startOfYear(lastYear),
                    end: endOfYear(lastYear)
                };
                break;
        }
    }
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('lg:w-[300px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{#if value && value.start}
				{#if value.end}
					{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
						value.end.toDate(getLocalTimeZone())
					)}
				{:else}
					{df.format(value.start.toDate(getLocalTimeZone()))}
				{/if}
			{:else if startValue}
				{df.format(startValue.toDate(getLocalTimeZone()))}
			{:else}
				Pick a date
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
		<Select.Root
			{items}
			onSelectedChange={(v) => {
				if (!v) return;
				updateDateFilter(v.value);
			}}
		>
		<Select.Trigger>
			<Select.Value placeholder="This Month"></Select.Value>
		</Select.Trigger>
			<Select.Content>
				{#each items as item}
					<Select.Item value={item.value}>{item.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<div class="rounded-md border">
			<RangeCalendar
				bind:value
				bind:startValue
				placeholder={value?.start}
				initialFocus
				numberOfMonths={2}
			/>
		</div>
	</Popover.Content>
</Popover.Root>
