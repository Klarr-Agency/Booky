import { z } from "zod";


export const formSchema = z.object({
    password: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        // Regex does not work in certain cases
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
    passwordConfirm: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});

export type FormSchema = typeof formSchema;