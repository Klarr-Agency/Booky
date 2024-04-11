import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { formSchema } from "./schema";

interface UserDataUpdate {
    username?: string;
    name?: string;
}

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));

        try {
            // Check if authStore.model is not null
            if (!locals.pb.authStore.model) {
                console.log('No authenticated user found.');
                return fail(401, { message: 'No authenticated user found.' });
            }

            const userId = locals.pb.authStore.model.id;

            const data = {
                "userId": userId,
                "title": form.data.title as string,
                "type": form.data.transactionType.toLowerCase() as string,
                "amount": form.data.amount,
                "date": form.data.date
            };
  
            await locals.pb.collection('transactions').create(data);

        } catch (err) {
            console.log('Error on create transactions: ', err);
        }
    },
}