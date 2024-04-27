import { z } from "zod";

const today = new Date();
const allowedFileTypes = ["image/jpeg", "application/pdf", "image/png"];

export const formSchema = z.object({
    id: z.string().optional(),
    receiptNumber: z.string(),
    title: z.string(),
    document: z.instanceof(File).nullable().refine(file => {
        return file ? allowedFileTypes.includes(file.type) : true;
    }, {
        message: "Only JPEG, PDF, and PNG files are allowed.",
    }).optional(),
    type: z.enum(['revenue', 'expense']),
    date: z.string()
        .min(1, "Date is required."),
    currency: z.enum(['usd', 'cad']),
    amount: z.number()
        .positive("Amount must be a positive number.")
        .min(0.01, "Amount must be at least 0.01 USD.")
});

export type FormSchema = typeof formSchema;