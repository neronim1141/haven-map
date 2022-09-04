import React, { useState } from "react";

import { Role, User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "src/components/table";
import { useMemo } from "react";
import { DeleteUserModal } from "../../components/modals/deleteUserModal";
import { trpc } from "utils/trpc";
import { ActionsMenu } from "~/components/actionMenu";
import { HiTrash, HiPencil } from "react-icons/hi";
import { Select } from "~/components/controls/select";

const columnHelper = createColumnHelper<Pick<User, "name" | "role">>();

const Page = () => {
  const users = trpc.useQuery(["user.all"]);
  const { mutateAsync: updateUser } = trpc.useMutation("user.update");

  const [userToDelete, setUserToDelete] = useState<string>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => info.getValue(),
        sortDescFirst: true,
      }),

      columnHelper.accessor("role", {
        cell: (info) => (
          <Select
            disabled={info.row.original.name === "admin"}
            value={{
              value: info.getValue(),
              label: info.getValue(),
            }}
            onChange={async (value) => {
              if (value !== info.row.original.role) {
                const name = await updateUser({
                  name: info.row.original.name,
                  role: value as Role,
                });

                if (name) {
                  users.refetch();
                }
              }
            }}
            className="w-32"
            options={Object.keys(Role).map((role) => ({
              value: role,
              label: role,
            }))}
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <ActionsMenu
            actions={[
              {
                name: "Change Password",
                onClick: () => {
                  alert("TBD");
                },
                icon: HiPencil,
              },
              ...(row.original.name !== "admin"
                ? [
                    {
                      name: "Delete",
                      onClick: () => {
                        setUserToDelete(row.original.name);
                      },
                      variant: "warning" as const,
                      icon: HiTrash,
                    },
                  ]
                : []),
            ]}
          />
        ),
      }),
    ],
    [updateUser, users]
  );
  if (!users.data) {
    return <>loading</>;
  }
  return (
    <>
      <div className="w-full h-full flex">
        <div className="p-2 mx-auto">
          <h1 className="text-center font-bold text-2xl">Users</h1>
          <Table
            columns={columns}
            data={users.data}
            initialSort={[{ id: "name", desc: false }]}
            className="mt-2"
          />
        </div>
      </div>
      {userToDelete && (
        <DeleteUserModal
          data={userToDelete}
          onClose={() => {
            setUserToDelete(undefined);
            users.refetch();
          }}
        />
      )}
    </>
  );
};

export default Page;
