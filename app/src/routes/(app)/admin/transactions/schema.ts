import { z } from "zod";

const today = new Date();

export const formSchema = z.object({
    title: z.string(),
    importFile: z.instanceof(File).optional(),
    transactionType: z.enum(['Revenu', 'Expense']),
    date: z.date().refine(date => date <= today, {
        message: "Date cannot be in the future.",
    }),
    amount: z.number()
        .positive("Amount must be a positive number.")
        .min(0.01, "Amount must be at least 0.01 USD.")
});

export type FormSchema = typeof formSchema;
