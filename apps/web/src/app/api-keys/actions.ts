'use server';

import crypto, { createHash, timingSafeEqual } from 'crypto';
import { createId } from '@paralleldrive/cuid2';
import CRC32 from 'crc-32';
import { and, db, eq, isNull } from '@repo/db';
import { api_key } from '@repo/db/schema';
import { getUser } from '@repo/auth';
import { revalidateTag } from 'next/cache';
import { apiKeysCacheKey } from '../../utils/cache-keys';

export async function createApiKey() {
	const user = await getUser();
	if (!user) return { clientId: '', clientSecret: '' };

	const id = createId();
	const clientId = createId();
	const secret = crypto.randomBytes(18).toString('hex');

	const checksum = (CRC32.str(secret) >>> 0).toString(16).slice(-6);
	const combinedSecret = secret + checksum;
	const clientSecretSuffix = combinedSecret.slice(-8);

	const hash = createHash('sha256');
	const clientSecret = hash.update(combinedSecret).digest('hex');

	await db.insert(api_key).values({
		id,
		clientId,
		clientSecret,
		clientSecretSuffix,
		userId: user.id,
		createdAt: new Date(),
	});

	revalidateTag('a-unique-tag');

	return { clientId, clientSecret: combinedSecret };
}

export async function verifyApiKey(clientId: string, clientSecretInput: string) {
	const secret = clientSecretInput.slice(0, -6);
	const givenChecksum = clientSecretInput.slice(-6);

	const checksum = (CRC32.str(secret) >>> 0).toString(16).slice(-6);

	// checks for valid checksum
	if (!constantTimeEqual(givenChecksum, checksum)) {
		return false;
	}

	const storedApiKey = (
		await db
			.select({ clientSecret: api_key.clientSecret, expiresAt: api_key.expiresAt })
			.from(api_key)
			.where(and(eq(api_key.clientId, clientId), isNull(api_key.deletedAt)))
			.limit(1)
	)[0];

	if (!storedApiKey) {
		return false;
	}

	const { clientSecret, expiresAt } = storedApiKey;

	const hash = createHash('sha256');
	const hashedClientSecret = hash.update(clientSecretInput).digest('hex');

	if (!constantTimeEqual(hashedClientSecret, clientSecret)) {
		return false;
	}

	const expiresAtTime = expiresAt && new Date(expiresAt).getTime();

	if (expiresAtTime && Date.now() > expiresAtTime) {
		return false;
	}

	return true;
}

export async function deleteApiKey(clientId: string, userId: string) {
	await db.update(api_key).set({ deletedAt: new Date() }).where(eq(api_key.clientId, clientId));

	revalidateTag('a-unique-tag');
}

function constantTimeEqual(str1: string, str2: string) {
	const buf1 = Buffer.from(str1, 'utf-8');
	const buf2 = Buffer.from(str2, 'utf-8');

	try {
		return crypto.timingSafeEqual(buf1, buf2);
	} catch (err) {
		return false;
	}
}