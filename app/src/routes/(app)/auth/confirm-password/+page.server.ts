import { redirect, fail } from "@sveltejs/kit";
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
    confirm: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));
        // You need to change the Action URL in pocketbase to make it works
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            console.log('Token is missing from the URL.');
            throw redirect(303, '/auth/login?error=token_missing');
        }

        try {
            const confirmPasswordReset = await locals.pb.collection('users').confirmPasswordReset(token, form.data.password as string, form.data.passwordConfirm as string);
            if(confirmPasswordReset) {
                if (!locals.pb.authStore.model) {
                    console.log('No user session found.');
                    throw redirect(303, "/auth/login");
                }
        
                let oldAuth = locals.pb.authStore.model;

                await locals.pb.collection('users').authWithPassword(oldAuth.email, form.data.password as string);
            }
        } catch (err) {
            console.log('Error on confirm password: ', err);
            throw redirect(303, '?error');
        }
        throw redirect(303, "/admin/dashboard");
    },
}