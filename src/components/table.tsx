import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Table as FlowTable } from "flowbite-react";

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
    <div className={`overflow-auto ${className}`}>
      <FlowTable>
        {table.getHeaderGroups().map((headerGroup) => (
          <FlowTable.Head key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <FlowTable.HeadCell key={header.id} className="capitalize">
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </FlowTable.HeadCell>
            ))}
          </FlowTable.Head>
        ))}
        <FlowTable.Body className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <FlowTable.Row
              key={row.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800 "
            >
              {row.getVisibleCells().map((cell) => (
                <FlowTable.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </FlowTable.Cell>
              ))}
            </FlowTable.Row>
          ))}
        </FlowTable.Body>
      </FlowTable>
    </div>
  );
};
