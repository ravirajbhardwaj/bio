import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users, profile } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';

const profileSchema = z.object({
	name: z.string().min(1, 'Full name is required').trim(),
	profession: z.string().min(1, 'Profession is required').trim(),
	bio: z.string().optional().default(''),
	location: z.string().optional().default(''),
	avatar: z
		.union([z.string().url('Must be a valid URL'), z.literal('')])
		.optional()
		.default(''),
	socialLinks: z
		.array(
			z.object({
				type: z.string(),
				url: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional()
			})
		)
		.optional()
		.default([]),
	journey: z
		.array(
			z.object({
				order: z.number().optional().default(0),
				type: z.string(),
				title: z.string(),
				organization: z.string().optional().default(''),
				description: z.string().optional().default(''),
				startDate: z.string().optional().default(''),
				endDate: z.string().optional()
			})
		)
		.optional()
		.default([]),
	projects: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				description: z.string().optional().default(''),
				link: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional()
			})
		)
		.optional()
		.default([])
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		redirect(302, '/auth');
	}

	const db = getDb(platform?.env.bio!);
	if (!db) {
		return { profile: null, isPaid: false };
	}

	const userRecord = await db.select().from(users).where(eq(users.id, locals.user.id)).get();

	const isPaid = userRecord?.isPaid ?? false;

	const profileRecord = await db
		.select()
		.from(profile)
		.where(eq(profile.userId, locals.user.id))
		.get();

	if (!profileRecord) {
		return { profile: null, isPaid };
	}

	return {
		isPaid,
		profile: {
			name: profileRecord.name,
			profession: profileRecord.profession,
			bio: profileRecord.bio ?? '',
			location: profileRecord.location ?? '',
			avatar: profileRecord.avatar ?? '',
			socialLinks: JSON.parse((profileRecord.socialLinks as string) || '[]'),
			journey: JSON.parse((profileRecord.journey as string) || '[]'),
			projects: JSON.parse((profileRecord.projects as string) || '[]')
		} satisfies ProfileFormData
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const db = getDb(platform?.env.bio!);

		if (!db) {
			return fail(500, { error: 'Database not available' });
		}

		const formData = await request.formData();
		const payloadRaw = formData.get('payload');
		if (!payloadRaw) return fail(400, { error: 'Missing form payload' });

		let parsedPayload: unknown;
		try {
			parsedPayload = JSON.parse(payloadRaw.toString());
		} catch {
			return fail(400, { error: 'Invalid JSON format' });
		}

		const result = profileSchema.safeParse(parsedPayload);
		if (!result.success) {
			return fail(400, {
				error: 'Please fix the highlighted fields',
				fieldErrors: result.error.flatten().fieldErrors
			});
		}

		const validData = result.data;

		try {
			const existing = await db
				.select({ id: profile.id })
				.from(profile)
				.where(eq(profile.userId, locals.user.id))
				.get();

			if (existing) {
				await db
					.update(profile)
					.set({
						name: validData.name,
						profession: validData.profession,
						bio: validData.bio,
						location: validData.location,
						avatar: validData.avatar,
						socialLinks: JSON.stringify(validData.socialLinks),
						journey: JSON.stringify(validData.journey),
						projects: JSON.stringify(validData.projects)
					})
					.where(eq(profile.userId, locals.user.id));
			} else {
				await db.insert(profile).values({
					userId: locals.user.id,
					name: validData.name,
					profession: validData.profession,
					bio: validData.bio,
					location: validData.location,
					avatar: validData.avatar,
					socialLinks: JSON.stringify(validData.socialLinks),
					journey: JSON.stringify(validData.journey),
					projects: JSON.stringify(validData.projects)
				});
			}

			return { success: true };
		} catch (err) {
			console.error('DB Error:', err);
			return fail(500, { error: 'Failed to save profile' });
		}
	}
};
