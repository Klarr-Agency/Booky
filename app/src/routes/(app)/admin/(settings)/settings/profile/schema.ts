import { z } from "zod";
export const formSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters.")
        .max(30, "Username must not be longer than 30 characters"),
    name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name must not be longer than 60 characters"),
});
export type FormSchema = typeof formSchema;