import { z } from "zod";
export const formSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters.")
        .max(30, "Username must not be longer than 30 characters"),
    bio: z.string().min(4).max(160).default("I own a computer."),
});
export type FormSchema = typeof formSchema;