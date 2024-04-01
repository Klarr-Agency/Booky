import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;
const cookieExport = import.meta.env.VITE_COOKIE_EXPORT;

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(pocketbaseUrl);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
	}

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: cookieExport }));

	return response;
};