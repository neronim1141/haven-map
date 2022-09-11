import React, { useEffect, useState } from "react";

import { Map } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/components/tables/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import useDebounce from "~/hooks/useDebounce";
import { ActionsMenu } from "~/components/actionMenu";
import { HiSearch, HiPencil, HiOutlineX, HiCheck } from "react-icons/hi";
import { Spinner } from "~/components/spinner";
import { UseQueryResult } from "react-query";

const columnHelper = createColumnHelper<Map>();

const NameChangeInput = ({
  initialValue,
  onUpdate,
}: {
  initialValue: string;
  onUpdate: (name: string) => Promise<void>;
}) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string>(value, 2000);
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onUpdate(debouncedValue).then(() => setLoading(false));
    }
  }, [initialValue, debouncedValue, onUpdate]);
  return (
    <div className="w-content relative  flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setLoading(true);
        }}
        className="relative w-full truncate rounded bg-neutral-600 p-2 pr-7 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm "
      />
      <span className="absolute right-1 animate-bounce">
        {loading && <HiPencil />}
      </span>
    </div>
  );
};

interface MapsTableProps {
  maps: UseQueryResult<Map[]>;
}
export const MapsTable = ({ maps }: MapsTableProps) => {
  const update = trpc.useMutation("map.update");

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        cell: (info) => <div className="text-right">{info.getValue()}</div>,
      }),
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => (
          <NameChangeInput
            initialValue={info.getValue() ?? ""}
            onUpdate={async (name) => {
              const trimmedName = name.trim();
              await update.mutateAsync({
                mapId: info.row.original.id,
                data: { name: trimmedName !== "" ? trimmedName : null },
              });
              maps.refetch();
            }}
          />
        ),
        sortDescFirst: true,
        enableSorting: false,
      }),
      columnHelper.accessor("hidden", {
        header: "show",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <button
              onClick={async () => {
                await update.mutateAsync({
                  mapId: info.row.original.id,
                  data: { hidden: !info.getValue() },
                });
                maps.refetch();
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
      columnHelper.accessor("priority", {
        cell: (info) => (
          <div className="flex w-full justify-center">
            <button
              onClick={async () => {
                await update.mutateAsync({
                  mapId: info.row.original.id,
                  data: { priority: !info.getValue() },
                });
                maps.refetch();
              }}
              className={`flex w-9  justify-center rounded border border-neutral-600 p-1  font-bold uppercase hover:bg-neutral-600   ${
                info.getValue() ? "text-green-700" : "text-red-700"
              }`}
            >
              {info.getValue() ? (
                <HiCheck className="h-5 w-5 font-extrabold" />
              ) : (
                <HiOutlineX className="h-5 w-5 font-extrabold" />
              )}
            </button>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          const rebuild = trpc.useMutation("map.rebuildZooms");
          return (
            <div className="flex items-center">
              {rebuild.isLoading ? <Spinner /> : <div className="h-5 w-5" />}

              <ActionsMenu
                actions={[
                  {
                    name: "rebuild zooms",
                    onClick: () => {
                      rebuild.mutateAsync({ mapId: row.original.id });
                    },
                    icon: HiSearch,
                  },
                ]}
              />
            </div>
          );
        },
      }),
    ],
    [maps, update]
  );
  if (!maps.data) {
    return <>loading</>;
  }
  return (
    <Table
      columns={columns}
      data={maps.data}
      initialSort={[{ id: "priority", desc: true }]}
    />
  );
};
