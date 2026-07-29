import React from "react";
import {
  ArrowUpDown,
  Stethoscope,
  UserPlus,
  Eye,
  Edit,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { DoctorRecord, DoctorAvailability, DoctorStatus } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";

function getAvailabilityBadgeStyle(avail: DoctorAvailability) {
  switch (avail) {
    case "Available Today":
      return { bg: "bg-[#E6F4F1] text-[#009688] border-teal-200", dot: "bg-[#009688]" };
    case "On Duty":
      return { bg: "bg-blue-50 text-[#0D47A1] border-blue-200", dot: "bg-[#0D47A1]" };
    case "On Call":
      return { bg: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-600" };
    case "On Leave":
      return { bg: "bg-amber-50 text-[#F59E0B] border-amber-200", dot: "bg-[#F59E0B]" };
    case "Out of Office":
      return { bg: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
  }
}

function getStatusBadgeStyle(status: DoctorStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-[#66BB6A] border-emerald-200 font-semibold";
    case "Inactive":
      return "bg-slate-100 text-slate-600 border-slate-200 font-semibold";
    case "On Leave":
      return "bg-amber-50 text-[#F59E0B] border-amber-200 font-semibold";
    case "Suspended":
      return "bg-red-50 text-[#EF4444] border-red-200 font-semibold";
  }
}

export interface DoctorTableProps {
  doctors: DoctorRecord[];
  filteredDoctors: DoctorRecord[];
  isLoading: boolean;
  sortColumn: keyof DoctorRecord;
  sortDirection: "asc" | "desc";
  onSort: (col: keyof DoctorRecord) => void;
  onViewProfile: (doctor: DoctorRecord) => void;
  onQuickView: (doctor: DoctorRecord) => void;
  onEdit: (doctor: DoctorRecord) => void;
  onViewSchedule: (doctor: DoctorRecord) => void;
  onDeactivate: (doctor: DoctorRecord) => void;
  onAddDoctor: () => void;
  onResetFilters: () => void;
}

export function DoctorTable({
  doctors,
  filteredDoctors,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  onViewProfile,
  onQuickView,
  onEdit,
  onViewSchedule,
  onDeactivate,
  onAddDoctor,
  onResetFilters,
}: DoctorTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
            <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
              {[
                { key: "id", label: "Doctor ID" },
                { key: "name", label: "Doctor Name" },
                { key: "department", label: "Department" },
                { key: "specialty", label: "Specialty" },
                { key: null, label: "Qualification" },
                { key: "experienceYrs", label: "Experience" },
                { key: "consultationFee", label: "Fee ($)" },
                { key: "availability", label: "Availability" },
                { key: "status", label: "Status" },
                { key: null, label: "Actions", align: "text-right" },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={col.key ? () => onSort(col.key as keyof DoctorRecord) : undefined}
                  className={`px-4 py-3.5 ${
                    col.key ? "cursor-pointer hover:text-[#0D47A1] transition-colors" : ""
                  } ${col.align || ""}`}
                >
                  <div className={`flex items-center gap-1 ${col.align ? "justify-end" : ""}`}>
                    <span>{col.label}</span>
                    {col.key && <ArrowUpDown size={12} className="text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-[#111827]">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
                      <div className="space-y-1">
                        <div className="h-3 bg-slate-200 rounded w-28" />
                        <div className="h-2 bg-slate-100 rounded w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-28" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-24" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-12" /></td>
                  <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-12" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 bg-slate-200 rounded-full w-24" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
                  <td className="px-4 py-3.5"><div className="h-6 bg-slate-200 rounded w-20 ml-auto" /></td>
                </tr>
              ))
            ) : filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <Stethoscope size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                        No doctors found.
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        No doctor records matched your search query or selected filter options.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={onResetFilters}
                        className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        Reset Filters
                      </button>
                      <button
                        onClick={onAddDoctor}
                        className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm"
                        style={{ fontFamily: PP }}
                      >
                        <UserPlus size={14} /> Add Doctor
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doc) => {
                const initials = doc.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .filter((n) => n.length > 0)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const availBadge = getAvailabilityBadgeStyle(doc.availability);

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td
                      onClick={() => onViewProfile(doc)}
                      className="px-4 py-3.5 font-mono font-bold text-[#0D47A1] hover:underline"
                    >
                      {doc.id}
                    </td>

                    <td onClick={() => onViewProfile(doc)} className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl bg-teal-100 text-[#009688] font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200"
                          style={{ fontFamily: PP }}
                        >
                          {initials}
                        </div>
                        <div>
                          <span
                            className="font-bold text-[#111827] block group-hover:text-[#0D47A1] transition-colors"
                            style={{ fontFamily: PP }}
                          >
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            EMP: {doc.empId} &bull; Reg: {doc.regNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-[#111827]">{doc.department}</td>

                    <td className="px-4 py-3.5 text-slate-700">{doc.specialty}</td>

                    <td className="px-4 py-3.5 text-[#64748B] max-w-[150px] truncate" title={doc.qualification}>
                      {doc.qualification}
                    </td>

                    <td className="px-4 py-3.5 font-medium text-[#111827]">{doc.experienceYrs} Yrs</td>

                    <td className="px-4 py-3.5 font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
                      ${doc.consultationFee}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${availBadge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${availBadge.dot}`} />
                        {doc.availability}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] border inline-block ${getStatusBadgeStyle(doc.status)}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onQuickView(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Quick Details Drawer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => onEdit(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          title="Edit Doctor Profile"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          onClick={() => onViewSchedule(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="View Schedule & Practice Hours"
                        >
                          <Calendar size={15} />
                        </button>

                        <button
                          onClick={() => onDeactivate(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Deactivate Doctor"
                        >
                          <AlertTriangle size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredDoctors.length > 0 && (
        <div className="px-4 py-3 bg-slate-50 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
          <div>
            Showing{" "}
            <span className="font-bold text-[#111827]">{filteredDoctors.length}</span>{" "}
            of{" "}
            <span className="font-bold text-[#111827]">{doctors.length}</span>{" "}
            registered doctors
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#009688]" /> Available Today:{" "}
              {doctors.filter(
                (d) => d.availability === "Available Today" || d.availability === "On Duty",
              ).length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> On Leave:{" "}
              {doctors.filter((d) => d.availability === "On Leave" || d.status === "On Leave").length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
