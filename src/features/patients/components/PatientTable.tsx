import { useState, useMemo } from "react";
import {
  MoreVertical,
  Edit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Receipt,
  Users,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Patient } from "../types/patient.types";
import { usePermissions } from "../../../permissions";
import { Pagination } from "../../../common/components/Pagination";

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
 * Single common Patient list table with RBAC system controls.
 * Column visibility, available actions, and accessibility change dynamically based on user permissions/role.
 */
export function PatientTable({
  patients,
  totalCount,
  isLoading,
  selectedPatientId,
  activeActionMenuId,
  hasActiveFilters,
  onSelectRow,
  onToggleActionMenu,
  onViewProfile,
  onEditPatient,
  onBookAppointment,
  onActivatePatient,
  onDeactivatePatient,
  onViewMedicalHistory,
  onViewAppointments,
  onGenerateBill,
  onResetFilters,
  userRole,
}: {
  patients: Patient[];
  totalCount: number;
  isLoading: boolean;
  selectedPatientId: string | null;
  activeActionMenuId: string | null;
  hasActiveFilters: boolean;
  onSelectRow: (p: Patient) => void;
  onOpenQuickView?: (p: Patient) => void;
  onToggleActionMenu: (id: string | null) => void;
  onViewProfile: (id: string) => void;
  onEditPatient?: (p: Patient) => void;
  onBookAppointment?: (p: Patient) => void;
  onActivatePatient?: (p: Patient) => void;
  onDeactivatePatient?: (p: Patient) => void;
  onViewMedicalHistory?: (id: string) => void;
  onViewAppointments?: (id: string) => void;
  onGenerateBill?: (id: string) => void;
  onResetFilters: () => void;
  userRole?: string;
}) {
  const permissions = usePermissions();
  const activeRole = (
    userRole ||
    permissions.role ||
    "RECEPTIONIST"
  ).toUpperCase();

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (key === "actions") return;
    if (sortColumn === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  // Sorted Patients
  const sortedPatients = useMemo(() => {
    if (!sortColumn) return patients;

    return [...patients].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortColumn) {
        case "mrn":
          valA = a.mrn || String(a.id);
          valB = b.mrn || String(b.id);
          break;
        case "name":
          valA = (a.patientName || a.name || "").toLowerCase();
          valB = (b.patientName || b.name || "").toLowerCase();
          break;
        case "age_gender":
          valA = a.age || 0;
          valB = b.age || 0;
          break;
        case "phone":
          valA = a.phone || "";
          valB = b.phone || "";
          break;
        case "email":
          valA = (a.email || "").toLowerCase();
          valB = (b.email || "").toLowerCase();
          break;
        case "blood_group":
          valA = a.bloodGroup || "";
          valB = b.bloodGroup || "";
          break;
        case "category":
          valA = (a.patientCategory || "").toLowerCase();
          valB = (b.patientCategory || "").toLowerCase();
          break;
        case "reg_type":
          valA = (a.registrationType || "").toLowerCase();
          valB = (b.registrationType || "").toLowerCase();
          break;
        case "assigned_doctor":
          valA = (a.assignedDoctor || "").toLowerCase();
          valB = (b.assignedDoctor || "").toLowerCase();
          break;
        case "reg_date":
          valA = a.registrationDate || "";
          valB = b.registrationDate || "";
          break;
        case "visit_count":
          valA = a.visitCount || 0;
          valB = b.visitCount || 0;
          break;
        case "last_visit":
          valA = a.lastVisitDate || "";
          valB = b.lastVisitDate || "";
          break;
        case "next_appointment":
          valA = a.nextAppointmentDate || "";
          valB = b.nextAppointmentDate || "";
          break;
        case "status":
          valA = (a.status || "").toLowerCase();
          valB = (b.status || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [patients, sortColumn, sortDirection]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const totalPages = Math.ceil(sortedPatients.length / pageSize);
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const paginatedPatients = sortedPatients.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  // Column definitions & role-based visibility
  const isDoctor = activeRole === "DOCTOR";
  const isReceptionist = activeRole === "RECEPTIONIST";

  const columns = [
    { key: "mrn", label: "MRN", visible: true },
    { key: "name", label: "Patient Name", visible: true },
    { key: "age_gender", label: "Age/Gender", visible: true },
    { key: "phone", label: "Mobile", visible: true },
    { key: "email", label: "Email", visible: !isDoctor && !isReceptionist },
    { key: "blood_group", label: "Blood Group", visible: isDoctor },
    {
      key: "category",
      label: "Category",
      visible: !isDoctor && !isReceptionist,
    },
    { key: "reg_type", label: "Reg. Type", visible: !isDoctor },
    { key: "assigned_doctor", label: "Assigned Doctor", visible: !isDoctor },
    { key: "reg_date", label: "Registration Date", visible: !isDoctor },
    { key: "visit_count", label: "Visit Count", visible: isDoctor },
    { key: "last_visit", label: "Last Visit", visible: isDoctor },
    { key: "next_appointment", label: "Next Appointment", visible: isDoctor },
    { key: "status", label: "Status", visible: !isDoctor },
    { key: "actions", label: "Actions", visible: true },
  ].filter((c) => c.visible);

  // RBAC Permission checks for Row Actions
  const canEdit = permissions.can("PATIENT_EDIT");
  const canViewHistory =
    permissions.can("PATIENT_VIEW_HISTORY") ||
    isDoctor ||
    activeRole.includes("ADMIN");
  const canViewAppointments = permissions.can("APPOINTMENT_VIEW");
  const canBilling =
    permissions.can("BILLING_CREATE") || permissions.can("BILLING_VIEW");

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
      {/* Click-outside Backdrop for Actions Dropdown */}
      {activeActionMenuId && (
        <div
          className="fixed inset-0 z-20 bg-transparent"
          onClick={() => onToggleActionMenu(null)}
        />
      )}

      {/* Table Header Section */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
        <h2
          className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
          style={{ fontFamily: PP }}
        >
          <Users size={18} className="text-[#0D47A1]" /> All Patients
        </h2>
        <div className="text-xs font-semibold text-[#64748B] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB] shadow-sm">
          Showing {sortedPatients.length} of {totalCount}{" "}
          {totalCount === 1 ? "entity" : "entities"}
        </div>
      </div>
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
      ) : sortedPatients.length === 0 ? (
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
          </div>
        </div>
      ) : (
        /* COMMON PATIENT TABLE */
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]/80 border-b border-[#E5E7EB]">
                {columns.map((col) => {
                  const isSorted = sortColumn === col.key;
                  const isActions = col.key === "actions";

                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors select-none ${
                        isActions
                          ? "text-right cursor-default"
                          : "text-[#64748B] hover:text-[#0D47A1] cursor-pointer"
                      }`}
                      style={{ fontFamily: PP }}
                    >
                      <div
                        className={`flex items-center gap-1.5 ${
                          isActions ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{col.label}</span>
                        {!isActions && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp size={13} className="text-[#0D47A1]" />
                              ) : (
                                <ArrowDown
                                  size={13}
                                  className="text-[#0D47A1]"
                                />
                              )
                            ) : (
                              <ArrowUpDown
                                size={12}
                                className="opacity-50 hover:opacity-100"
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPatients.map((p) => {
                const mrn = p.mrn || String(p.id);
                const name = (p.patientName || p.name || "").trim();
                const age = p.age || 0;
                const gender =
                  p.gender === "FEMALE" || p.gender === "F" ? "Female" : "Male";
                const phone = p.phone || "-";
                const email = p.email || "-";
                const category = (p.patientCategory || "GENERAL")
                  .toLowerCase()
                  .replace(/_/g, " ");
                const regType = (p.registrationType || "WALK_IN")
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                const doctor = p.assignedDoctor || "Unassigned";
                const regDate = p.registrationDate
                  ? p.registrationDate.split("T")[0]
                  : "";
                const status = p.status || "Active";

                return (
                  <tr
                    key={mrn}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${selectedPatientId === mrn ? "bg-blue-50/60" : ""}`}
                    onClick={() => onSelectRow(p)}
                  >
                    {columns.some((c) => c.key === "mrn") && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                          {mrn}
                        </span>
                      </td>
                    )}

                    {columns.some((c) => c.key === "name") && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} size="sm" />
                          <div>
                            <span
                              className="text-xs font-bold text-[#111827] block"
                              style={{ fontFamily: PP }}
                            >
                              {name}
                            </span>
                            <span className="text-[11px] text-[#64748B] block capitalize">
                              {regType}
                            </span>
                          </div>
                        </div>
                      </td>
                    )}

                    {columns.some((c) => c.key === "age_gender") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {age} Y · {gender}
                      </td>
                    )}

                    {columns.some((c) => c.key === "phone") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-mono">
                        {phone}
                      </td>
                    )}

                    {columns.some((c) => c.key === "email") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        {email}
                      </td>
                    )}

                    {columns.some((c) => c.key === "blood_group") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs font-bold text-[#009688]">
                        {p.bloodGroup ? p.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-").replace("UNKNOWN", "N/A").replace("N/A", "N/A") : "-"}
                      </td>
                    )}

                    {columns.some((c) => c.key === "category") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        <span className="font-medium capitalize">
                          {category}
                        </span>
                      </td>
                    )}

                    {columns.some((c) => c.key === "assigned_doctor") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={14} className="text-[#009688]" />
                          <span className="font-medium text-[#111827]">
                            {doctor}
                          </span>
                        </div>
                      </td>
                    )}
                    {columns.some((c) => c.key === "reg_date") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">
                        {regDate}
                      </td>
                    )}

                    {columns.some((c) => c.key === "visit_count") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {p.visitCount ?? 0}
                      </td>
                    )}

                    {columns.some((c) => c.key === "last_visit") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {p.lastVisitDate || "-"}
                      </td>
                    )}

                    {columns.some((c) => c.key === "next_appointment") && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        {p.nextAppointmentDate || "-"}
                      </td>
                    )}

                    {columns.some((c) => c.key === "status") && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {status.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </td>
                    )}

                    {columns.some((c) => c.key === "actions") && (
                      <td
                        className="px-4 py-3.5 whitespace-nowrap text-right relative z-30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewProfile(mrn)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                            title="View Patient Profile"
                          >
                            <Eye size={15} />
                          </button>

                          {canEdit && onEditPatient && (
                            <button
                              onClick={() => onEditPatient(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                              title="Edit Patient Profile"
                            >
                              <Edit size={15} />
                            </button>
                          )}

                          {onBookAppointment && (
                            <button
                              onClick={() => onBookAppointment(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Book Appointment"
                            >
                              <Calendar size={15} />
                            </button>
                          )}

                          {status.toUpperCase() === "INACTIVE"
                            ? onActivatePatient && (
                                <button
                                  onClick={() => onActivatePatient(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                  title="Activate Patient"
                                >
                                  <CheckCircle2 size={15} />
                                </button>
                              )
                            : onDeactivatePatient && (
                                <button
                                  onClick={() => onDeactivatePatient(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Deactivate Patient"
                                >
                                  <AlertTriangle size={15} />
                                </button>
                              )}

                          <div className="relative">
                            <button
                              onClick={() =>
                                onToggleActionMenu(
                                  activeActionMenuId === mrn ? null : mrn,
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                              title="More Options"
                            >
                              <MoreVertical size={15} />
                            </button>
                            {activeActionMenuId === mrn && (
                              <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150 text-left">
                                {canViewHistory && (
                                  <button
                                    onClick={() => {
                                      onToggleActionMenu(null);
                                      if (onViewMedicalHistory)
                                        onViewMedicalHistory(mrn);
                                      else onViewProfile(mrn);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#111827] hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                  >
                                    <FileText
                                      size={14}
                                      className="text-[#009688]"
                                    />{" "}
                                    Medical History
                                  </button>
                                )}
                                {canViewAppointments && (
                                  <button
                                    onClick={() => {
                                      onToggleActionMenu(null);
                                      if (onViewAppointments)
                                        onViewAppointments(mrn);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#111827] hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                  >
                                    <Calendar
                                      size={14}
                                      className="text-purple-600"
                                    />{" "}
                                    Appointments
                                  </button>
                                )}
                                {canBilling && (
                                  <button
                                    onClick={() => {
                                      onToggleActionMenu(null);
                                      if (onGenerateBill) onGenerateBill(mrn);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#111827] hover:bg-[#66BB6A]/10 hover:text-[#66BB6A] flex items-center gap-2 font-medium transition-colors border-t border-gray-100 mt-1 pt-2"
                                  >
                                    <Receipt
                                      size={14}
                                      className="text-amber-600"
                                    />{" "}
                                    Generate Bill
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE FOOTER / PAGINATION */}
      {!isLoading && patients.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalCount={sortedPatients.length}
        />
      )}
    </div>
  );
}
