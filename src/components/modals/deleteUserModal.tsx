import React from "react";
import { trpc } from "utils/trpc";
import { Dialog } from "@headlessui/react";
import { Button } from "../controls/buttons";
import { toast } from "react-toastify";

interface ModalProps<T extends any = any> {
  data: T;
  onClose: () => void;
}
export const DeleteUserModal = ({ data, onClose }: ModalProps<number>) => {
  const { mutateAsync: deleteUser } = trpc.useMutation("user.delete");
  const onApprove = async () => {
    await toast.promise(deleteUser({ id: data }), {
      pending: "Shifting in progress",
      success: "Shifting sucessfull",
      error: {
        render({ data }) {
          return data.message;
        },
      },
    });
  };
  return (
    <Dialog open={!!data} onClose={onClose}>
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 p-4 ">
        <Dialog.Panel className=" flex max-w-full flex-col divide-y-2 divide-red-500 rounded-lg bg-neutral-800 px-4  py-2  shadow-xl">
          <Dialog.Title className="font bold py-2 text-xl text-white">
            Do you want to delete {data}?
          </Dialog.Title>
          <Dialog.Description className="py-5 text-lg font-bold text-red-500">
            This can not be undone!
          </Dialog.Description>
          <div className="flex flex-wrap gap-2 pt-2">
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
