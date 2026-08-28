import { useState, useEffect } from "react";
import { Search, Eye, Printer, RotateCcw } from "lucide-react";
import type {
  Patient,
  ApiPatientPrescription,
} from "../../types/patient.types";
import { PP, RB } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";
import { PrescriptionDetailsModal } from "./PrescriptionDetailsModal";

export interface PrescriptionsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

function formatIssueDate(rawDate?: string): string {
  if (!rawDate || rawDate === "—") return "—";
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return rawDate;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return rawDate;
  }
}

function getDisplayPrescriptionId(rx: ApiPatientPrescription): string {
  if (rx.prescriptionId && rx.prescriptionId.trim())
    return rx.prescriptionId.trim();
  const idStr = String(rx.id || "").trim();
  if (idStr.startsWith("RX-")) return idStr;
  if (/^\d{8}-\d{4}$/.test(idStr)) return `RX-${idStr}`;
  return idStr ? `RX-${idStr}` : "RX-20260826-0000";
}

function getDisplayEncounterId(
  rx: ApiPatientPrescription,
  displayRxId: string,
): string {
  const obj = rx as unknown as Record<string, unknown>;
  if (obj.encounterId && String(obj.encounterId).trim()) {
    const enc = String(obj.encounterId).trim();
    return enc.startsWith("ENC-") ? enc : `ENC-${enc}`;
  }
  if (obj.encounterNumber && String(obj.encounterNumber).trim()) {
    const enc = String(obj.encounterNumber).trim();
    return enc.startsWith("ENC-") ? enc : `ENC-${enc}`;
  }
  return `ENC-${displayRxId}`;
}

function getMedicineCount(rx: ApiPatientPrescription): number {
  const obj = rx as unknown as Record<string, unknown>;
  if (Array.isArray(rx.medicines) && rx.medicines.length > 0) {
    return rx.medicines.length;
  }
  if (
    Array.isArray(obj.medications) &&
    (obj.medications as unknown[]).length > 0
  ) {
    return (obj.medications as unknown[]).length;
  }
  if (Array.isArray(obj.items) && (obj.items as unknown[]).length > 0) {
    return (obj.items as unknown[]).length;
  }
  if (typeof rx.medicineCount === "number" && rx.medicineCount > 0) {
    return rx.medicineCount;
  }
  if (
    typeof obj.totalMedicines === "number" &&
    (obj.totalMedicines as number) > 0
  ) {
    return obj.totalMedicines as number;
  }
  if (
    typeof obj.medicationCount === "number" &&
    (obj.medicationCount as number) > 0
  ) {
    return obj.medicationCount as number;
  }
  return typeof rx.medicineCount === "number" ? rx.medicineCount : 0;
}

