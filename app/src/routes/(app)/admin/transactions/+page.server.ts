import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { formSchema, labelSchema } from "./schema";
import { fetchTransactionData } from "$lib/utils/transactions.js";

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.pb.authStore.model) {
        throw new Error('User not authenticated');
    }

    const userId = locals.pb.authStore.model.id;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const data = await fetchTransactionData(locals, userId, startDate, endDate);

    return {
        ...data,
        form: await superValidate(zod(formSchema)),
        labelForm: await superValidate(zod(labelSchema))
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
    editTransaction: async ({ request, locals }) => {
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

            await locals.pb.collection('transactions').update(form.data.id as string, data);
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
    },
    createLabel: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(labelSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!locals.pb.authStore.model) {
            return fail(401, { message: 'No authenticated user found.' });
        }

        const userId = locals.pb.authStore.model.id;

        try {
            const data = {
                userId,
                name: form.data.name,
                color: form.data.color
            };

            await locals.pb.collection('labels').create(data);

            return { status: 200, body: 'Label created successfully.' };
        } catch (err) {
            console.log('Error on create label: ', err);
            return fail(500, { error: 'Failed to create label' });
        }
    },
    editLabel: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(labelSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!locals.pb.authStore.model) {
            return fail(401, { message: 'No authenticated user found.' });
        }

        const userId = locals.pb.authStore.model.id;

        try {
            const existingLabel = await locals.pb.collection('labels').getOne(form.data.id as string);
            if (existingLabel.userId !== userId) {
                return fail(403, { message: 'You do not have permission to edit this label.' });
            }

            const updatedLabel = await locals.pb.collection('labels').update(form.data.id as string, {
                name: form.data.name,
                color: form.data.color
            });


            return { status: 200, body: 'Label updated successfully.' };
        } catch (err) {
            console.log('Error on edit label: ', err);
            return fail(500, { error: 'Failed to edit label' });
        }
    },
    deleteLabel: async ({ request, locals }) => {
        const formData = await request.formData();
        const labelId = formData.get('id');

        if (typeof labelId !== 'string' || !labelId) {
            return fail(400, { error: 'Invalid or missing label ID.' });
        }

        if (!locals.pb.authStore.model) {
            return fail(401, { message: 'No authenticated user found.' });
        }

        const userId = locals.pb.authStore.model.id;

        try {
            const existingLabel = await locals.pb.collection('labels').getOne(labelId);
            if (existingLabel.userId !== userId) {
                return fail(403, { message: 'You do not have permission to delete this label.' });
            }

            // First, remove the label from all transactions
            const transactionLabels = await locals.pb.collection('transactionLabels').getFullList({
                filter: `labelId="${labelId}" && userId="${userId}"`
            });

            for (const label of transactionLabels) {
                try {
                    await locals.pb.collection('transactionLabels').delete(label.id);
                } catch (labelError) {
                    console.error(`Error deleting associated label ${label.id}:`, labelError);
                }
            }

            // Then delete the label
            await locals.pb.collection('labels').delete(labelId);

            return { status: 200, body: 'Label deleted successfully.' };
        } catch (err) {
            console.log('Error on delete label: ', err);
            return fail(500, { error: 'Failed to delete label' });
        }
    }
}