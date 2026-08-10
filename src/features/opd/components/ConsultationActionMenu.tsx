import React from "react";
import {
  Eye,
  RotateCcw,
  Users,
  Printer,
  MoreVertical,
  Phone,
  Stethoscope,
  FolderOpen,
} from "lucide-react";
import type { ConsultationRecord, OauthRole } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface ConsultationActionMenuProps {
  item: ConsultationRecord;
  role: OauthRole;
  onStartConsultation?: (id: string) => void;
  onOpenConsultation?: (id: string) => void;
  onCallPatient?: (item: ConsultationRecord) => void;
  onViewDetails?: (id: string) => void;
  onViewHistory?: (mrn: string) => void;
  onPatientSelect?: (mrn: string) => void;
  onPrint?: (item: ConsultationRecord) => void;
  canStartConsultation?: boolean;
  canPrint?: boolean;
}

export const ConsultationActionMenu: React.FC<ConsultationActionMenuProps> = ({
  item,
  role,
  onStartConsultation,
  onOpenConsultation,
  onCallPatient,
  onViewDetails,
  onViewHistory,
  onPatientSelect,
  onPrint,
  canStartConsultation = false,
  canPrint = false,
}) => {
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(
    null,
  );

  const handleDetailsClick = () => {
    onViewDetails?.(item.id);
    setOpenDropdownId(null);
  };

  const handleHistoryClick = () => {
    if (onViewHistory) {
      onViewHistory(item.mrn);
    }
    setOpenDropdownId(null);
  };

  const handlePrintClick = () => {
    onPrint?.(item);
    setOpenDropdownId(null);
  };

  const handlePatientSelect = () => {
    onPatientSelect?.(item.mrn);
    setOpenDropdownId(null);
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
  const isWaiting =
    item.status === "WAITING" ||
    item.status === "BOOKED" ||
    item.status === "WAITING_FOR_VITALS" ||
    item.status === "WAITING_FOR_DOCTOR_CALL";

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

        {canStartConsultation && onCallPatient && isWaiting && (
          <button
            onClick={() => onCallPatient(item)}
            disabled={(item.status as string) === "WAITING_FOR_VITALS" || (item.status as string) === "CHECKED_IN"}
            className={`px-2.5 py-1.5 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              (item.status as string) === "WAITING_FOR_VITALS" || (item.status as string) === "CHECKED_IN"
                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            title={(item.status as string) === "WAITING_FOR_VITALS" || (item.status as string) === "CHECKED_IN" ? "Waiting for Vitals" : "Call Patient"}
            style={{ fontFamily: PP }}
          >
            <Phone size={13} /> Call
          </button>
        )}

        <div className="relative inline-block text-left">
          <button
            onClick={() =>
              setOpenDropdownId(openDropdownId === item.id ? null : item.id)
            }
            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center"
          >
            <MoreVertical size={14} />
          </button>

          {openDropdownId === item.id && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 text-left">
              <button
                onClick={handleDetailsClick}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                style={{ fontFamily: RB }}
              >
                <Eye size={13} className="text-slate-500" />
                View Details
              </button>

              {onViewHistory && (
                <button
                  onClick={handleHistoryClick}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  style={{ fontFamily: RB }}
                >
                  <RotateCcw size={13} className="text-[#0D47A1]" />
                  View Consultation History
                </button>
              )}

              {onPatientSelect && (
                <button
                  onClick={handlePatientSelect}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  style={{ fontFamily: RB }}
                >
                  <Users size={13} className="text-slate-500" />
                  View Patient Profile
                </button>
              )}

              {canPrint && (
                <button
                  onClick={handlePrintClick}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  style={{ fontFamily: RB }}
                >
                  <Printer size={13} className="text-[#009688]" />
                  Print Consultation Summary
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </td>
  );
};

export default ConsultationActionMenu;
