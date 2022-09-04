import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";

interface TableProps<T extends object = {}> {
  columns: ColumnDef<T, any>[];
  data: T[];
  initialSort?: SortingState;
  className?: string;
}
export const Table = <T extends object>({
  columns,
  data,
  initialSort,
  className,
}: TableProps<T>) => {
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? []);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className={`  ${className} `}>
      <table>
        {table.getHeaderGroups().map((headerGroup) => (
          <thead key={headerGroup.id}>
            <tr>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="capitalize p-1 bg-neutral-700  first:rounded-tl last:rounded-tr"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <HiArrowSmUp className="w-5 h-5" />,
                        desc: <HiArrowSmDown className="w-5 h-5" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
        ))}
        <tbody className="divide-y rounded-b n">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white dark:border-neutral-700 dark:bg-neutral-800"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 px-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
