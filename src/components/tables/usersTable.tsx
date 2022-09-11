import React, { useState } from "react";

import { Role, User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/components/tables/table";
import { useMemo } from "react";
import { DeleteUserModal } from "../../components/modals/deleteUserModal";
import { trpc } from "utils/trpc";
import { ActionsMenu } from "~/components/actionMenu";
import { HiTrash, HiPencil } from "react-icons/hi";
import { Select } from "~/components/controls/select";
import { UseQueryResult } from "react-query";
import { ResetPasswordModal } from "../modals/resetPasswordModal";

const columnHelper = createColumnHelper<Pick<User, "name" | "role">>();

interface UsersTableProps {
  users: UseQueryResult<
    {
      name: string;
      role: Role;
      token: string;
    }[]
  >;
}
export const UsersTable = ({ users }: UsersTableProps) => {
  const { mutateAsync: updateUser } = trpc.useMutation("user.update");

  const [userToDelete, setUserToDelete] = useState<string>();
  const [userToResetPassword, setUserToResetPassword] = useState<string>();

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
                name: "Reset Password",
                onClick: () => {
                  setUserToResetPassword(row.original.name);
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
      <Table
        columns={columns}
        data={users.data}
        initialSort={[{ id: "name", desc: false }]}
      />

      {userToDelete && (
        <DeleteUserModal
          data={userToDelete}
          onClose={() => {
            setUserToDelete(undefined);
            users.refetch();
          }}
        />
      )}
      {userToResetPassword && (
        <ResetPasswordModal
          data={userToResetPassword}
          onClose={() => {
            setUserToResetPassword(undefined);
          }}
        />
      )}
    </>
  );
};
