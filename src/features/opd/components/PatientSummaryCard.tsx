import React from "react";
import type { VisitType } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface PatientSummaryCardProps {
  patientName: string;
  mrn: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  allergies?: string[];
  phone?: string;
  primaryDoctor?: string;
  opdRoom?: string;
  visitType?: VisitType | string;
  appointmentTime?: string;
  totalVisitsCount?: number;
  lastVisitDate?: string;
  extraDetails?: React.ReactNode;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patientName,
  mrn,
  age,
  gender,
  bloodGroup = "N/A",
  allergies = [],
  phone,
  primaryDoctor,
  opdRoom,
  visitType,
  appointmentTime,
  totalVisitsCount,
  lastVisitDate,
  extraDetails,
}) => {
  const initials =
    patientName
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  return (
    <div className="bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shrink-0"
            style={{ fontFamily: PP }}
          >
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-bold text-base text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {patientName}
              </span>
              <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                {mrn}
              </span>
              {totalVisitsCount !== undefined && (
                <span
                  className="text-[10px] font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full"
                  style={{ fontFamily: PP }}
                >
                  {totalVisitsCount} Total Visits
                </span>
              )}
            </div>
            <div
              className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mt-1"
              style={{ fontFamily: RB }}
            >
              <span>
                {age} yrs / {gender}
              </span>
              <span>•</span>
              <span>
                Blood Group:{" "}
                <strong className="text-[#111827]">{bloodGroup}</strong>
              </span>
              {lastVisitDate && (
                <>
                  <span>•</span>
                  <span>
                    Last Visit:{" "}
                    <strong className="text-[#111827]">{lastVisitDate}</strong>
                  </span>
                </>
              )}
              {primaryDoctor && (
                <>
                  <span>•</span>
                  <span>
                    Primary Doctor:{" "}
                    <strong className="text-[#0D47A1]">{primaryDoctor}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {extraDetails && (
          <div className="flex items-center gap-2 self-start lg:self-center">
            {extraDetails}
          </div>
        )}
      </div>

      {/* Grid of contact, allergies & doctor info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-xs">
        <div>
          <span
            className="block text-slate-400 font-semibold uppercase tracking-wider mb-1"
            style={{ fontFamily: PP }}
          >
            Contact Details
          </span>
          <span className="text-slate-700" style={{ fontFamily: RB }}>
            {phone || "No phone recorded"}
          </span>
        </div>
        <div>
          <span
            className="block text-slate-400 font-semibold uppercase tracking-wider mb-1"
            style={{ fontFamily: PP }}
          >
            Known Allergies
          </span>
          <div className="flex flex-wrap gap-1">
            {allergies.length > 0 ? (
              allergies.map((a, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-100 font-semibold"
                >
                  ⚠ {a}
                </span>
              ))
            ) : (
              <span className="text-slate-400" style={{ fontFamily: RB }}>
                No known allergies
              </span>
            )}
          </div>
        </div>
        <div>
          <span
            className="block text-slate-400 font-semibold uppercase tracking-wider mb-1"
            style={{ fontFamily: PP }}
          >
            Session Info
          </span>
          <span className="text-slate-700" style={{ fontFamily: RB }}>
            {opdRoom ? `OPD Room: ${opdRoom}` : ""}
            {visitType ? ` · Visit: ${visitType}` : ""}
            {appointmentTime ? ` · Time: ${appointmentTime}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCard;
