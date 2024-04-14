import { z } from "zod";

const today = new Date();
const allowedFileTypes = ["image/jpeg", "application/pdf", "image/png"];

export const formSchema = z.object({
    receiptNumber: z.string(),
    title: z.string(),
    document: z.instanceof(File).optional().refine(file => {
        return file ? allowedFileTypes.includes(file.type) : true;
    }, {
        message: "Only JPEG, PDF, and PNG files are allowed.",
    }),
    type: z.enum(['revenue', 'expense']),
    date: z.date().refine(date => date <= today, {
        message: "Date cannot be in the future.",
    }),
    currency: z.string(),
    amount: z.number()
        .positive("Amount must be a positive number.")
        .min(0.01, "Amount must be at least 0.01 USD.")
});

export type FormSchema = typeof formSchema;