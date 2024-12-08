import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const transactionSchema = z.object({
	id: z.string(),
	receiptNumber: z.string(),
    title: z.string(),
	label: z.string().optional(),
    document: z.string(),
    type: z.string(),
    date: z.string(),
    currency: z.string(),
    amount: z.number()
        .positive("Amount must be a positive number.")
        .min(0.01, "Amount must be at least 0.01 USD.")
});

export type Transactions = z.infer<typeof transactionSchema>;