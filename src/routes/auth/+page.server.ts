import { fail, redirect } from '@sveltejs/kit';
import { sendMagicLinkEmail } from '$lib/mail';
import z from 'zod';
import { handleZodError } from '$lib/handleZodError.js';
import { users } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';

const emailSchema = z.string().email();

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/onboarding');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, url, platform }) => {
		const formDataEmail = (await request.formData()).get('email');
		const db = getDb(platform?.env.bio!);

		const email = handleZodError(emailSchema.safeParse(formDataEmail));
		const username = email.split('@')[0];

		try {
			const magicToken = crypto.randomUUID();
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

			await db.insert(users).values({ email, username, magicToken, expiresAt });
			sendMagicLinkEmail(email, `${url.origin}/auth/verify?token=${magicToken}`);

			return { success: true, message: 'Magic link sent. Check your email.' };
		} catch (error) {
			console.error(error);
			return fail(500, { email, message: 'Failed to send magic link. Please try again.' });
		}
	}
};
