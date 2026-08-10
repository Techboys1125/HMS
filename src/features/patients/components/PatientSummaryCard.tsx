/**
 * PatientSummaryCard – Compact patient info card for lists and search results
 */
import type { Patient } from "../types/patient.types";
import { PatientStatusBadge } from "./PatientStatusBadge";
import { PP, RB } from "../../doctors/constants/doctors.constants";

interface PatientSummaryCardProps {
  patient: Patient;
  onClick?: () => void;
  selected?: boolean;
}

export function PatientSummaryCard({
  patient,
  onClick,
  selected = false,
}: PatientSummaryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        onClick ? "cursor-pointer hover:bg-slate-50" : ""
      } ${
        selected
          ? "bg-blue-50/50 border-[#0D47A1]/20 ring-1 ring-[#0D47A1]/10"
          : "bg-white border-[#E5E7EB]"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0D47A1]/10 to-teal-100 text-[#0D47A1] flex items-center justify-center font-bold text-sm shrink-0">
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold text-[#111827] truncate"
            style={{ fontFamily: PP }}
          >
            {patient.fullName}
          </span>
          <PatientStatusBadge status={patient.status} />
        </div>
        <div
          className="text-[11px] text-[#64748B] mt-0.5"
          style={{ fontFamily: RB }}
        >
          MRN: {patient.mrn} · {patient.gender}{" "}
          {patient.age ? `· ${patient.age} yrs` : ""}
        </div>
      </div>
    </div>
  );
}
