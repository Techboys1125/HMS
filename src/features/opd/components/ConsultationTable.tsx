import React, { useState } from "react";
import { Stethoscope } from "lucide-react";
import type { ConsultationRecord, OauthRole } from "../types/consultation";
import { StatusChip } from "./StatusChip";
import { Avatar } from "./Avatar";
import { ConsultationActionMenu } from "./ConsultationActionMenu";
import { Pagination } from "../../../common/components/Pagination";
import { formatTime } from "../../../lib/time-utils";

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

  const getVisitTypeColor = (visitType: string): string => {
    return visitTypeColors[visitType] || "bg-slate-100 text-slate-600";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
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
          <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
            No consultation records available.
          </h3>
          <p
            className="text-xs text-[#64748B] max-w-sm mt-1 mb-4"
            style={{ fontFamily: RB }}
          >
            There are no matching consultation records for the selected operational filters.
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

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              <th className="py-3.5 px-4">Consultation ID</th>
              <th className="py-3.5 px-4">Patient</th>
              <th className="py-3.5 px-4">MRN</th>
              {role === "doctor" && <th className="py-3.5 px-4">Age / Gender</th>}
              <th className="py-3.5 px-4">Doctor</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">{role === "doctor" ? "Appointment Time" : "Appt Time"}</th>
              {role === "doctor" && <th className="py-3.5 px-4">Visit Type</th>}
              <th className="py-3.5 px-4">Status</th>
              {role === "admin" && <th className="py-3.5 px-4">Duration</th>}
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs" style={{ fontFamily: RB }}>
            {paginatedConsultations.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                  <div className="flex items-center gap-1.5">
                    <span>{item.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                      {item.tokenNo}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.patientName} size="sm" />
                    <div>
                      <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>
                        {item.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.phone}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-700">{item.mrn}</td>

                {role === "doctor" && (
                  <td className="py-3.5 px-4 text-slate-700">
                    {item.age} yrs / {item.gender}
                  </td>
                )}

                <td className="py-3.5 px-4 font-medium text-slate-800">{item.doctor}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.department}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{formatTime(item.appointmentTime)}</td>

                {role === "doctor" && (
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${getVisitTypeColor(item.visitType)}`}
                      style={{ fontFamily: PP }}
                    >
                      {item.visitType}
                    </span>
                  </td>
                )}

                <td className="py-3.5 px-4">
                  <StatusChip status={item.status} />
                </td>

                {role === "admin" && (
                  <td className="py-3.5 px-4 font-medium text-slate-700">{item.duration || "N/A"}</td>
                )}

                <ConsultationActionMenu
                  item={item}
                  role={role}
                  onStartConsultation={onStartConsultation}
                  onOpenConsultation={onOpenConsultation}
                  onCallPatient={onCallPatient}
                  onViewDetails={onViewDetails}
                  canStartConsultation={canStartConsultation}
                />
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
