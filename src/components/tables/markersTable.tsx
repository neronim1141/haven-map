import React, { useState } from "react";

import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/components/tables/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import { HiOutlineX, HiCheck } from "react-icons/hi";
import { toast } from "react-toastify";
import { TableMarker } from "~/server/routers/marker";
import dayjs from "dayjs";
import { DebouncedInput } from "../controls/inputs/DebouncedInput";
import { Pagination } from "../controls/pagination/pagination";
import Link from "next/link";
import { HnHMaxZoom, TileSize } from "~/server/routers/map/config";
dayjs().format();

const columnHelper = createColumnHelper<TableMarker>();
const PER_PAGE = 25;
export const MarkersTable = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const markers = trpc.useQuery([
    "marker.table",
    {
      filters: { name: query },
      pagination: { take: PER_PAGE, skip: (page - 1) * PER_PAGE },
    },
  ]);
  const filters = useMemo(
    () => (
      <div className="flex items-center gap-2 p-2">
        <h2>Filters:</h2>
        <div>
          <DebouncedInput
            className="max-w-[12rem]"
            placeholder="Filter by name"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
    ),
    [query]
  );
  const pagination = useMemo(
    () =>
      markers.data?.count ? (
        <div className="mt-2 flex justify-center ">
          <Pagination
            onPageChange={setPage}
            count={markers.data.count}
            perPage={PER_PAGE}
            current={page}
          />
        </div>
      ) : null,
    [markers.data, page]
  );

  const update = trpc.useMutation("marker.update");

  const columns = useMemo(
    () => [
      columnHelper.accessor("mapId", {
        cell: (info) => <div className="text-right">{info.getValue()}</div>,
      }),
      columnHelper.display({
        id: "goto",
        cell: ({
          row: {
            original: { mapId, x, y },
          },
        }) =>
          mapId ? (
            <Link
              href={`/map/${mapId}/${HnHMaxZoom}/${~~(x / TileSize)}/${~~(
                y / TileSize
              )}`}
            >
              goto
            </Link>
          ) : null,
      }),
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => (
          <DebouncedInput
            className="min-w-[12rem]"
            value={info.getValue() ?? ""}
            onChange={async (e) => {
              const name = e.target.value;
              const trimmedName = name.trim();
              await toast.promise(
                update.mutateAsync({
                  id: info.row.original.id,
                  data: { name: trimmedName !== "" ? trimmedName : undefined },
                }),
                {
                  pending: "Please wait...",
                  success: "Marker name updated",
                  error: {
                    render({ data }) {
                      return data.message;
                    },
                  },
                }
              );
              markers.refetch();
            }}
          />
        ),
        sortDescFirst: true,
      }),
      columnHelper.accessor("type", {}),
      columnHelper.accessor("hidden", {
        header: "show",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <button
              onClick={async () => {
                await toast.promise(
                  update.mutateAsync({
                    id: info.row.original.id,
                    data: { hidden: !info.getValue() },
                  }),
                  {
                    pending: "Please wait...",
                    success: "Marker visibility updated",
                    error: {
                      render({ data }) {
                        return data.message;
                      },
                    },
                  }
                );
                markers.refetch();
              }}
              className={`flex w-9 justify-center rounded border border-neutral-600 p-1  font-bold uppercase hover:bg-neutral-600  ${
                info.getValue() ? "text-red-700" : "text-green-700"
              }`}
            >
              {info.getValue() ? (
                <HiOutlineX className="h-5 w-5 font-extrabold" />
              ) : (
                <HiCheck className="h-5 w-5 font-extrabold" />
              )}
            </button>
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "created",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
      }),
      columnHelper.accessor("updatedAt", {
        header: "updated",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
      }),
    ],
    [markers, update]
  );
  if (!markers.data) return <>loading</>;

  return (
    <div className={`min-w-max `}>
      {filters}
      <Table
        columns={columns}
        data={markers.data.entries}
        initialSort={[{ id: "updatedAt", desc: false }]}
      />
      {pagination}
    </div>
  );
};
