import { Role } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { ActionButton } from "components/controls/buttons/ActionButton";
import { Select } from "components/controls/selects/Select";
import { Table } from "components/table";
import { useAssignRoleMutation, useUsersQuery } from "graphql/client/graphql";
import { useMemo } from "react";
interface User {
  name: string;
  role: string;
  token: string;
}
const columnHelper = createColumnHelper<User>();

const Page = () => {
  const users = useUsersQuery();
  const [assignRole] = useAssignRoleMutation();
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
          <Select<Role>
            className="w-32"
            value={info.getValue() as Role}
            options={Object.keys(Role).map((role) => ({
              value: role as unknown as Role,
              label: role as unknown as string,
            }))}
            onChange={async (value) => {
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
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "actions",
        cell: (props) => (
          <div className="flex gap-2">
            <ActionButton
              onClick={() => {
                alert("To be Done");
              }}
            >
              Change Password
            </ActionButton>
            <ActionButton
              variant="warning"
              onClick={() => {
                alert("To be Done");
              }}
            >
              Delete
            </ActionButton>
          </div>
        ),
      }),
    ],
    [assignRole, users]
  );
  if (!users.data?.users) {
    return <>loading</>;
  }

  return (
    <div className="w-full h-full flex justify-center ">
      <div className=" p-2 overflow-x-auto">
        <h1 className="mx-auto text-center font-bold text-2xl">Users</h1>
        <Table
          columns={columns}
          data={users.data.users}
          initialSort={[{ id: "name", desc: false }]}
        />
      </div>
    </div>
  );
};

export default Page;
