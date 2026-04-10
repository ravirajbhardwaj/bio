import { redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { signJwtToken } from '$lib/jwt';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import z from 'zod';
import { handleZodError } from '$lib/handleZodError';
import { getDb } from '$lib/server/db';

const querySchema = z.object({
	token: z.string().min(1, 'Token is required')
});

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const { token } = handleZodError(
		querySchema.safeParse(Object.fromEntries(url.searchParams.entries()))
	);

	const db = getDb(platform?.env.bio!);
	const [userWithToken] = await db.select().from(users).where(eq(users.magicToken, token));

	if (
		!userWithToken ||
		(userWithToken.expiresAt && userWithToken.expiresAt.getTime() < Date.now())
	) {
		return new Response('Invalid or expired token', { status: 400 });
	}

	await db
		.update(users)
		.set({ magicToken: null, expiresAt: null })
		.where(eq(users.id, userWithToken.id));

	const payload = {
		id: userWithToken.id,
		email: userWithToken.email,
		isPaid: userWithToken.isPaid ?? false
	};

	const accessToken = await signJwtToken(payload);

	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 60 * 60 * 24 * 30
	});

	throw redirect(302, '/onboarding');
};
