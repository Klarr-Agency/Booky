import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { formSchema } from "./schema";

export const load: PageServerLoad = async ({ locals }) => {

    // Add pagination later
    const records = await locals.pb.collection('transactions').getFullList({
        sort: '-created',
        fields: 'id,title,date,label,type,document,amount,receiptNumber, currency'
    });

    return {
        props: {
            transactions: records
        },
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    createTransaction: async ({ request, locals }) => {
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
                "document": form.data.document,
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
    deleteTransaction: async ({ request, locals }) => {
        const formData = await request.formData();
        const transactionId = formData.get('transactionId');

        if (typeof transactionId !== 'string' || !transactionId) {
            return fail(400, { error: 'A valid transaction ID is required.' });
        }

        try {
            // Check if authStore.model is not null
            if (!locals.pb.authStore.model) {
                console.log('No authenticated user found.');
                return fail(401, { message: 'No authenticated user found.' });
            }

            await locals.pb.collection('transactions').delete(transactionId);
        } catch (error) {
            console.error("Failed to delete the transaction", error);
        }
        throw redirect(303, "/admin/transactions");
    },
    downloadDocument: async ({ request, locals }) => {
        const formData = await request.formData();
        const transactionId = formData.get('download');

        if (typeof transactionId !== 'string' || !transactionId) {
            return fail(400, { error: 'A valid transaction ID is required.' });
        }

        try {
            // Check if authStore.model is not null
            if (!locals.pb.authStore.model) {
                console.log('No authenticated user found.');
                return fail(401, { message: 'No authenticated user found.' });
            }

            const fileToken = await locals.pb.files.getToken();
            const record = await locals.pb.collection('transactions').getOne(transactionId);
            const url = locals.pb.files.getUrl(record, record.document, { 'token': fileToken });

            return {
                status: 200,
                body: { url }
            };
        } catch (error) {
            console.error("Failed to download the transaction", error);
        }
    }
}