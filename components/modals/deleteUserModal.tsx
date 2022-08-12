import { Button, Modal } from "flowbite-react";
import { useDeleteUserMutation } from "graphql/client/graphql";
import React from "react";

interface ModalProps<T extends any = any> {
  data?: T;
  onClose: () => void;
}
export const DeleteUserModal = ({ data, onClose }: ModalProps<string>) => {
  const [deleteUser] = useDeleteUserMutation();
  if (!data) return null;
  const onApprove = async () => {
    deleteUser({ variables: { name: data } }).then(() => {
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
