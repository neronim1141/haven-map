import React, { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  InitialTableState,
  VisibilityState,
} from "@tanstack/react-table";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import { Pagination } from "../controls/pagination/pagination";

interface TableProps<T extends object = {}> {
  columns: ColumnDef<T, any>[];
  data?: T[];
  initialSort?: SortingState;
  columnVisibility?: VisibilityState;
  className?: string;
  filters?: ReactNode;
  pagination?: {
    onPageChange: (page: number) => void;
    count: number;
    current: number;
    perPage: number;
  };
}

export const Table = <T extends object>({
  columns,
  data = [],
  initialSort,
  columnVisibility,
}: TableProps<T>) => {
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? []);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="w-full min-w-max">
      {table.getHeaderGroups().map((headerGroup) => (
        <thead key={headerGroup.id}>
          <tr>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="bg-neutral-700 p-1 text-center capitalize"
              >
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none flex items-center justify-center"
                        : " ",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <HiArrowSmUp className="h-5 w-5" />,
                      desc: <HiArrowSmDown className="h-5 w-5" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
      ))}
      <tbody className="n divide-y rounded-b">
        {data.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-neutral-700 bg-neutral-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="p-4 text-center text-2xl font-bold"
            >
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
