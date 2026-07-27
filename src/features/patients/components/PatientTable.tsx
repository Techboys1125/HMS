import {
  Eye,
  MoreVertical,
  User,
  Edit,
  FileText,
  Calendar,
  Receipt,
  Users,
  Plus,
  UserCheck,
} from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PatientStatusBadge as StatusBadge } from "./PatientStatusBadge";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

/**
 * Patient list table with loading skeleton, empty state, and pagination footer.
 * Design preserved from original PatientListScreen table section.
 */
export function PatientTable({
  patients,
  totalCount,
  isLoading,
  selectedPatientId,
  activeActionMenuId,
  hasActiveFilters,
  onSelectRow,
  onOpenQuickView,
  onToggleActionMenu,
  onViewProfile,
  onEditPatient,
  onViewMedicalHistory,
  onViewAppointments,
  onGenerateBill,
  onRegisterClick,
  onResetFilters,
}: {
  patients: Patient[];
  totalCount: number;
  isLoading: boolean;
  selectedPatientId: string | null;
  activeActionMenuId: string | null;
  hasActiveFilters: boolean;
  onSelectRow: (p: Patient) => void;
  onOpenQuickView: (p: Patient) => void;
  onToggleActionMenu: (id: string | null) => void;
  onViewProfile: (id: string) => void;
  onEditPatient: (p: Patient) => void;
  onViewMedicalHistory?: () => void;
  onViewAppointments?: () => void;
  onGenerateBill?: () => void;
  onRegisterClick: () => void;
  onResetFilters: () => void;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
      {isLoading ? (
        /* SKELETON TABLE LOADING STATE */
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-10 bg-slate-100 rounded-xl w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-50 rounded-xl w-full flex items-center justify-between px-4"
            >
              <div className="w-20 h-4 bg-slate-200 rounded" />
              <div className="w-32 h-4 bg-slate-200 rounded" />
              <div className="w-16 h-4 bg-slate-200 rounded" />
              <div className="w-28 h-4 bg-slate-200 rounded" />
              <div className="w-24 h-4 bg-slate-200 rounded" />
              <div className="w-16 h-6 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : patients.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center mb-4 shadow-inner">
            <Users size={32} />
          </div>
          <h3
            className="text-lg font-bold text-[#111827] mb-1"
            style={{ fontFamily: PP }}
          >
            No patients found.
          </h3>
          <p
            className="text-xs text-[#64748B] max-w-sm mb-6"
            style={{ fontFamily: RB }}
          >
            We couldn&apos;t find any patient records matching your current
            search query or applied filters.
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Search &amp; Filters
              </button>
            )}
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Plus size={14} /> Register Patient
            </button>
          </div>
        </div>
      ) : (
        /* PATIENT TABLE */
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]/80 border-b border-[#E5E7EB]">
                {[
                  "Patient ID",
                  "Patient Name",
                  "Age",
                  "Gender",
                  "Phone",
                  "Assigned Doctor",
                  "Registration Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap"
                    style={{ fontFamily: PP }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${selectedPatientId === p.id ? "bg-blue-50/60" : ""}`}
                  onClick={() => onSelectRow(p)}
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {p.id}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} size="sm" />
                      <div>
                        <span
                          className="text-xs font-bold text-[#111827] block"
                          style={{ fontFamily: PP }}
                        >
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[#64748B] block">
                          {p.visitType} Intake
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                    {p.age} Y
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                    {p.gender === "F"
                      ? "Female"
                      : p.gender === "M"
                        ? "Male"
                        : "Other"}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-mono">
                    {p.mobile}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={14} className="text-[#009688]" />
                      <span className="font-medium text-[#111827]">
                        {p.doctor}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">
                    {p.regDate}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td
                    className="px-4 py-3.5 whitespace-nowrap relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenQuickView(p)}
                        className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Quick Drawer View"
                      >
                        <Eye size={15} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            onToggleActionMenu(
                              activeActionMenuId === p.id ? null : p.id,
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Row Actions"
                        >
                          <MoreVertical size={15} />
                        </button>
                        {activeActionMenuId === p.id && (
                          <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150">
                            <button
                              onClick={() => {
                                onToggleActionMenu(null);
                                onViewProfile(p.id);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                            >
                              <User size={14} className="text-[#0D47A1]" /> View
                              Profile
                            </button>
                            <button
                              onClick={() => {
                                onToggleActionMenu(null);
                                onEditPatient(p);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                            >
                              <Edit size={14} className="text-slate-500" /> Edit
                              Patient
                            </button>
                            <button
                              onClick={() => {
                                onToggleActionMenu(null);
                                if (onViewMedicalHistory)
                                  onViewMedicalHistory();
                                else onViewProfile(p.id);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                            >
                              <FileText
                                size={14}
                                className="text-[#009688]"
                              />{" "}
                              View Medical History
                            </button>
                            <button
                              onClick={() => {
                                onToggleActionMenu(null);
                                if (onViewAppointments) onViewAppointments();
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                            >
                              <Calendar
                                size={14}
                                className="text-purple-600"
                              />{" "}
                              View Appointments
                            </button>
                            <button
                              onClick={() => {
                                onToggleActionMenu(null);
                                if (onGenerateBill) onGenerateBill();
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-[#66BB6A]/10 hover:text-[#66BB6A] flex items-center gap-2 font-medium transition-colors border-t border-gray-100 mt-1 pt-2"
                            >
                              <Receipt size={14} className="text-amber-600" />{" "}
                              Generate Bill
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE FOOTER / PAGINATION */}
      {!isLoading && patients.length > 0 && (
        <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div
            className="flex items-center gap-2 text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span>Showing</span>
            <span className="font-semibold text-[#111827]">
              {patients.length}
            </span>
            <span>of</span>
            <span className="font-semibold text-[#111827]">{totalCount}</span>
            <span>patients</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">
              1
            </button>
            <button className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}