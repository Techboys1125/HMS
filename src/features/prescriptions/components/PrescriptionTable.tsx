import React, { useState } from "react";
import {
  Eye,
  Printer,
  Download,
  Edit3,
  ChevronDown,
  Plus,
  FileText,
  Clock,
  Pill,
} from "lucide-react";
import type { UnifiedPrescription } from "../types/prescription.types";
import { PrescriptionStatusBadge } from "./PrescriptionStatusBadge";
import { Pagination } from "../../../common/components/Pagination";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials =
    name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";
  return (
    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
      {initials}
    </div>
  );
};

interface PrescriptionTableProps {
  role: "patient" | "doctor" | "admin";
  prescriptions: UnifiedPrescription[];
  onView: (rx: UnifiedPrescription) => void;
  onEdit?: (rxId: string) => void;
  onPrint: (rx: UnifiedPrescription) => void;
  onDownload: (rxId: string) => void;
  onDuplicate?: (rxId: string) => void;
  onViewHistory?: (mrn: string) => void;
  onViewConsultation?: (consultId: string) => void;
}

export const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
  role,
  prescriptions,
  onView,
  onEdit,
  onPrint,
  onDownload,
  onDuplicate,
  onViewHistory,
  onViewConsultation,
}) => {
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(prescriptions.length / pageSize);
  const paginatedPrescriptions = prescriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

const formatDateTimeDisplay = (rawStr?: string) => {
  if (!rawStr || rawStr === "—") return "—";
  try {
    const d = new Date(rawStr);
    if (isNaN(d.getTime())) return rawStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return rawStr;
  }
};

  if (role === "patient") {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Prescription Records ({prescriptions.length})
          </h3>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto max-h-150 overflow-y-auto">
          <table
            className="w-full border-collapse text-left text-xs"
            style={{ fontFamily: RB }}
          >
            <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
              <tr
                className="text-[#64748B] font-bold"
                style={{ fontFamily: PP }}
              >
                <th className="p-3">Prescription ID</th>
                <th className="p-3">Encounter ID</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Doctor Name</th>
                <th className="p-3">Total Medicines</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[#111827]">
              {paginatedPrescriptions.map((rx) => {
                const displayRxId = rx.prescriptionId || rx.id;
                const displayEncId = rx.encounterId
                  ? `ENC-${rx.encounterId}`
                  : rx.encounterNumber || (rx.id ? `ENC-${rx.id}` : "—");
                const medCount =
                  rx.medicines && rx.medicines.length > 0
                    ? rx.medicines.length
                    : rx.totalMedicines || rx.medicineCount || 0;
                const formattedDate = formatDateTimeDisplay(rx.consultationDate || rx.date);

                return (
                  <tr
                    key={rx.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                      <button
                        onClick={() => onView(rx)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {displayRxId}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-medium text-slate-700">
                      {displayEncId}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {formattedDate}
                    </td>
                    <td
                      className="px-4 py-3.5 font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {rx.doctorName || "Attending Doctor"}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#009688]">
                      {medCount} Medicine{medCount !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3.5">
                      <PrescriptionStatusBadge status={rx.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onView(rx)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          style={{ fontFamily: PP }}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          aria-label="Print Prescription"
                          onClick={() => onPrint(rx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-gray-100">
          {paginatedPrescriptions.map((rx) => {
            const displayRxId = rx.prescriptionId || rx.id;
            const displayEncId = rx.encounterId
              ? `ENC-${rx.encounterId}`
              : rx.encounterNumber || (rx.id ? `ENC-${rx.id}` : "—");
            const medCount = rx.totalMedicines ?? rx.medicineCount ?? rx.medicines.length;
            const formattedDate = formatDateTimeDisplay(rx.consultationDate || rx.date);

            return (
              <div key={rx.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#0D47A1] text-sm block">
                      {displayRxId}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      {displayEncId}
                    </span>
                  </div>
                  <PrescriptionStatusBadge status={rx.status} />
                </div>
                <div className="space-y-1 text-xs" style={{ fontFamily: RB }}>
                  <div
                    className="font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {rx.doctorName || "Attending Doctor"} ({rx.department || "General OPD"})
                  </div>
                  <div className="text-slate-500">
                    Date: {formattedDate}
                  </div>
                  <div className="text-[#009688] font-semibold">
                    {medCount} Prescribed Medication{medCount !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onView(rx)}
                    className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    style={{ fontFamily: PP }}
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    onClick={() => onPrint(rx)}
                    className="px-3 py-1.5 bg-teal-50 text-[#009688] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={13} /> Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalCount={prescriptions.length}
        />
      </div>
    );
  }

  // Doctor or Admin View
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div>
          <h2
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Prescription Records
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: RB }}>
            Showing {prescriptions.length} prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400" style={{ fontFamily: RB }}>
            Strict Doctor Scoped View
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      <div className="overflow-x-auto max-h-150 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
            <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
              <th className="px-4 py-3.5">Prescription ID</th>
              <th className="px-4 py-3.5">Patient Name</th>
              <th className="px-4 py-3.5">MRN</th>
              <th className="px-4 py-3.5">Consultation ID</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Consultation Date</th>
              <th className="px-4 py-3.5">Medicines</th>
              <th className="px-4 py-3.5">Follow-up</th>
              <th className="px-4 py-3.5">Status</th>
              {role !== "admin" && <th className="px-4 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody
            className="divide-y divide-gray-100 text-[#111827]"
            style={{ fontFamily: RB }}
          >
            {prescriptions.map((rx) => (
              <tr
                key={rx.id}
                onClick={() => onView(rx)}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <td className="px-4 py-3.5 font-mono font-semibold text-[#0D47A1] whitespace-nowrap">
                  {rx.id}
                </td>
                <td className="px-4 py-3.5 font-semibold text-[#111827] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Avatar name={rx.patientName || "Patient"} />
                    <span>{rx.patientName || "Patient"}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                  {rx.mrn || "—"}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                  {rx.consultationId ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewConsultation?.(rx.consultationId);
                      }}
                      className="hover:underline hover:text-[#0D47A1]"
                    >
                      {rx.consultationId}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                  {rx.department}
                </td>
                <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                  {rx.consultationDate}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                    <Pill size={12} className="text-[#009688]" />
                    {rx.medicineCount} Medicines
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {rx.followup ? (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Yes ({rx.followupDate})
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <PrescriptionStatusBadge status={rx.status} />
                </td>
                {role !== "admin" && (
                  <td
                    className="px-4 py-3.5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(rx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                        title="View Full Prescription"
                      >
                        <Eye size={14} />
                      </button>
                      {rx.status === "Draft" ? (
                        <button
                          onClick={() => onEdit?.(rx.id)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Draft Prescription"
                        >
                          <Edit3 size={14} />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="p-1.5 text-slate-300 cursor-not-allowed"
                          title="Only Draft prescriptions can be edited"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => onPrint(rx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Print Prescription"
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        onClick={() => onDownload(rx.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </button>
                      <div className="relative">
                        <button
                          aria-label="Action"
                          onClick={() =>
                            setOpenMoreMenuId(
                              openMoreMenuId === rx.id ? null : rx.id,
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <ChevronDown size={14} />
                        </button>
                        {openMoreMenuId === rx.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 text-left">
                            <button
                              onClick={() => {
                                setOpenMoreMenuId(null);
                                onDuplicate?.(rx.id);
                              }}
                              className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                              <Plus size={13} /> Duplicate Prescription
                            </button>
                            <button
                              onClick={() => {
                                setOpenMoreMenuId(null);
                                onViewHistory?.(rx.mrn);
                              }}
                              className="w-full px-3 py-2 text-xs text-[#0D47A1] hover:bg-blue-50 flex items-center gap-2 font-medium"
                            >
                              <Clock size={13} /> Prescription History
                            </button>
                            {rx.consultationId && (
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null);
                                  onViewConsultation?.(rx.consultationId);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <FileText size={13} /> View Consultation
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
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
        totalCount={prescriptions.length}
      />
    </div>
  );
};

export default PrescriptionTable;
