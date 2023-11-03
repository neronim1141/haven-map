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
import dayjs from "dayjs";
dayjs().format();

type UserPick = Pick<
  User,
  "id" | "name" | "role" | "createdAt" | "updatedAt" | "lastVisit"
>;
const columnHelper = createColumnHelper<UserPick>();

interface UsersTableProps {
  users: UseQueryResult<UserPick[]>;
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
            options={Object.keys(Role).map((role) => ({
              value: role,
              label: role,
            }))}
          />
        ),
      }),
      columnHelper.accessor("lastVisit", {
        header: "last visit",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
      }),
      columnHelper.accessor("createdAt", {
        header: "created",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
      }),
      columnHelper.accessor("updatedAt", {
        header: "updated",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <ActionsMenu
            className="text-right"
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
        initialSort={[{ id: "createdAt", desc: true }]}
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
