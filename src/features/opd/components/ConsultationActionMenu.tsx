import React from "react";
import {
  Eye,
  Phone,
  Stethoscope,
  FolderOpen,
  FileText,
} from "lucide-react";
import type { ConsultationRecord, OauthRole } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";

export interface ConsultationActionMenuProps {
  item: ConsultationRecord;
  role: OauthRole;
  onStartConsultation?: (id: string) => void;
  onOpenConsultation?: (id: string) => void;
  onCallPatient?: (item: ConsultationRecord) => void;
  onViewDetails?: (id: string) => void;
  canStartConsultation?: boolean;
}

export const ConsultationActionMenu: React.FC<ConsultationActionMenuProps> = ({
  item,
  role,
  onStartConsultation,
  onOpenConsultation,
  onCallPatient,
  onViewDetails,
  canStartConsultation = false,
}) => {
  const handleDetailsClick = () => {
    onViewDetails?.(item.id);
  };

  if (role === "admin") {
    return (
      <td className="py-3.5 px-4 text-right relative">
        <button
          onClick={handleDetailsClick}
          className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors inline-block"
          title="View Consultation Details"
        >
          <Eye size={15} />
        </button>
      </td>
    );
  }

  const isCalled = item.status === "CALLED";
  const isInConsultation = item.status === "IN_CONSULTATION";
  const isCompleted = item.status === "COMPLETED";
  const isWaitingForDoctorCall =
    item.status === "WAITING_FOR_DOCTOR_CALL" ||
    item.status === "WAITING_FOR_DOCTOR" ||
    item.status === "WAITING";

  return (
    <td className="py-3.5 px-4 text-right relative">
      <div className="flex items-center justify-end gap-1.5">
        {canStartConsultation && isCalled && (
          <button
            onClick={() => onStartConsultation?.(item.id)}
            className="px-2.5 py-1.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            style={{ fontFamily: PP }}
          >
            <Stethoscope size={13} /> Start Consultation
          </button>
        )}

        {canStartConsultation && isInConsultation && onOpenConsultation && (
          <button
            onClick={() => onOpenConsultation(item.id)}
            className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            style={{ fontFamily: PP }}
          >
            <FolderOpen size={13} /> Open Consultation
          </button>
        )}

        {canStartConsultation && onCallPatient && isWaitingForDoctorCall && (
          <button
            onClick={() => onCallPatient(item)}
            className="px-2.5 py-1.5 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
            title="Call Patient"
            style={{ fontFamily: PP }}
          >
            <Phone size={13} /> Call
          </button>
        )}

        {isCompleted && (
          <button
            onClick={handleDetailsClick}
            className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            title="View Finalized Prescription"
            style={{ fontFamily: PP }}
          >
            <FileText size={13} /> View Prescription
          </button>
        )}
      </div>
    </td>
  );
};

export default ConsultationActionMenu;
