import React, { useEffect, useState } from "react";

import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/components/tables/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import useDebounce from "~/hooks/useDebounce";
import { HiSearch, HiPencil, HiOutlineX, HiCheck } from "react-icons/hi";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";
import { ClientMarker } from "~/server/routers/marker";
import dayjs from "dayjs";
dayjs().format();
const columnHelper = createColumnHelper<ClientMarker>();

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
        className="relative w-full min-w-[14rem] truncate rounded bg-neutral-600 p-2 pr-7 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm "
      />
      <span className="absolute right-1 animate-bounce">
        {loading && <HiPencil />}
      </span>
    </div>
  );
};

interface MarkersTableProps {
  markers: UseQueryResult<ClientMarker[]>;
}
export const MarkersTable = ({ markers }: MarkersTableProps) => {
  const update = trpc.useMutation("marker.update");

  const columns = useMemo(
    () => [
      columnHelper.accessor("mapId", {
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
      columnHelper.accessor("type", {
        cell: (info) => <div className="text-right">{info.getValue()}</div>,
      }),
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
  if (!markers.data) {
    return <>loading</>;
  }
  return (
    <Table
      columns={columns}
      data={markers.data}
      initialSort={[{ id: "updatedAt", desc: false }]}
    />
  );
};
