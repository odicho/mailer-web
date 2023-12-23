import { lucia, validateSession } from '@repo/auth';
import { verifyRequestOrigin } from 'lucia';
import { headers } from 'next/headers';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
	const originHeader = headers().get('Origin');
	const hostHeader = headers().get('Host');

	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
		return new Response(null, {
			status: 403,
		});
	}

	const { session } = await validateSession();

	if (!session) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(session.id);
	const blankSessionCookie = lucia.createBlankSessionCookie();

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/login', // redirect to login page
			'Set-Cookie': blankSessionCookie.serialize(),
		},
	});
};
