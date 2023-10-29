import React, { ReactNode } from "react";

import { Tab } from "@headlessui/react";

import { trpc } from "utils/trpc";

import { MapsTable } from "~/components/tables/mapsTable";
import { UsersTable } from "~/components/tables/usersTable";
import { useFileRequest } from "~/hooks/useFileRequest";
import { Button } from "~/components/controls/buttons";
import { toast } from "react-toastify";
import { MarkersTable } from "~/components/tables/markersTable";

const AdminTab = ({ children }: { children: ReactNode }) => {
  return (
    <Tab className="w-full border border-neutral-500 bg-neutral-700 p-2 outline-none first:rounded-tl first:border-r-transparent last:rounded-tr last:border-l-transparent hover:bg-neutral-600 focus:border-neutral-300 ui-selected:bg-blue-700 ">
      {children}
    </Tab>
  );
};

const AdminPage = () => {
  const exportMapToastId = "exportMap";
  const info = trpc.useQuery(["info"]);
  const maps = trpc.useQuery(["map.all"]);
  const users = trpc.useQuery(["user.all"]);
  const { getFile, loading } = useFileRequest("/api/map/export", (percent) => {
    if (percent < 100) {
      toast.update(exportMapToastId, {
        render: `Downloading progress: \n${percent}%`,
        type: toast.TYPE.DEFAULT,
        isLoading: false,
        progress: percent / 100,
        autoClose: false,
      });
    } else {
      toast.update(exportMapToastId, {
        render: `Map downloaded`,
        isLoading: false,
        type: toast.TYPE.SUCCESS,
        progress: undefined,
        autoClose: 1500,
        closeOnClick: true,
        draggable: true,
      });
    }
  });
  return (
    <div className="container mx-auto w-full p-5">
      <Tab.Group>
        <Tab.List className=" flex w-full justify-evenly overflow-hidden rounded-t border">
          <AdminTab>Info</AdminTab>
          <AdminTab>Maps</AdminTab>
          <AdminTab>Markers</AdminTab>
          <AdminTab>Users</AdminTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="p-2" key="info">
            {info.data && (
              <div className="p-2">
                <h1 className="font-bold">Data Count:</h1>
                maps: {info.data.count.maps}
                <br />
                grids: {info.data.count.grids}
                <br />
                markers: {info.data.count.markers}
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <Button
                disabled={loading}
                onClick={() => {
                  getFile();
                  toast.loading("Preparing file...", {
                    toastId: exportMapToastId,
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                  });
                }}
              >
                Export Data
              </Button>
            </div>
          </Tab.Panel>
          <Tab.Panel className="overflow-x-auto p-2" key="maps">
            <MapsTable maps={maps} />
          </Tab.Panel>
          <Tab.Panel className="overflow-x-auto p-2" key="markers">
            <MarkersTable />
          </Tab.Panel>
          <Tab.Panel className="overflow-x-auto p-2" key="users">
            <UsersTable users={users} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminPage;
