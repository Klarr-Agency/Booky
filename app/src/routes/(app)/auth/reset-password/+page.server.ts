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
    reset: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));

        try {
            const reqPasswordReset = await locals.pb.collection('users').requestPasswordReset(form.data.email as string);
        } catch (err) {
            console.log('Error on request password: ', err);
            throw redirect(303, '?error');
        }
    },
}