import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Link from 'next/link';
import { and, db, eq, isNull } from '@repo/db';
import { api_key } from '@repo/db/schema';
import { CreateAPIKeyButton, DeleteAPIKeyButton } from './api-keys';
import { ApiKeyTable } from './Table';
import { withUnstableCache } from '../../utils/withUnstableCache';

export default async function Page() {
	const user = await getUser();
	if (!user) redirect('/login');

	// const apiKeys = await getApiKeys(user.id);
	const apiKeys = await withUnstableCache({
		fn: getApiKeys,
		args: [user.id],
		keys: ['api-keys'],
		tags: ['a-unique-tag'],
	});

	return (
		<>
			<nav className="py-4 border-b-2 border-black">
				<Link href={'/'}>Home</Link>
			</nav>
			<div className="py-6" />
			<CreateAPIKeyButton />
			<div className="pb-5" />
			<ApiKeyTable apiKeys={apiKeys} />
		</>
	);
}

async function getApiKeys(userId: string) {
	return await db
		.select({ clientId: api_key.clientId, clientSecretSuffix: api_key.clientSecretSuffix })
		.from(api_key)
		.where(and(eq(api_key.userId, userId), isNull(api_key.deletedAt)));
}
