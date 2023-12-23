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

export const validateSession = cache(async () => {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) return { user: null, session: null };
	const result = await lucia.validateSession(sessionId);

	try {
		if (result.session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {}
	return result;
});
