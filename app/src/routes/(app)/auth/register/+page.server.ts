import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
 
export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
    register: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));
        try {
            const createUser = await locals.pb.collection('users').create({
                email: form.data.email as string,
                password: form.data.password as string,
                passwordConfirm: form.data.passwordConfirm as string,
                accountType: form.data.accountType as string,
                language: "english",
                isEmailVerified: false, 
            });

            await locals.pb.collection('users').requestVerification(form.data.email as string);
        } catch (err) {
            console.log('Error on registration: ', err);
            throw redirect(303, '?error');
        }
        throw redirect(303, "/auth/verify-email");
    },
}