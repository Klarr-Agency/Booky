import { fail } from "@sveltejs/kit";

export async function load({ locals }) {
    try {
        if (!locals.pb.authStore.model) {
            console.log('No authenticated user found.');
            return fail(401, { message: 'No authenticated user found.' });
        }

        const userId = locals.pb.authStore.model.id;

        const record = await locals.pb.collection('users').getOne(userId);
        const theme: "light" | "dark" = record.theme || 'system';
        return {
            props: {
                theme,
            }
        };
    } catch (err) {
        console.log('Error on loading theme: ', err);
        return { status: 500, error: new Error('Internal server error') };
    }
};