/**
 * PatientProfileHeader – Reusable header for patient profile pages
 * Shows avatar, name, MRN, age, gender, status, and action buttons
 */
import { Calendar, Edit3, ChevronLeft } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";

interface PatientProfileHeaderProps {
  patient: Patient;
  currentRole: string;
  onBack?: () => void;
  onEdit?: () => void;
  onBookAppointment?: () => void;
  isFamilyMember?: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    ACTIVE: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    INACTIVE: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    },
    DECEASED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  };

export function PatientProfileHeader({
  patient,
  onBack,
  onEdit,
  onBookAppointment,
  isFamilyMember = false,
}: PatientProfileHeaderProps) {
  const status = String(patient.status || "ACTIVE").toUpperCase();
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.ACTIVE;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-[#64748B]" />
          </button>
        )}

        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0D47A1]/10 to-teal-100 text-[#0D47A1] flex items-center justify-center font-bold text-lg shrink-0">
          {patient.photoUrl ? (
            <img
              src={patient.photoUrl}
              alt={patient.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            patient.fullName?.charAt(0) || "P"
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="text-base font-bold text-[#111827] truncate"
              style={{ fontFamily: PP }}
            >
              {patient.fullName}
            </h1>
            {isFamilyMember && (
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-semibold border border-teal-200 shrink-0">
                Family Member
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-2 mt-0.5 text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span className="font-mono font-medium">MRN: {patient.mrn}</span>
            <span>·</span>
            <span>{patient.gender}</span>
            {patient.age !== undefined && (
              <>
                <span>·</span>
                <span>{patient.age} yrs</span>
              </>
            )}
            <span>·</span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {status}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-[11px] font-semibold hover:bg-slate-50 transition-colors"
            >
              <Edit3 size={13} />
              Edit
            </button>
          )}
          {onBookAppointment && (
            <button
              onClick={onBookAppointment}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
            >
              <Calendar size={13} />
              Book Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
