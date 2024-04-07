import { redirect } from "@sveltejs/kit";

export const load = async ({ request, locals }) => {
    // You need to change the Action URL in pocketbase to make it works
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
        console.log('Token is missing from the URL.');
        throw redirect(303, '/auth/login?error=token_missing');
    }

    try {
        const confirmEmail = await locals.pb.collection('users').confirmVerification(token);
        if (confirmEmail) {
            await locals.pb.collection('users').authRefresh();
        }
    } catch (err) {
        console.log('Error on email confirmation: ', err);
        throw redirect(303, '?error');
    }
    throw redirect(303, "/admin/dashboard");
};