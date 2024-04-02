import { error, fail, redirect } from "@sveltejs/kit";
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
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));

        try {
            const authData = await locals.pb.collection('users').authWithPassword(form.data.email as string, form.data.password as string);
        } catch (err) {
            console.log('Error on login: ', err);
            throw redirect(303, '?error');
        }
        throw redirect(303, "/admin/dashboard");
    },
}