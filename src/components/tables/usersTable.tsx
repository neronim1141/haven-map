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
import Link from "next/link";

const columnHelper = createColumnHelper<Pick<User, "id" | "name" | "role">>();

interface UsersTableProps {
  users: UseQueryResult<Pick<User, "id" | "name" | "role">[]>;
}
export const UsersTable = ({ users }: UsersTableProps) => {
  const { mutateAsync: updateUser } = trpc.useMutation("user.update");

  const [userToDelete, setUserToDelete] = useState<number>();
  const [userToResetPassword, setUserToResetPassword] = useState<number>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        cell: (info) => info.getValue(),
        sortDescFirst: true,
      }),
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => (
          <Link href="/profile/[id]" as={`/profile/${info.row.original.id}`}>
            <a className="p-1 underline hover:text-neutral-400">
              {info.getValue()}
            </a>
          </Link>
        ),
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
                  id: info.row.original.id,
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
                  setUserToResetPassword(row.original.id);
                },
                icon: HiPencil,
              },
              ...(row.original.name !== "admin"
                ? [
                    {
                      name: "Delete",
                      onClick: () => {
                        setUserToDelete(row.original.id);
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
