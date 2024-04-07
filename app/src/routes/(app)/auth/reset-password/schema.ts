import { z } from "zod";


export const formSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, { message: 'Email is required' })
        .max(64, { message: 'Email must be less than 64 characters' })
        .email({ message: 'Email must be a valid email address' }),

});

export type FormSchema = typeof formSchema;