function renderStatusBadge(status?: string) {
  const s = (status || "FINALIZED").toUpperCase().trim();
  let badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-200";
  let displayLabel = status || "Completed";

  if (s === "DRAFT" || s === "PENDING") {
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
    displayLabel = s === "DRAFT" ? "Draft" : "Pending";
  } else if (s === "CANCELLED" || s === "ARCHIVED") {
    badgeStyle = "bg-red-50 text-red-600 border-red-200";
    displayLabel = s === "CANCELLED" ? "Cancelled" : "Archived";
  } else if (
    s === "COMPLETED" ||
    s === "FINALIZED" ||
    s === "ISSUED" ||
    s === "ACTIVE"
  ) {
    badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-200";
    displayLabel =
      s === "COMPLETED"
        ? "Completed"
        : s === "FINALIZED"
          ? "Finalized"
          : "Issued";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
}

export function PatientPrescriptionsTab({
  patient,
  isOwnProfile,
}: PrescriptionsTabProps) {
  const [prescriptions, setPrescriptions] = useState<ApiPatientPrescription[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [prevMrn, setPrevMrn] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<ApiPatientPrescription | null>(null);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (patient.mrn !== prevMrn) {
    setPrevMrn(patient.mrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getPrescriptions(patient.mrn)
      .then((data) => {
        if (!cancelled) setPrescriptions(data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];

  const filtered = safePrescriptions.filter((rx) => {
    if (
      isOwnProfile &&
      (rx.status === "Cancelled" || rx.status === "Archived")
    ) {
      return false;
    }
    if (statusFilter !== "ALL") {
      const rxStatus = (rx.status || "FINALIZED").toUpperCase();
      if (rxStatus !== statusFilter) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const rxId = getDisplayPrescriptionId(rx).toLowerCase();
      const encId = getDisplayEncounterId(rx, rxId).toLowerCase();
      const docName = (rx.doctorName || "").toLowerCase();
      const dept = (rx.department || "").toLowerCase();
      return (
        rxId.includes(term) ||
        encId.includes(term) ||
        docName.includes(term) ||
        dept.includes(term)
      );
    }
    return true;
  });

  const isFilterActive = searchTerm.trim() !== "" || statusFilter !== "ALL";

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading prescriptions...
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: RB }}>
      {/* Top Filter Bar (As seen in Image 2) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by Prescription ID, Doctor, Department, Diagnosis or Medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#0D47A1] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="FINALIZED">Finalized</option>
              <option value="ISSUED">Issued</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
            </select>

            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-[#0D47A1] hover:underline px-2 py-1 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Use the search box or status filter to find specific prescriptions.
        </div>
      </div>

      {/* Main Table Card (Exact design matching Image 2) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Prescription Records ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#64748B]">
            No prescription records found matching your filters.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr
                    className="bg-slate-50/80 border-b border-[#E5E7EB] text-[#64748B] font-bold"
                    style={{ fontFamily: PP }}
                  >
                    <th className="px-4 py-3.5">Prescription ID</th>
                    <th className="px-4 py-3.5">Encounter ID</th>
                    <th className="px-4 py-3.5">Issue Date</th>
                    <th className="px-4 py-3.5">Doctor Name</th>
                    <th className="px-4 py-3.5">Total Medicines</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filtered.map((rx) => {
                    const displayRxId = getDisplayPrescriptionId(rx);
                    const displayEncId = getDisplayEncounterId(rx, displayRxId);
                    const formattedDate = formatIssueDate(rx.date);
                    const medCount = getMedicineCount(rx);
                    const doctorName = rx.doctorName || "Doctor";

                    return (
                      <tr
                        key={rx.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                          <button
                            type="button"
                            onClick={() => setSelectedPrescription(rx)}
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
                          {doctorName}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#009688]">
                          {medCount} Medicine{medCount !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-3.5">
                          {renderStatusBadge(rx.status)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedPrescription(rx)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              style={{ fontFamily: PP }}
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              aria-label="Print Prescription"
                              onClick={() => {
                                setSelectedPrescription(rx);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Print Prescription"
                            >
                              <Printer size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filtered.map((rx) => {
                const displayRxId = getDisplayPrescriptionId(rx);
                const displayEncId = getDisplayEncounterId(rx, displayRxId);
                const formattedDate = formatIssueDate(rx.date);
                const medCount = getMedicineCount(rx);
                const doctorName = rx.doctorName || "Doctor";

                return (
                  <div key={rx.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#0D47A1] text-sm block">
                          {displayRxId}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 block">
                          {displayEncId}
                        </span>
                      </div>
                      {renderStatusBadge(rx.status)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div
                        className="font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {doctorName}
                      </div>
                      <div className="text-slate-500">
                        Issue Date: {formattedDate}
                      </div>
                      <div className="text-[#009688] font-semibold">
                        {medCount} Medicine{medCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setSelectedPrescription(rx)}
                        className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                        style={{ fontFamily: PP }}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPrescription(rx);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Print"
                      >
                        <Printer size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Prescription Detail & Print Modal */}
      <PrescriptionDetailsModal
        prescriptionId={selectedPrescription?.id ?? null}
        initialData={selectedPrescription}
        patient={patient}
        isOpen={Boolean(selectedPrescription)}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}
