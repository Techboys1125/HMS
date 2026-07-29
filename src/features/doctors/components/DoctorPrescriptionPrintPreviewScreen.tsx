import { useState } from "react";
import {
  Printer,
  Download,
  CheckCircle2,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  FileText,
} from "lucide-react";
import type { PrescriptionRecord } from "../types/doctors.types";
import { MY_PRESCRIPTIONS_DATA, PP, RB } from "../constants/doctors.constants";

const PRESCRIPTION_HEADER = {
  hospitalName: "Safe Hands Multi-Specialty Hospital",
  address: "42, Healthcare Boulevard, City General, Metro — 500081",
  phone: "+1 (555) 234-5678",
  email: "info@safehands.org",
};

export interface DoctorPrescriptionPrintPreviewScreenProps {
  prescription?: PrescriptionRecord;
  prescriptionId?: string;
  onBack?: () => void;
  onPrint?: () => void;
  onViewConsultation?: (consultId: any) => void;
}

export function DoctorPrescriptionPrintPreviewScreen({
  prescription,
  onBack,
  onPrint,
}: DoctorPrescriptionPrintPreviewScreenProps) {
  const rx = prescription || MY_PRESCRIPTIONS_DATA[0];

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  if (!rx) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <FileText size={48} className="text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500 font-medium">
            No prescription selected.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-4 print:!p-2 print:!space-y-2">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 text-slate-400 hover:text-[#0D47A1] rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Prescription Print Preview
              </h1>
              <p className="text-xs text-[#64748B]">
                Review and print prescription for patient records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} /> Print Prescription
            </button>
            <button className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden print:!rounded-none print:!border-0 print:!shadow-none">
          <div className="p-8 space-y-6 print:p-4">
            <div className="text-center border-b border-gray-200 pb-5 mb-2">
              <h2
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {PRESCRIPTION_HEADER.hospitalName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {PRESCRIPTION_HEADER.address}
              </p>
              <p className="text-xs text-slate-500">
                {PRESCRIPTION_HEADER.phone} | {PRESCRIPTION_HEADER.email}
              </p>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#111827]">
                  Prescription ID:{" "}
                  <span className="font-mono text-[#0D47A1]">{rx.id}</span>
                </p>
                <p className="font-bold text-[#111827]">
                  Patient Name:{" "}
                  <span className="font-medium text-slate-700">
                    {rx.patientName}
                  </span>
                </p>
                <p className="font-bold text-[#111827]">
                  MRN:{" "}
                  <span className="font-mono text-slate-600">{rx.mrn}</span>
                </p>
              </div>
              <div className="space-y-1 text-xs text-right">
                <p className="font-bold text-[#111827]">
                  Date:{" "}
                  <span className="font-medium text-slate-700">
                    {rx.consultationDate}
                  </span>
                </p>
                <p className="font-bold text-[#111827]">
                  Doctor:{" "}
                  <span className="font-medium text-slate-700">
                    {rx.doctorName}
                  </span>
                </p>
                <p className="font-bold text-[#111827]">
                  Department:{" "}
                  <span className="font-medium text-[#0D47A1]">
                    {rx.department}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-[#111827]">
                Diagnosis / Clinical Impression
              </p>
              <p className="text-slate-700">{rx.diagnosis}</p>
            </div>

            <div>
              <h3
                className="text-sm font-bold text-[#111827] mb-3 border-b border-gray-200 pb-2"
                style={{ fontFamily: PP }}
              >
                Prescribed Medicines
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[#64748B] font-bold">
                    <th className="px-3 py-2.5 border border-slate-200">#</th>
                    <th className="px-3 py-2.5 border border-slate-200">
                      Medicine Name
                    </th>
                    <th className="px-3 py-2.5 border border-slate-200">
                      Dose
                    </th>
                    <th className="px-3 py-2.5 border border-slate-200">
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rx.medicinesList.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 border border-slate-200 font-mono text-[#0D47A1]">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 border border-slate-200 font-semibold text-[#111827]">
                        {m.name}
                      </td>
                      <td className="px-3 py-2 border border-slate-200">
                        {m.dose}
                      </td>
                      <td className="px-3 py-2 border border-slate-200">
                        {m.freq}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rx.followup && (
              <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#009688]" />
                <span className="font-medium text-slate-700">
                  Follow-up scheduled:{" "}
                  <span className="font-bold text-[#009688]">
                    {rx.followupDate}
                  </span>
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 flex items-start justify-between text-[10px] text-slate-400">
              <div>
                <p>Doctor Signature: ___________________</p>
                <p className="mt-1">{rx.doctorName}</p>
              </div>
              <div className="text-right">
                <p>Pharmacy Stamp: ___________________</p>
                <p className="mt-1">Dispensing Date: ___/___/______</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 print:hidden">
          <p>
            This is a computer-generated prescription. Digital signature is
            valid per HMS policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export interface DoctorPrescriptionHistoryScreenProps {
  patientMrn?: string;
  onBack?: () => void;
  onViewPrescription?: (rx: any) => void;
  onPrintPreview?: (rx: any) => void;
  onViewPatientProfile?: (uhid: string) => void;
}

export function DoctorPrescriptionHistoryScreen({
  onBack,
  onViewPrescription,
}: DoctorPrescriptionHistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MY_PRESCRIPTIONS_DATA.filter((rx) => {
    const matchesSearch =
      !searchTerm ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-slate-400 hover:text-[#0D47A1] rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1
              className="text-lg font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Prescription History
            </h1>
            <p className="text-xs text-[#64748B]">
              View all past prescriptions issued across consultations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Patient, MRN..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl text-xs">
          <Filter size={13} className="text-slate-400" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Draft">Draft</option>
            <option value="Issued">Issued</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 border-b border-[#E5E7EB]">
              <tr
                className="text-[#64748B] font-bold"
                style={{ fontFamily: PP }}
              >
                <th className="px-4 py-3">Rx ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">MRN</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    <p
                      className="font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      No prescriptions found.
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((rx) => (
                  <tr
                    key={rx.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                      {rx.id}
                    </td>
                    <td
                      className="px-4 py-3 font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {rx.patientName}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {rx.mrn}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {rx.consultationDate}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {rx.doctorName}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {rx.medicineCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rx.status === "Draft" ? "bg-amber-50 text-amber-700 border-amber-200" : rx.status === "Issued" ? "bg-blue-50 text-[#0D47A1] border-blue-200" : rx.status === "Completed" ? "bg-emerald-50 text-[#66BB6A] border-emerald-200" : rx.status === "Cancelled" ? "bg-red-50 text-[#EF4444] border-red-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewPrescription?.(rx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                        title="View Prescription"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
