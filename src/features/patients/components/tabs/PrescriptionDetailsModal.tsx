import { useQuery } from "@tanstack/react-query";
import {
  X,
  Printer,
  Pill,
  Calendar,
  AlertTriangle,
  User,
  Building2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { PP, RB } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";
import { prescriptionApi } from "../../../prescriptions/api/prescription.api";
import type { Patient, ApiPatientPrescription } from "../../types/patient.types";
import type { PrescriptionDetailResponse } from "../../../prescriptions/api/prescription.api";

interface PrescriptionDetailsModalProps {
  prescriptionId: string | number | null;
  initialData?: ApiPatientPrescription | null;
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Robust formatter to ensure no raw nested objects (e.g. {value, unit}, {code, display})
 * are ever passed directly to JSX as React children.
 */
function formatField(val: unknown, fallback: string = "—"): string {
  if (val == null) return fallback;
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    const s = String(val).trim();
    return s || fallback;
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("display" in obj && obj.display != null) return String(obj.display).trim();
    if ("value" in obj && obj.value != null) {
      const v = String(obj.value).trim();
      const u = obj.unit ? ` ${String(obj.unit).trim()}` : "";
      return `${v}${u}`.trim() || fallback;
    }
    if ("name" in obj && obj.name != null) return String(obj.name).trim();
    if ("text" in obj && obj.text != null) return String(obj.text).trim();
    if ("code" in obj && obj.code != null) return String(obj.code).trim();
    if ("followUpDate" in obj && obj.followUpDate != null) return String(obj.followUpDate).trim();
    if (Array.isArray(val)) {
      return (
        val
          .map((item) => formatField(item, ""))
          .filter(Boolean)
          .join(", ") || fallback
      );
    }
  }
  return fallback;
}

export function PrescriptionDetailsModal({
  prescriptionId,
  initialData,
  patient,
  isOpen,
  onClose,
}: PrescriptionDetailsModalProps) {
  const { data: details, isLoading } = useQuery({
    queryKey: ["prescription", "details", prescriptionId],
    queryFn: async () => {
      if (!prescriptionId) return null;
      try {
        const full = await prescriptionApi.getPrescriptionDetails(prescriptionId);
        if (full) return full;
      } catch {
        // continue
      }
      try {
        const fallback = await patientsApi.getPrescriptionById(String(prescriptionId));
        if (fallback) {
          return {
            prescriptionId: fallback.id,
            doctorName: fallback.doctorName,
            department: fallback.department,
            status: fallback.status,
            createdAt: fallback.date,
            medicines: fallback.medicines,
            followUp: fallback.followUpDate
              ? { followUpDate: fallback.followUpDate }
              : undefined,
          } as PrescriptionDetailResponse;
        }
      } catch {
        // continue
      }
      return null;
    },
    enabled: Boolean(isOpen && prescriptionId),
  });

  if (!isOpen || !prescriptionId) return null;

  const handlePrint = () => {
    window.print();
  };

  // Safe formatting for header & metadata
  const idStr = formatField(
    details?.prescriptionNumber ||
      details?.prescriptionId ||
      initialData?.id ||
      prescriptionId,
    "Prescription",
  );
  const doctorName = formatField(
    details?.doctorName || initialData?.doctorName,
    "Attending Physician",
  );
  const department = formatField(
    details?.department || initialData?.department,
    "General Medicine",
  );
  const dateStr = formatField(
    details?.finalizedAt ||
      details?.createdAt ||
      initialData?.date,
    new Date().toISOString().split("T")[0],
  );
  const status = formatField(details?.status || initialData?.status, "Issued");
  const medicines = details?.medicines || initialData?.medicines || [];
  const diagnosis = formatField(initialData?.diagnosis || details?.outcome, "");
  const followUpDate = formatField(
    details?.followUp?.followUpDate || details?.followUp || initialData?.followUpDate,
    "",
  );
  const advice = details?.advice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Pill size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Prescription Details
              </span>
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {idStr}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                status === "Issued" || status === "FINALIZED" || status === "Completed"
                  ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {status}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="animate-spin text-[#0D47A1]" size={24} />
              <span className="text-xs">Loading prescription details...</span>
            </div>
          ) : (
            <>
              {/* Patient & Doctor Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#111827]">
                    <User size={13} className="text-[#0D47A1]" />
                    <span>{patient.fullName || patient.name || "Patient"}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    MRN: {patient.mrn} · {patient.age ?? 0} Y / {patient.gender || "Unknown"}
                  </div>
                  {patient.phone && (
                    <div className="text-[11px] text-slate-500">
                      Phone: {patient.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:text-right">
                  <div className="flex items-center gap-1.5 font-bold text-[#111827] sm:justify-end">
                    <Building2 size={13} className="text-[#009688]" />
                    <span>{doctorName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {department}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 sm:justify-end">
                    <Calendar size={11} />
                    <span>Date: {dateStr}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis if available */}
              {diagnosis && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                  <span className="text-[10px] font-bold text-[#0D47A1] uppercase tracking-wider block mb-1">
                    Diagnosis / Clinical Notes
                  </span>
                  <div className="text-slate-700 font-medium">{diagnosis}</div>
                </div>
              )}

              {/* Medications Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Pill size={14} className="text-purple-600" /> Prescribed Medications (
                    {medicines.length})
                  </h4>
                </div>

                {medicines.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl text-xs text-slate-400">
                    No individual medications listed for this prescription.
                  </div>
                ) : (
                  <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-[#E5E7EB]">
                        <tr>
                          <th className="py-2.5 px-3">Medicine</th>
                          <th className="py-2.5 px-3">Dosage</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {medicines.map((m, idx) => {
                          const medName = formatField(
                            m.medicineName || m.name,
                            `Medication #${idx + 1}`,
                          );
                          const strengthStr = formatField(m.strength, "");
                          const strength = strengthStr ? ` (${strengthStr})` : "";
                          const dose = formatField(m.dosage || m.dose, "—");
                          const freq = formatField(m.frequency, "—");
                          const dur = formatField(m.duration, "—");
                          const inst = formatField(m.instructions, "As directed");

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-semibold text-[#111827]">
                                {medName}
                                {strength && (
                                  <span className="text-slate-400 font-normal">
                                    {strength}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 font-medium">
                                {dose}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 font-medium">
                                {freq}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 font-medium">
                                {dur}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                                {inst}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Advice & Instructions */}
              {advice &&
                (advice.general || advice.diet || advice.precautions) && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                      <AlertTriangle size={13} />
                      <span>Doctor&apos;s Advice &amp; Precautions</span>
                    </div>
                    {advice.general && (
                      <div className="text-amber-900">
                        <span className="font-semibold">General:</span>{" "}
                        {formatField(advice.general, "")}
                      </div>
                    )}
                    {advice.diet && (
                      <div className="text-amber-900">
                        <span className="font-semibold">Diet:</span>{" "}
                        {formatField(advice.diet, "")}
                      </div>
                    )}
                    {advice.precautions && (
                      <div className="text-amber-900">
                        <span className="font-semibold">Precautions:</span>{" "}
                        {formatField(advice.precautions, "")}
                      </div>
                    )}
                  </div>
                )}

              {/* Follow-up Note */}
              {followUpDate && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <CheckCircle2 size={15} className="text-[#009688]" />
                  <span>
                    <strong className="text-[#111827]">Scheduled Follow-up:</strong>{" "}
                    {followUpDate}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Printer size={14} />
            <span>Print Prescription</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0b3c88] transition-colors shadow-xs"
            style={{ fontFamily: PP }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
