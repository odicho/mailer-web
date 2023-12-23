import type { Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function TablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				className="border rounded p-1"
				onClick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				{'<<'}
			</button>
			<button
				type="button"
				className="border rounded p-1"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				{'<'}
			</button>
			<button
				type="button"
				className="border rounded p-1"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				{'>'}
			</button>
			<button
				type="button"
				className="border rounded p-1"
				onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				{'>>'}
			</button>
			<span className="flex items-center gap-1">
				<div>Page</div>
				<strong>
					{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</strong>
			</span>
		</div>
	);
}
