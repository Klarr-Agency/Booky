import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const transactionSchema = z.object({
	id: z.string(),
    date: z.string(),
	title: z.string(),
    status: z.string(),
    label: z.string(),
	description: z.string(),
	amount: z.string(),
	type: z.string(),
});

export type Transactions = z.infer<typeof transactionSchema>;