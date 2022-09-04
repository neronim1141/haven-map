import React, { useEffect, useState } from "react";

import { Map } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "src/components/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import _ from "lodash";
import useDebounce from "~/hooks/useDebounce";
import { Button, Spinner } from "flowbite-react";

const columnHelper = createColumnHelper<Map>();

const NameChangeInput = ({
  initialValue,
  onUpdate,
}: {
  initialValue: string;
  onUpdate: (name: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string>(value, 1000);
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onUpdate(debouncedValue);
      setLoading(false);
    }
  }, [initialValue, debouncedValue, onUpdate]);
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setLoading(true);
        }}
      />
      {loading ? "O" : ""}
    </>
  );
};

const Page = () => {
  const maps = trpc.useQuery(["map.all"]);
  const update = trpc.useMutation("map.update");

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => (
          <NameChangeInput
            initialValue={info.row.original.name ?? ""}
            onUpdate={async (name) => {
              await update.mutateAsync({
                mapId: info.row.original.id,
                data: { name },
              });
              maps.refetch();
            }}
          />
        ),
        sortDescFirst: true,
        enableSorting: false,
      }),
      columnHelper.accessor("hidden", {
        cell: (info) => (
          <button
            onClick={async () => {
              await update.mutateAsync({
                mapId: info.row.original.id,
                data: { hidden: !info.getValue() },
              });
              maps.refetch();
            }}
            className={`uppercase font-bold border rounded border-gray-600 p-1 hover:bg-gray-600 ${
              info.getValue() ? "text-red-500" : "text-green-500"
            }`}
          >
            {info.getValue() ? "yes" : "no"}
          </button>
        ),
      }),
      columnHelper.accessor("priority", {
        cell: (info) => (
          <button
            onClick={async () => {
              await update.mutateAsync({
                mapId: info.row.original.id,
                data: { priority: !info.getValue() },
              });
              maps.refetch();
            }}
            className={`uppercase font-bold border rounded border-gray-600 p-1 hover:bg-gray-600  ${
              info.getValue() ? "text-green-500" : "text-red-500"
            }`}
          >
            {info.getValue() ? "yes" : "no"}
          </button>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "actions",
        cell: ({ row }) => {
          const rebuild = trpc.useMutation("map.rebuildZooms");

          return (
            <div className="flex items-center gap-1">
              <Button
                size="xs"
                onClick={() => {
                  rebuild.mutateAsync({ mapId: row.original.id });
                }}
              >
                rebuild zooms
              </Button>
              {rebuild.isLoading && <Spinner />}
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
    <>
      <div className="w-full h-full flex justify-center ">
        <div className=" p-2 overflow-x-auto">
          <h1 className="mx-auto text-center font-bold text-2xl">Maps</h1>
          <Table
            columns={columns}
            data={maps.data}
            initialSort={[{ id: "priority", desc: true }]}
            className="mt-2"
          />
        </div>
      </div>
    </>
  );
};

export default Page;
