import ArrowDown from "svelte-radix/ArrowDown.svelte";
import ArrowUp from "svelte-radix/ArrowUp.svelte";
import CheckCircled from "svelte-radix/CheckCircled.svelte";
import Circle from "svelte-radix/Circle.svelte";
import CrossCircled from "svelte-radix/CrossCircled.svelte";
import QuestionMarkCircled from "svelte-radix/QuestionMarkCircled.svelte";
import Stopwatch from "svelte-radix/Stopwatch.svelte";

export const labels = [
	{
		value: "bug",
		label: "Bug",
	},
	{
		value: "feature",
		label: "Feature",
	},
	{
		value: "documentation",
		label: "Documentation",
	},
    {
		value: "hosting",
		label: "Hosting",
	},
];

export const statuses = [
	{
		value: "backlog",
		label: "Backlog",
		icon: QuestionMarkCircled,
	},
	{
		value: "todo",
		label: "Todo",
		icon: Circle,
	},
	{
		value: "in progress",
		label: "In Progress",
		icon: Stopwatch,
	},
	{
		value: "done",
		label: "Done",
		icon: CheckCircled,
	},
	{
		value: "canceled",
		label: "Canceled",
		icon: CrossCircled,
	},
];


export const types = [
	{
		label: "Expense",
		value: "expense",
		icon: ArrowDown,
	},
	{
		label: "Revenu",
		value: "revenu",
		icon: ArrowUp,
	},
];