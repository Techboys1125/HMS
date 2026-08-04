import React from "react";
import { ConfirmationModal } from "./ConfirmationModal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Delete"
      message={`Are you absolutely sure you want to delete "${itemName}"? This action is permanent and cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      isDangerous={true}
    />
  );
};

export default DeleteModal;
