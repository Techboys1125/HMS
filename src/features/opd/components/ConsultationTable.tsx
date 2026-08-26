const getVisitTypeColor = (visitType: string): string => {
  return visitTypeColors[visitType] || "bg-slate-100 text-slate-600";
};

const formatAppointmentTime = (time?: string): string => {
  if (!time) return "";
  const trimmed = String(time).trim();
  if (!trimmed) return "";

  const isoMatch = trimmed.match(
    /(\d{4})-(\d{2})-(\d{2})[T\s](\d{1,2}):(\d{2})/,
  );
  if (isoMatch) {
    const [, year, month, day, hourStr, minute] = isoMatch;
    const hour = Number(hourStr);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[Number(month) - 1]} ${year}, ${hour12}:${minute} ${suffix}`;
  }

  const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[Number(month) - 1]} ${year}`;
  }

  if (/AM|PM/i.test(trimmed)) return trimmed;

  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) return trimmed;

  let hour = parseInt(timeMatch[1], 10);
  const minute = timeMatch[2];
  if (isNaN(hour)) return trimmed;

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
};

import React, { useState } from "react";
import { Stethoscope } from "lucide-react";
import type { ConsultationRecord, OauthRole } from "../types/consultation";
import { StatusChip } from "./StatusChip";
import { Avatar } from "./Avatar";
import { ConsultationActionMenu } from "./ConsultationActionMenu";
import { Pagination } from "../../../common/components/Pagination";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface ConsultationTableProps {
  role: OauthRole;
  filteredConsultations: ConsultationRecord[];
  isLoading: boolean;
  onStartConsultation?: (id: string) => void;
  onOpenConsultation?: (id: string) => void;
  onCallPatient?: (item: ConsultationRecord) => void;
  onViewDetails?: (id: string) => void;
  onViewHistory?: (mrn: string) => void;
  onPatientSelect?: (mrn: string) => void;
  onPrint?: (item: ConsultationRecord) => void;
  onResetFilters: () => void;
  canStartConsultation?: boolean;
  canPrint?: boolean;
}

const visitTypeColors: Record<string, string> = {
  "First Visit": "bg-blue-50 text-blue-700",
  Walk: "bg-amber-50 text-amber-700",
  "Walk-In": "bg-amber-50 text-amber-700",
  Follow: "bg-purple-50 text-purple-700",
  "Follow-up": "bg-purple-50 text-purple-700",
};

export const ConsultationTable: React.FC<ConsultationTableProps> = ({
  role,
  filteredConsultations,
  isLoading,
  onStartConsultation,
  onOpenConsultation,
  onCallPatient,
  onViewDetails,
  onResetFilters,
  canStartConsultation = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredConsultations.length / pageSize);
  const paginatedConsultations = filteredConsultations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-12 bg-slate-50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredConsultations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Stethoscope size={32} />
          </div>
          <h3
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            No consultation records available.
          </h3>
          <p
            className="text-xs text-[#64748B] max-w-sm mt-1 mb-4"
            style={{ fontFamily: RB }}
          >
            There are no matching consultation records for the selected
            operational filters.
          </p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
            style={{ fontFamily: PP }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  const isRoleAdmin = String(role).toLowerCase().includes("admin");

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-150 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
            <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
              <th className="py-3.5 px-4">Token</th>
              <th className="py-3.5 px-4">Patient</th>
              <th className="py-3.5 px-4">MRN</th>
              <th className="py-3.5 px-4">Age / Gender</th>
              {role !== "doctor" && <th className="py-3.5 px-4">Doctor</th>}
              {role !== "doctor" && <th className="py-3.5 px-4">Department</th>}
              <th className="py-3.5 px-4">
                {role === "doctor" ? "Appointment Time" : "Appt Time"}
              </th>
              {role === "doctor" && <th className="py-3.5 px-4">Visit Type</th>}
              <th className="py-3.5 px-4">Status</th>
              {!isRoleAdmin && (
                <th className="py-3.5 px-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody
            className="divide-y divide-gray-100 text-[#111827]"
            style={{ fontFamily: RB }}
          >
            {paginatedConsultations.map((item) => (
              <tr
                key={item.id}
                onClick={() => onViewDetails?.(item.id)}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                  {item.tokenNo || "—"}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.patientName} size="sm" />
                    <div>
                      <div
                        className="font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {item.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.phone}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-700">
                  {item.mrn}
                </td>

                <td className="py-3.5 px-4 text-slate-700">
                  {item.age} yrs / {item.gender}
                </td>

                {role !== "doctor" && (
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {item.doctor}
                  </td>
                )}
                {role !== "doctor" && (
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.department || item.doctorSpecialty || "—"}
                  </td>
                )}
                <td className="py-3.5 px-4 font-medium text-slate-800">
                  {formatAppointmentTime(item.appointmentTime) || "—"}
                </td>

                {role === "doctor" && (
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${getVisitTypeColor(item.visitType)}`}
                      style={{ fontFamily: PP }}
                    >
                      {item.visitType || "—"}
                    </span>
                  </td>
                )}

                <td className="py-3.5 px-4">
                  <StatusChip status={item.status} />
                </td>

                {!isRoleAdmin && (
                  <ConsultationActionMenu
                    item={item}
                    role={role}
                    onStartConsultation={onStartConsultation}
                    onOpenConsultation={onOpenConsultation}
                    onCallPatient={onCallPatient}
                    onViewDetails={onViewDetails}
                    canStartConsultation={
                      String(role).toLowerCase() === "doctor"
                        ? true
                        : canStartConsultation
                    }
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        totalCount={filteredConsultations.length}
      />
    </div>
  );
};

export default ConsultationTable;
