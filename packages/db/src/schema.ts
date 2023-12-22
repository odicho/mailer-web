import { datetime, mysqlTable, primaryKey, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	username: varchar('username', { length: 255 }),
	email: varchar('email', { length: 255 }),
	image: varchar('image', { length: 255 }),
});

export const oauth_account = mysqlTable(
	'oauth_account',
	{
		providerId: varchar('provider_id', { length: 255 }).notNull(),
		providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
		userId: varchar('user_id', { length: 255 })
			.notNull()
			.references(() => user.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
	}),
);

export const session = mysqlTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull(),
});

export const api_key = mysqlTable(
	'api_key',
	{
		id: varchar('id', { length: 255 }).primaryKey(),
		clientId: varchar('client_id', { length: 255 }).notNull(),
		clientSecret: varchar('client_secret', { length: 255 }).notNull(),
		clientSecretSuffix: varchar('client_secret_suffix', { length: 8 }).notNull(),
		userId: varchar('user_id', {
			length: 255,
		})
			.notNull()
			.references(() => user.id),
		createdAt: datetime('created_at', { fsp: 3 }).notNull(),
		expiresAt: datetime('expires_at', { fsp: 3 }),
		deletedAt: datetime('deleted_at', { fsp: 3 }),
	},
	(table) => ({
		clientIdIdx: uniqueIndex('client_id_idx').on(table.clientId),
	}),
);

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
