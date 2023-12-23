import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Link from 'next/link';
import { and, db, eq, isNull } from '@repo/db';
import { api_key } from '@repo/db/schema';
import { CreateAPIKeyButton, DeleteAPIKeyButton } from './api-keys';
import { withUnstableCache } from '../../utils/withUnstableCache';
import { apiKeysCacheKey } from '../../utils/cache-keys';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { columns } from './columns';

export default async function Page() {
	const user = await getUser();
	if (!user) redirect('/login');

	const apiKeys = await getApiKeys(user.id);
	// const apiKeys = await withUnstableCache({
	// 	fn: getApiKeys,
	// 	args: [user.id],
	// 	keys: ['api-keys'],
	// 	tags: ['a-unique-tag'],
	// });

	const table = useReactTable({
		data: apiKeys,
		columns,
		getCoreRowModel: getCoreRowModel(),
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
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
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
