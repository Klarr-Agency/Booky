import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { formSchema } from "./schema";

export const load: PageServerLoad = async ({ locals }) => {

    // Add pagination later
    const records = await locals.pb.collection('transactions').getFullList({
        sort: '-created',
        fields: 'title,date,label,type,document,amount,receiptNumber, currency'
    });

    return {
        props: {
            transactions: records
        },
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

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
                "type": form.data.type as string,
                "date": form.data.date,
                "receiptNumber": form.data.receiptNumber as string,
                "amount": form.data.amount as number,
                "currency": form.data.currency as string
            };
  
            await locals.pb.collection('transactions').create(data);
        } catch (err) {
            console.log('Error on create transactions: ', err);
        }
    },
}