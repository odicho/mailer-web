import { db } from '@repo/db';
import { session, user } from '@repo/db/schema';
import { Lucia } from 'lucia';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { GitHub } from 'arctic';
import { cookies } from 'next/headers';
import { cache } from 'react';

const drizzleAdapter = new DrizzleMySQLAdapter(db, session, user);

export const lucia = new Lucia(drizzleAdapter, {
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			image: attributes.image,
		};
	},
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
	// interface DatabaseSessionAttributes {}
	interface DatabaseUserAttributes {
		username: string;
		email: string;
		image: string;
	}
}

export const githubAuth = new GitHub(
	process.env.GITHUB_CLIENT_ID ?? '',
	process.env.GITHUB_CLIENT_SECRET ?? '',
);

export const getUser = cache(async () => {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) return null;
	const { user, session } = await lucia.validateSession(sessionId);

	try {
		if (session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// Next.js throws error when attempting to set cookies when rendering page
	}
	return user;
});
