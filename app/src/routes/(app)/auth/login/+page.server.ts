import { validateData } from "$lib/utils/formValidator.js";
import { loginUserSchema } from "$lib/utils/schemas.js";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    login: async ({ request, locals }) => {
        const { formData, errors } = await validateData(await request.formData(), loginUserSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            const authData = await locals.pb.collection('users').authWithPassword(formData.email as string, formData.password as string);
        } catch (err) {
            console.log('Error on login: ', err);
            throw redirect(303, '?error');
        }
        throw redirect(303, "/admin/dashboard");
    },
}