import React, { useEffect, useState } from "react";

import { Map } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/components/tables/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import useDebounce from "~/hooks/useDebounce";
import { ActionsMenu } from "~/components/actionMenu";
import { HiSearch, HiPencil, HiOutlineX, HiCheck } from "react-icons/hi";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";

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
  const rebuild = trpc.useMutation("map.rebuildZooms");

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
              await toast.promise(
                update.mutateAsync({
                  mapId: info.row.original.id,
                  data: { name: trimmedName !== "" ? trimmedName : null },
                }),
                {
                  pending: "Please wait...",
                  success: "Map name updated",
                  error: {
                    render({ data }) {
                      return data.message;
                    },
                  },
                }
              );
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
                await toast.promise(
                  update.mutateAsync({
                    mapId: info.row.original.id,
                    data: { hidden: !info.getValue() },
                  }),
                  {
                    pending: "Please wait...",
                    success: "Map visibility updated",
                    error: {
                      render({ data }) {
                        return data.message;
                      },
                    },
                  }
                );

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
                await toast.promise(
                  update.mutateAsync({
                    mapId: info.row.original.id,
                    data: { priority: !info.getValue() },
                  }),
                  {
                    pending: "Please wait...",
                    success: "Map priority updated",
                    error: {
                      render({ data }) {
                        return data.message;
                      },
                    },
                  }
                );
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
          return (
            <div className="flex items-center">
              <ActionsMenu
                actions={[
                  {
                    name: "rebuild zooms",
                    onClick: () => {
                      toast.promise(
                        rebuild.mutateAsync({ mapId: row.original.id }),
                        {
                          pending: "Rebuilding in progress",
                          success: "Rebuilding sucessfull",
                          error: {
                            render({ data }) {
                              return data.message;
                            },
                          },
                        }
                      );
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
    [maps, update, rebuild]
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
