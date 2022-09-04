import React from "react";
import { trpc } from "utils/trpc";
import { Dialog } from "@headlessui/react";
import { Button } from "../controls/buttons";

interface ModalProps<T extends any = any> {
  data: T;
  onClose: () => void;
}
export const DeleteUserModal = ({ data, onClose }: ModalProps<string>) => {
  const { mutateAsync: deleteUser } = trpc.useMutation("user.delete");
  const onApprove = async () => {
    deleteUser({ name: data }).then(() => {
      onClose();
    });
  };
  return (
    <Dialog open={!!data} onClose={onClose}>
      <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-start p-40 bg-black bg-opacity-50">
        <Dialog.Panel className=" px-4 py-2 flex flex-col rounded-lg bg-neutral-800 divide-y-2 divide-red-500  shadow-xl">
          <Dialog.Title className="text-white text-xl font bold py-2">
            Do you want to delete {data}?
          </Dialog.Title>
          <Dialog.Description className="py-5 text-red-500 font-bold text-lg">
            This can not be undone!
          </Dialog.Description>
          <div className="flex pt-2 gap-2">
            <Button variant="outline" onClick={onClose}>
              Decline
            </Button>
            <Button onClick={onApprove} variant="danger">
              Delete Anyway
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
