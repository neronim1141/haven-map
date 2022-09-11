import React, { useState } from "react";
import { trpc } from "utils/trpc";
import { Dialog } from "@headlessui/react";
import { Button } from "../controls/buttons";
import { useClipboard } from "~/hooks/useClipboard";
import { HiClipboardCopy } from "react-icons/hi";

interface ModalProps<T extends any = any> {
  data: T;
  onClose: () => void;
}
export const ResetPasswordModal = ({ data, onClose }: ModalProps<string>) => {
  const { mutateAsync: resetPassword } = trpc.useMutation("user.resetPassword");
  const copyToClipboard = useClipboard();

  const [newPassword, setNewPassword] = useState<string>();
  const onApprove = async () => {
    resetPassword({ name: data }).then((password) => {
      setNewPassword(password);
    });
  };
  return (
    <Dialog open={!!data} onClose={onClose}>
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 p-4">
        {!newPassword ? (
          <Dialog.Panel className=" flex max-w-full  flex-col rounded-lg bg-neutral-800 px-4  py-2  shadow-xl">
            <Dialog.Title className="font bold py-2 text-xl text-white">
              Do you want to reset {data} password?
            </Dialog.Title>
            <Dialog.Description className="py-5 text-lg font-bold text-red-500">
              This can not be undone!
            </Dialog.Description>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Decline
              </Button>
              <Button onClick={onApprove}>Reset</Button>
            </div>
          </Dialog.Panel>
        ) : (
          <Dialog.Panel className=" flex max-w-full  flex-col rounded-lg bg-neutral-800 px-4  py-2 shadow-xl">
            <Dialog.Title className="font bold py-2 text-xl text-white">
              Password for user: {data} reseted sucessfully
            </Dialog.Title>
            <Dialog.Description className="flex flex-wrap items-center gap-2 py-5 text-lg text-white">
              new password: <span className="font-bold">{newPassword}</span>
              <Button
                variant="outline"
                className="text-xs"
                onClick={() =>
                  copyToClipboard(newPassword).then(function () {
                    alert("copied!");
                  })
                }
              >
                Copy <HiClipboardCopy />
              </Button>
            </Dialog.Description>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </Dialog.Panel>
        )}
      </div>
    </Dialog>
  );
};
