import type { ApiKey } from '@repo/db/schema';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Pick<ApiKey, 'clientId' | 'clientSecretSuffix'>>[] = [
	{
		accessorKey: 'clientId',
		header: 'Client Id',
		cell: ({ row }) => <div className="capitalize">{row.original.clientId}</div>,
	},
	{
		accessorKey: 'clientSecretSuffix',
		header: 'Client Secret',
		cell: ({ row }) => <div className="capitalize">{row.original.clientSecretSuffix}</div>,
	},
];
