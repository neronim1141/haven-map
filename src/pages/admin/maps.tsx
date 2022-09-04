import React, { useEffect, useState } from "react";

import { Map } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "src/components/table";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import _ from "lodash";
import useDebounce from "~/hooks/useDebounce";
import { ActionsMenu } from "~/components/actionMenu";
import { HiSearch, HiPencil, HiOutlineX, HiCheck } from "react-icons/hi";
import { Spinner } from "~/components/spinner";
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
    <div className="relative w-36  flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setLoading(true);
        }}
        className="bg-neutral-600 rounded p-2 pr-7 relative w-full truncate ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm "
      />
      <span className="absolute right-1 animate-bounce">
        {loading && <HiPencil />}
      </span>
    </div>
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
          <button
            onClick={async () => {
              await update.mutateAsync({
                mapId: info.row.original.id,
                data: { hidden: !info.getValue() },
              });
              maps.refetch();
            }}
            className={`uppercase font-bold border rounded border-neutral-600 p-1 hover:bg-neutral-600  w-9 flex justify-center ${
              info.getValue() ? "text-red-700" : "text-green-700"
            }`}
          >
            {info.getValue() ? (
              <HiOutlineX className="w-5 h-5 font-extrabold" />
            ) : (
              <HiCheck className="w-5 h-5 font-extrabold" />
            )}
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
            className={`uppercase font-bold  rounded border border-neutral-600 p-1 hover:bg-neutral-600  w-9 flex justify-center   ${
              info.getValue() ? "text-green-700" : "text-red-700"
            }`}
          >
            {info.getValue() ? (
              <HiCheck className="w-5 h-5 font-extrabold" />
            ) : (
              <HiOutlineX className="w-5 h-5 font-extrabold" />
            )}
          </button>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          const rebuild = trpc.useMutation("map.rebuildZooms");
          return (
            <div className="flex items-center">
              {rebuild.isLoading ? <Spinner /> : <div className="w-5 h-5" />}

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
    <>
      <div className="w-full h-full flex ">
        <div className="p-2 mx-auto">
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
