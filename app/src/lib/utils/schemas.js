import { z } from 'zod';

export const loginUserSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

export const resetPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
});

export const updatePasswordSchema = z.object({
    newPassword: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        // Regex does not work in certain cases
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
    passwordConfirm: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
}).superRefine(({ passwordConfirm, newPassword }, ctx) => {
    if (passwordConfirm !== newPassword) {
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

export const registerSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, { message: 'Email is required' })
        .max(64, { message: 'Email must be less than 64 characters' })
        .email({ message: 'Email must be a valid email address' }),
    password: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        // Regex does not work in certain cases
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
    passwordConfirm: z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' })
        .max(64, { message: 'Password must be a minimum of 8 characters & maximum 64 characters.' }),
        //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'),
    license_key: z.string().min(35).max(35).trim(),
    terms: z.enum(['on'], { required_error: 'You must accept the terms and conditions' })
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