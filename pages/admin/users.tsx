import React, { useState } from "react";

import { Role } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, Select } from "flowbite-react";
import { Table } from "components/table";
import { useAssignRoleMutation, useUsersQuery } from "graphql/client/graphql";
import { useMemo } from "react";
import { DeleteUserModal } from "../../components/modals/deleteUserModal";
interface User {
  name: string;
  role: string;
  token: string;
}
const columnHelper = createColumnHelper<User>();

const Page = () => {
  const users = useUsersQuery();
  const [assignRole] = useAssignRoleMutation();
  const [userToDelete, setUserToDelete] = useState<string>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        cell: (info) => info.getValue(),
        sortDescFirst: true,
      }),
      columnHelper.accessor("token", {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        cell: (info) => (
          <div className="w-36">
            <Select
              sizing="sm"
              value={info.getValue()}
              onChange={async (e) => {
                const value = e.target.value;
                const name = await assignRole({
                  variables: {
                    name: info.row.original.name,
                    role: value,
                  },
                });
                if (name) {
                  users.refetch();
                }
              }}
            >
              {Object.keys(Role).map((role) => (
                <option key={role} role={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "actions",
        cell: ({ row }) =>
          row.original.name !== "admin" ? (
            <div className="flex gap-2 items-stretch">
              <Button
                size="xs"
                onClick={() => {
                  alert("TBD");
                }}
              >
                Change Password
              </Button>
              <Button
                size="xs"
                color="warning"
                onClick={() => {
                  setUserToDelete(row.original.name);
                }}
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button
              size="xs"
              onClick={() => {
                alert("TBD");
              }}
            >
              Change Password
            </Button>
          ),
      }),
    ],
    [assignRole, users]
  );
  if (!users.data?.users) {
    return <>loading</>;
  }

  return (
    <>
      <div className="w-full h-full flex justify-center ">
        <div className=" p-2 overflow-x-auto">
          <h1 className="mx-auto text-center font-bold text-2xl">Users</h1>
          <Table
            columns={columns}
            data={users.data.users}
            initialSort={[{ id: "name", desc: false }]}
            className="mt-2"
          />
        </div>
      </div>
      <DeleteUserModal
        data={userToDelete}
        onClose={() => {
          setUserToDelete(undefined);
          users.refetch();
        }}
      />
    </>
  );
};

export default Page;
