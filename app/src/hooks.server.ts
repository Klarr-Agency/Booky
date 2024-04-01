import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const cookieExport = import.meta.env.VITE_COOKIE_EXPORT;

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(pocketbaseUrl);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	// Check if the user is authenticated
	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;

		// Redirect authenticated users to the admin dashboard, but only if they're not already there
		if (!event.url.pathname.startsWith('/admin')) {
			return redirect(303, '/admin/dashboard');
		}
	} else {
		// Redirect unauthenticated users to the login page, but not if they're already on an auth page
		if (!event.url.pathname.startsWith('/auth')) {
			return redirect(303, '/auth/login');
		}
	}
	
	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: cookieExport }));

	return response;
};