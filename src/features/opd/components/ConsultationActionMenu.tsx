import React from "react";
import { Eye, Phone, Stethoscope, FolderOpen, FileText } from "lucide-react";
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
  role = "doctor",
  onStartConsultation,
  onOpenConsultation,
  onCallPatient,
  onViewDetails,
  canStartConsultation = true,
}) => {
  const handleDetailsClick = () => {
    onViewDetails?.(item.id);
  };

  const statusUpper = String(item.status || "")
    .toUpperCase()
    .replace(/[\s-]/g, "_");

  const isCalled = statusUpper === "CALLED";
  const isInConsultation =
    statusUpper === "IN_CONSULTATION" || statusUpper === "IN_PROGRESS";
  const isCompleted =
    statusUpper === "COMPLETED" ||
    statusUpper === "CONSULTATION_COMPLETED" ||
    statusUpper === "READY_FOR_BILLING" ||
    statusUpper === "BILLING_PENDING" ||
    statusUpper === "PAYMENT_COMPLETED" ||
    statusUpper === "FINALIZED";
  const isWaitingForDoctorCall =
    statusUpper === "WAITING_FOR_DOCTOR_CALL" ||
    statusUpper === "WAITING_FOR_DOCTOR" ||
    statusUpper === "WAITING";

  const isDoctorRole = String(role).toLowerCase() === "doctor";

  return (
    <td className="py-3.5 px-4 text-right relative">
      <div className="flex items-center justify-end gap-1.5">
        {isDoctorRole && canStartConsultation && isWaitingForDoctorCall && onCallPatient && (
          <button
            onClick={() => onCallPatient(item)}
            className="px-2.5 py-1.5 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
            title="Call Patient"
            style={{ fontFamily: PP }}
          >
            <Phone size={13} /> Call Patient
          </button>
        )}

        {isDoctorRole && canStartConsultation && isCalled && onStartConsultation && (
          <button
            onClick={() => onStartConsultation(item.id)}
            className="px-2.5 py-1.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            style={{ fontFamily: PP }}
          >
            <Stethoscope size={13} /> Start Consultation
          </button>
        )}

        {isDoctorRole && canStartConsultation && isInConsultation && (
          <button
            onClick={() =>
              onOpenConsultation
                ? onOpenConsultation(item.id)
                : onStartConsultation?.(item.id)
            }
            className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
            style={{ fontFamily: PP }}
          >
            <FolderOpen size={13} /> Continue Consultation
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

        <button
          onClick={handleDetailsClick}
          className="p-1.5 hover:bg-slate-200 text-[#0D47A1] border border-slate-200 rounded-lg transition-colors inline-block"
          title="View Consultation Details"
        >
          <Eye size={15} />
        </button>
      </div>
    </td>
  );
};

export default ConsultationActionMenu;
