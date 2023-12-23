import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Link from 'next/link';
import { and, db, eq, isNull } from '@repo/db';
import { api_key } from '@repo/db/schema';
import { CreateAPIKeyButton, DeleteAPIKeyButton } from './api-keys';
import { withUnstableCache } from '../../utils/withUnstableCache';
import { apiKeysCacheKey } from '../../utils/cache-keys';

export default async function Page() {
	const user = await getUser();
	if (!user) redirect('/login');

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
			<div className="py-10" />
			<h1>Api Keys</h1>
			<CreateAPIKeyButton />
			<div className="pb-5" />
			<table>
				<thead>
					<tr className="text-left">
						<th className="px-4">Client Id</th>
						<th className="px-4">Client Secret</th>
					</tr>
				</thead>
				<tbody>
					{apiKeys.map((row) => {
						return (
							<tr key={row.clientId}>
								<td className="px-4 py-4">{row.clientId}</td>
								<td className="px-4 py-4">******{row.clientSecretSuffix}</td>
								<td className="px-4 py-4">
									<DeleteAPIKeyButton clientId={row.clientId} userId={user.id} />
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}

async function getApiKeys(userId: string) {
	return await db
		.select({ clientId: api_key.clientId, clientSecretSuffix: api_key.clientSecretSuffix })
		.from(api_key)
		.where(and(eq(api_key.userId, userId), isNull(api_key.deletedAt)));
}
