import React from "react";

export interface EncounterPrescriptionViewModalProps {
  encounterId: string | number | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEditConsultation?: (encounterId: string | number) => void;
}

export const EncounterPrescriptionViewModal: React.FC<
  EncounterPrescriptionViewModalProps
> = () => {
  return null;
};
