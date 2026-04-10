import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { users, profile } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const { username } = params;

	const db = getDb(platform?.env.bio!);
	if (!db) {
		throw error(500, 'Database not found');
	}

	// Get user by username
	const userRecord = await db.select().from(users).where(eq(users.username, username)).get();

	if (!userRecord) {
		throw error(404, 'User not found');
	}

	// Check if profile is paid - if not, only the owner can see it
	const isOwner = locals.user?.id === userRecord.id;
	const isPaid = userRecord.isPaid ?? false;

	// If not paid and not owner, show limited view or redirect
	if (!isPaid && !isOwner) {
		return {
			profile: null,
			username: userRecord.username,
			isPaid: false,
			isOwner: false
		};
	}

	// Get profile data
	const profileRecord = await db
		.select()
		.from(profile)
		.where(eq(profile.userId, userRecord.id))
		.get();

	if (!profileRecord) {
		return { profile: null, username: userRecord.username, isPaid, isOwner };
	}

	// Parse JSON fields
	const profileData = {
		name: profileRecord.name,
		profession: profileRecord.profession,
		bio: profileRecord.bio || '',
		location: profileRecord.location || '',
		avatar: profileRecord.avatar || '',
		socialLinks: JSON.parse((profileRecord.socialLinks as string) || '[]'),
		journey: JSON.parse((profileRecord.journey as string) || '[]'),
		projects: JSON.parse((profileRecord.projects as string) || '[]')
	};

	return {
		profile: profileData,
		username: userRecord.username,
		isPaid,
		isOwner
	};
};
