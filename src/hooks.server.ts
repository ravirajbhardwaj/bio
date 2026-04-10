import { verifyToken } from '$lib/jwt';
import type { Handle } from '@sveltejs/kit';

const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');

	// Verify user token if present
	if (token) {
		const user = await verifyToken(token);
		event.locals.user = user ?? null;
	}

	return resolve(event);
};
