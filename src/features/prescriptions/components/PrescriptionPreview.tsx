import React from "react";
import { X, Eye, Download, Printer, Pill } from "lucide-react";
import type { UnifiedPrescription } from "../types/prescription.types";
import { PrescriptionStatusBadge } from "./PrescriptionStatusBadge";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface DrawerProps {
  prescription: UnifiedPrescription;
  onClose: () => void;
  onViewFull: () => void;
  onPrint: () => void;
  onDownload: () => void;
  role: "patient" | "doctor" | "admin";
}

export const PrescriptionDrawer: React.FC<DrawerProps> = ({
  prescription,
  onClose,
  onViewFull,
  onPrint,
  onDownload,
  role,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Prescription Quick Preview
              </h3>
              <PrescriptionStatusBadge status={prescription.status} />
            </div>
            <span className="font-mono text-xs font-bold text-[#0D47A1]">
              {prescription.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content */}
        <div
          className="p-5 overflow-y-auto space-y-5 flex-1 text-xs"
          style={{ fontFamily: RB }}
        >
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-2">
            {prescription.patientName && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Patient Name
                </span>
                <span
                  className="text-xs font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {prescription.patientName}
                </span>
              </div>
            )}
            {prescription.mrn && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">MRN</span>
                <span className="text-xs font-mono font-semibold text-[#0D47A1]">
                  {prescription.mrn}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Attending Doctor
              </span>
              <span className="text-xs font-semibold text-slate-850">
                {prescription.doctorName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Department
              </span>
              <span className="text-xs text-slate-700">
                {prescription.department}
              </span>
            </div>
            {prescription.consultationDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Date</span>
                <span className="text-xs text-slate-700">
                  {prescription.consultationDate}
                </span>
              </div>
            )}
          </div>

          <div>
            <div
              className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2"
              style={{ fontFamily: PP }}
            >
              Clinical Diagnosis
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-800 font-medium">
              {prescription.diagnosis || "No diagnosis details recorded."}
            </div>
          </div>

          <div>
            <div
              className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2"
              style={{ fontFamily: PP }}
            >
              Prescribed Medicines ({prescription.medicineCount})
            </div>
            <div className="space-y-2">
              {prescription.medicines.map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-xl border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <div
                      className="font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {m.name}{" "}
                      {m.strength && (
                        <span className="font-normal text-slate-500">
                          ({m.strength})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {m.frequency} • {m.duration}
                    </div>
                  </div>
                  <Pill size={14} className="text-[#009688]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
              <div
                className="text-[10px] font-bold text-slate-400 uppercase"
                style={{ fontFamily: PP }}
              >
                Follow-up Date
              </div>
              <div className="text-xs font-bold text-[#111827] mt-0.5">
                {prescription.followupDate || "Not required"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
              <div
                className="text-[10px] font-bold text-slate-400 uppercase"
                style={{ fontFamily: PP }}
              >
                Prescription Status
              </div>
              <div className="mt-1">
                <PrescriptionStatusBadge status={prescription.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center gap-2">
          {role === "patient" ? (
            <>
              <button
                onClick={onViewFull}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Eye size={14} /> View Full
              </button>
              <button
                onClick={onDownload}
                className="px-3.5 py-2 rounded-xl border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={14} /> PDF
              </button>
              <button
                onClick={onPrint}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} /> Print
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onViewFull}
                className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                View Full Prescription
              </button>
              <button
                onClick={onPrint}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                <Printer size={14} />
              </button>
              <button
                onClick={onDownload}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                <Download size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface DetailsModalProps {
  prescription: UnifiedPrescription;
  onClose: () => void;
  onDownload: () => void;
}

export const PrescriptionDetailsModal: React.FC<DetailsModalProps> = ({
  prescription,
  onClose,
  onDownload,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <h3
              className="text-lg font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Full Prescription Details
            </h3>
            <PrescriptionStatusBadge status={prescription.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="p-5 bg-slate-50 rounded-xl border border-gray-200 space-y-4 text-xs"
          style={{ fontFamily: RB }}
        >
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div>
              <span
                className="text-[10px] font-bold text-slate-400 uppercase block"
                style={{ fontFamily: PP }}
              >
                Hospital
              </span>
              <span className="font-bold text-[#0D47A1] text-sm">
                HMS Hospital &amp; Medical Research Center
              </span>
            </div>
            <div className="text-right">
              <span
                className="text-[10px] font-bold text-slate-400 uppercase block"
                style={{ fontFamily: PP }}
              >
                Prescription ID
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {prescription.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span
                className="text-[10px] font-bold text-slate-400 uppercase block"
                style={{ fontFamily: PP }}
              >
                Attending Doctor
              </span>
              <span className="font-bold text-[#111827]">
                {prescription.doctorName}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {prescription.department}
              </span>
            </div>
            {prescription.consultationId && (
              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase block"
                  style={{ fontFamily: PP }}
                >
                  Consultation ID
                </span>
                <span className="font-mono font-medium text-slate-700">
                  {prescription.consultationId}
                </span>
              </div>
            )}
            <div>
              <span
                className="text-[10px] font-bold text-slate-400 uppercase block"
                style={{ fontFamily: PP }}
              >
                Date
              </span>
              <span className="font-medium text-slate-700">
                {prescription.consultationDate}
              </span>
            </div>
          </div>

          <div>
            <span
              className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
              style={{ fontFamily: PP }}
            >
              Clinical Diagnosis
            </span>
            <p className="p-2.5 bg-white rounded-lg border border-gray-200 text-slate-800 font-medium">
              {prescription.diagnosis || "No diagnosis details recorded."}
            </p>
          </div>

          <div>
            <span
              className="text-[10px] font-bold text-[#009688] uppercase block mb-2"
              style={{ fontFamily: PP }}
            >
              Prescribed Medications ({prescription.medicines.length})
            </span>
            <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-gray-200">
              <thead>
                <tr
                  className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-gray-200"
                  style={{ fontFamily: PP }}
                >
                  <th className="p-2">Medicine</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Dosage</th>
                  <th className="p-2">Frequency</th>
                  <th className="p-2">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prescription.medicines.map((m) => (
                  <tr key={m.name}>
                    <td className="p-2 font-bold text-[#111827]">
                      {m.name} {m.strength && <span>{m.strength}</span>}
                    </td>
                    <td className="p-2 text-slate-600">{m.route || "ORAL"}</td>
                    <td className="p-2 text-slate-700">{m.dosage}</td>
                    <td className="p-2 font-semibold text-[#0D47A1]">
                      {m.frequency}
                    </td>
                    <td className="p-2 text-slate-600">{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
            <span
              className="text-[10px] font-bold text-amber-800 uppercase"
              style={{ fontFamily: PP }}
            >
              Next Follow-up Review
            </span>
            <span className="font-bold text-amber-900">
              {prescription.followupDate || "Not required"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-slate-700 hover:bg-slate-50"
            style={{ fontFamily: PP }}
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
            style={{ fontFamily: PP }}
          >
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

interface PrintModalProps {
  prescription: UnifiedPrescription;
  onClose: () => void;
  onPrint: () => void;
}

export const PrescriptionPrintModal: React.FC<PrintModalProps> = ({
  prescription,
  onClose,
  onPrint,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-[#0D47A1]" />
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Print Prescription Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3"
          style={{ fontFamily: RB }}
        >
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-bold text-[#0D47A1]">
              HMS Hospital & Research Center
            </span>
            <span className="font-mono text-slate-500">{prescription.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {prescription.patientName && (
              <div>
                <strong>Patient:</strong> {prescription.patientName}
              </div>
            )}
            {prescription.mrn && (
              <div>
                <strong>MRN:</strong> {prescription.mrn}
              </div>
            )}
            <div>
              <strong>Doctor:</strong> {prescription.doctorName}
            </div>
            <div>
              <strong>Date:</strong> {prescription.consultationDate}
            </div>
          </div>
          <div>
            <strong>Diagnosis:</strong>{" "}
            {prescription.diagnosis || "No diagnosis details recorded."}
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="font-bold mb-1">Medicines Rx:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              {prescription.medicines.map((m) => (
                <li key={m.name}>
                  {m.name} {m.strength && `(${m.strength})`} — {m.dosage} •{" "}
                  {m.frequency} ({m.duration})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            style={{ fontFamily: RB }}
          >
            Cancel
          </button>
          <button
            onClick={onPrint}
            className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
            style={{ fontFamily: PP }}
          >
            Print Document
          </button>
        </div>
      </div>
    </div>
  );
};
