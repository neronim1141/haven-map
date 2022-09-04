import { Button, Modal } from "flowbite-react";
import React from "react";
import { trpc } from "utils/trpc";

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
    <Modal show={!!data} onClose={onClose}>
      <Modal.Header>Do you want to delete {data}?</Modal.Header>
      <Modal.Body>
        <div className="text-white">This can not be undone!</div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onApprove} color="failure">
          Delete Anyway
        </Button>
        <Button color="gray" onClick={onClose}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
