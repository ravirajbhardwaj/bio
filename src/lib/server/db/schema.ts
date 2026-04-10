import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email', { length: 100 }).notNull().unique(),
	username: text('username', { length: 20 }).notNull().unique(),
	magicToken: text('token').unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }),
	subscriptionId: text('subscription_id'),
	isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const profile = sqliteTable('profile', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
		.unique(),

	// core identity
	name: text('name').notNull(),
	profession: text('profession', { length: 30 }).notNull(),
	bio: text('bio', { length: 160 }),
	location: text('location', { length: 50 }),
	avatar: text('avatar'),

	// JSON fields
	socialLinks: text('social_links', { mode: 'json' }).notNull().default('[]'),
	journey: text('journey', { mode: 'json' }).notNull().default('[]'),
	projects: text('projects', { mode: 'json' }).notNull().default('[]'),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type SocialLink = {
	type: 'github' | 'linkedin' | 'x' | 'instagram' | 'custom';
	url: string;
};

export type JourneyItem = {
	order: number;
	type: 'project' | 'work' | 'education' | 'course' | 'achievement' | 'custom';

	title: string;
	organization?: string;

	description?: string;
	link?: string;

	startDate?: string;
	endDate?: string;
};

export type Project = {
	id: string;
	title: string;
	description?: string;
	link?: string;
	createdAt: Date;
};
