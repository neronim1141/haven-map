import React, { ReactNode } from "react";

import { Tab } from "@headlessui/react";

import { trpc } from "utils/trpc";

import { MapsTable } from "~/components/tables/mapsTable";
import { UsersTable } from "~/components/tables/usersTable";
import { useFileRequest } from "~/hooks/useFileRequest";
import { Button } from "~/components/controls/buttons";
import { ProgressBar } from "~/components/progressBar";

const AdminTab = ({ children }: { children: ReactNode }) => {
  return (
    <Tab className=" w-full border border-neutral-500 bg-neutral-700 p-2 first:rounded-tl first:border-r-transparent last:rounded-tr last:border-l-transparent hover:bg-neutral-600 ">
      {children}
    </Tab>
  );
};

const AdminPage = () => {
  const maps = trpc.useQuery(["map.all"]);
  const users = trpc.useQuery(["user.all"]);
  const { loading, downloadProgress, getFile } =
    useFileRequest("/api/map/export");
  return (
    <div className="mx-auto w-full min-w-max  max-w-2xl p-5">
      <Tab.Group>
        <Tab.List className=" flex w-full justify-evenly overflow-hidden rounded-t">
          <AdminTab>Actions</AdminTab>
          <AdminTab>Maps</AdminTab>
          <AdminTab>Users</AdminTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="p-2">
            <div className="flex w-full items-center gap-2">
              <Button onClick={() => getFile()}>Export Data</Button>
              {loading && "preparing data..."}
              {downloadProgress != undefined && (
                <div className="flex-grow">
                  <ProgressBar completed={downloadProgress} />
                </div>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel className="p-2">
            <MapsTable maps={maps} />
          </Tab.Panel>
          <Tab.Panel className="p-2">
            <UsersTable users={users} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminPage;
