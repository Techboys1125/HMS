import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Edit3,
  Printer,
  Download,
  User,
  AlertTriangle,
  Clock,
  Pill,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import type { RxStatus } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { Card } from "./Card";
import { Avatar } from "./Avatar";

export function DoctorPrescriptionDetailsScreen({
  prescriptionId = "RX-2026-0891",
  onBack,
  onEditPrescription,
  onPrintPreview,
  onViewHistory,
  onViewConsultation,
  onViewPatientProfile,
}: {
  prescriptionId?: string;
  onBack?: () => void;
  onEditPrescription?: (rxId: string) => void;
  onPrintPreview?: (rxId: string) => void;
  onViewHistory?: (mrn: string) => void;
  onViewConsultation?: (consultId: string) => void;
  onViewPatientProfile?: (mrn: string) => void;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const rxRecord = {
    id: prescriptionId,
    consultationId: "CNS-1001",
    patientName: "Sarah Mitchell",
    mrn: "MRN-892101",
    age: 34,
    gender: "Female",
    bloodGroup: "A+",
    photo: "",
    consultationDate: "24 Jul 2026",
    issuedDate: "24 Jul 2026, 09:42 AM",
    status: "Issued" as RxStatus,
    doctorName: "Dr. Arjun Mehta",
    doctorSpecialty: "Interventional Cardiology",
    department: "Cardiology",
    mobileNumber: "+1 (555) 234-5678",
    visitDate: "24 Jul 2026",
    allergies: ["Penicillin", "Aspirin"],
    knownConditions: ["Hypertension", "Borderline Type 2 Diabetes"],
    chiefComplaint:
      "Severe chest tightness radiating to left shoulder with acute dyspnea on exertion.",
    clinicalFindings:
      "Chest wall non-tender. S1 and S2 heart sounds heard normal. No murmurs or gallop rhythm. BP 145/92 mmHg, HR 88 bpm.",
    finalDiagnosis: "Angina Pectoris, unspecified",
    icdCode: "I20.9 — Angina Pectoris, unspecified",
    consultationNotes:
      "Patient presented with acute exertional chest discomfort. Electrocardiogram (ECG) performed in clinic. High cardiovascular risk profile noted.",
    medicines: [
      {
        id: "1",
        name: "Amlodipine",
        strength: "5mg",
        route: "Oral",
        dosage: "1 Tablet",
        frequency: "Once Daily (OD)",
        duration: "30 Days",
        quantity: "30 Tabs",
        instructions: "Take after breakfast with full glass of water",
      },
      {
        id: "2",
        name: "Metformin",
        strength: "500mg",
        route: "Oral",
        dosage: "1 Tablet",
        frequency: "Twice Daily (BD)",
        duration: "30 Days",
        quantity: "60 Tabs",
        instructions: "Take immediately with morning & evening meals",
      },
      {
        id: "3",
        name: "Atorvastatin",
        strength: "20mg",
        route: "Oral",
        dosage: "1 Tablet",
        frequency: "Once Nightly (HS)",
        duration: "30 Days",
        quantity: "30 Tabs",
        instructions: "Take before sleeping",
      },
      {
        id: "4",
        name: "Aspirin",
        strength: "75mg",
        route: "Oral",
        dosage: "1 Tablet",
        frequency: "Once Daily (OD)",
        duration: "30 Days",
        quantity: "30 Tabs",
        instructions: "Take after lunch",
      },
    ],
    dietAdvice:
      "Strict low-sodium (< 2g/day), low saturated fat diet. Increase fiber intake and fresh vegetables.",
    lifestyleAdvice:
      "Smoking cessation strictly advised. Avoid stress and maintain regular sleep hygiene (7-8 hours).",
    exerciseAdvice:
      "Daily light 20-30 min walking after 1 week. Avoid strenuous physical weight lifting until follow-up.",
    specialInstructions:
      "If chest pain recurs or intensifies, use sublingual GTN spray immediately and report to ER.",
    followupRequired: "Yes",
    nextVisitDate: "31 Jul 2026",
    followupNotes:
      "Review ECG & Troponin-I laboratory reports. Re-evaluate blood pressure control and adjust anti-hypertensive dosage if needed.",
  };

  const renderStatusChip = (status: RxStatus) => {
    switch (status) {
      case "Draft":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Draft
          </span>
        );
      case "Issued":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" /> Issued
          </span>
        );
      case "Completed":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Cancelled
          </span>
        );
      case "Archived":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Archived
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20">
      {toastMsg && (
        <div
          className="fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce"
          style={{ fontFamily: RB }}
        >
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
              style={{ fontFamily: RB }}
            >
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">
                Prescription Details
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Prescription Details
              </h1>
              {renderStatusChip(rxRecord.status)}
            </div>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Review issued prescription and treatment recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}
            {rxRecord.status === "Draft" ? (
              <button
                onClick={() => onEditPrescription?.(rxRecord.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Edit3 size={14} /> Edit Prescription
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200"
                style={{ fontFamily: PP }}
                title="Only Draft prescriptions can be edited"
              >
                <Edit3 size={14} /> Edit Prescription
              </button>
            )}
            <button
              onClick={() => {
                if (onPrintPreview) {
                  onPrintPreview(rxRecord.id);
                } else {
                  setPrintModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} /> Print Prescription
            </button>
            <button
              onClick={() => showToast(`Downloaded PDF for ${rxRecord.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Avatar name={rxRecord.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {rxRecord.patientName}
                </span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                  {rxRecord.mrn}
                </span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">
                  {rxRecord.id}
                </span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {rxRecord.consultationId}
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                <span>
                  {rxRecord.age} yrs / {rxRecord.gender}
                </span>
                <span>•</span>
                <span>
                  Blood Group:{" "}
                  <strong className="text-[#111827]">
                    {rxRecord.bloodGroup}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Consultation Date:{" "}
                  <strong className="text-[#111827]">
                    {rxRecord.consultationDate}
                  </strong>
                </span>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0"
              style={{ fontFamily: PP }}
            >
              <AlertTriangle size={13} />
              <span>Allergies: {rxRecord.allergies.join(", ")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewPatientProfile?.(rxRecord.mrn)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              Patient Profile
            </button>
            <button
              onClick={() => onViewConsultation?.(rxRecord.consultationId)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <User size={16} className="text-[#0D47A1]" />
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                  style={{ fontFamily: PP }}
                >
                  Patient Summary
                </h3>
              </div>
              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    MRN
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">
                    {rxRecord.mrn}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Mobile Number
                  </span>
                  <span className="font-semibold text-slate-700">
                    {rxRecord.mobileNumber}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Department
                  </span>
                  <span className="font-medium text-slate-700">
                    {rxRecord.department}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Attending Doctor
                  </span>
                  <span className="font-semibold text-slate-800">
                    {rxRecord.doctorName}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {rxRecord.doctorSpecialty}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Visit Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {rxRecord.visitDate}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Allergies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rxRecord.allergies.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Known Conditions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rxRecord.knownConditions.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                        style={{ fontFamily: RB }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Diagnosis Summary
                </h3>
              </div>
              <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Chief Complaint
                  </span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-800 font-medium border border-gray-100">
                    {rxRecord.chiefComplaint}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Clinical Findings
                  </span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-gray-100">
                    {rxRecord.clinicalFindings}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                      style={{ fontFamily: PP }}
                    >
                      Final Diagnosis
                    </span>
                    <p
                      className="font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {rxRecord.finalDiagnosis}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                      style={{ fontFamily: PP }}
                    >
                      ICD Code
                    </span>
                    <p className="font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                      {rxRecord.icdCode}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Consultation Notes
                  </span>
                  <p className="text-slate-600 leading-relaxed italic">
                    {rxRecord.consultationNotes}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h3
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Prescribed Medicines
                  </h3>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#009688] border border-teal-100"
                  style={{ fontFamily: PP }}
                >
                  <Pill size={12} className="inline mr-1" />
                  {rxRecord.medicines.length} Medicines
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className="bg-slate-50 border-b border-gray-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      <th className="px-4 py-3">Medicine</th>
                      <th className="px-3 py-3">Strength</th>
                      <th className="px-3 py-3">Route</th>
                      <th className="px-3 py-3">Dosage</th>
                      <th className="px-3 py-3">Frequency</th>
                      <th className="px-3 py-3">Duration</th>
                      <th className="px-3 py-3">Quantity</th>
                      <th className="px-4 py-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-gray-100 text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {rxRecord.medicines.map((m) => (
                      <tr
                        key={m.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td
                          className="px-4 py-3 font-bold text-[#111827] whitespace-nowrap"
                          style={{ fontFamily: PP }}
                        >
                          {m.name}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap">
                          {m.strength}
                        </td>
                        <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                          {m.route}
                        </td>
                        <td className="px-3 py-3 text-slate-700 whitespace-nowrap">
                          {m.dosage}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded font-semibold text-[11px]"
                            style={{ fontFamily: PP }}
                          >
                            {m.frequency}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                          {m.duration}
                        </td>
                        <td className="px-3 py-3 font-mono font-medium text-slate-800 whitespace-nowrap">
                          {m.quantity}
                        </td>
                        <td className="px-4 py-3 text-slate-500 italic max-w-xs">
                          {m.instructions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  General Advice & Recommendations
                </h3>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Diet Advice
                  </span>
                  <p className="text-slate-700">{rxRecord.dietAdvice}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Lifestyle Advice
                  </span>
                  <p className="text-slate-700">{rxRecord.lifestyleAdvice}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Exercise Advice
                  </span>
                  <p className="text-slate-700">{rxRecord.exerciseAdvice}</p>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                  <span
                    className="text-[10px] font-bold text-amber-800 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Special Instructions
                  </span>
                  <p className="text-amber-900 font-medium">
                    {rxRecord.specialInstructions}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Follow-up Details
                </h3>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Required
                  </span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {rxRecord.followupRequired}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Next Visit Date
                  </span>
                  <span className="font-bold text-[#111827] text-sm mt-0.5 block">
                    {rxRecord.nextVisitDate}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Time Frame
                  </span>
                  <span className="text-slate-600 mt-0.5 block">In 7 Days</span>
                </div>
              </div>
              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Follow-up Notes
                </span>
                <p
                  className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs text-slate-700"
                  style={{ fontFamily: RB }}
                >
                  {rxRecord.followupNotes}
                </p>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  05
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Prescription Technical Summary
                </h3>
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Prescription ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {rxRecord.id}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Consultation ID
                  </span>
                  <span className="font-mono font-semibold text-slate-700">
                    {rxRecord.consultationId}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Issued Date
                  </span>
                  <span className="text-slate-700">{rxRecord.issuedDate}</span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Total Medicines
                  </span>
                  <span className="font-bold text-[#009688]">
                    {rxRecord.medicines.length} Medicines
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h4
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Quick Actions
              </h4>
              <div className="space-y-2">
                {rxRecord.status === "Draft" ? (
                  <button
                    onClick={() => onEditPrescription?.(rxRecord.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 size={14} /> Edit Prescription
                    </span>
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed opacity-60"
                    style={{ fontFamily: PP }}
                    title="Issued prescriptions cannot be modified"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 size={14} /> Edit Prescription
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Locked
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setPrintModalOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Printer size={14} /> Print Prescription
                  </span>
                  <ChevronRight size={13} />
                </button>
                <button
                  onClick={() => showToast(`Downloaded PDF for ${rxRecord.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Download size={14} /> Download PDF
                  </span>
                  <ChevronRight size={13} />
                </button>
                <button
                  onClick={() => onViewHistory?.(rxRecord.mrn)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={14} /> Prescription History
                  </span>
                  <ChevronRight size={13} />
                </button>
                <button
                  onClick={() => onViewConsultation?.(rxRecord.consultationId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} /> View Consultation
                  </span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <h4
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Prescription Summary
              </h4>
              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Issued By</span>
                  <span className="font-semibold text-slate-800">
                    {rxRecord.doctorName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="font-medium text-slate-700">
                    {rxRecord.issuedDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <div>{renderStatusChip(rxRecord.status)}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Follow-up Date</span>
                  <span className="font-bold text-[#111827]">
                    {rxRecord.nextVisitDate}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Activity Timeline
              </h4>
              <div className="space-y-3">
                {[
                  {
                    title: "Consultation Completed",
                    time: "09:40 AM",
                    date: "24 Jul 2026",
                    done: true,
                  },
                  {
                    title: "Prescription Drafted",
                    time: "09:41 AM",
                    date: "24 Jul 2026",
                    done: true,
                  },
                  {
                    title: "Prescription Issued",
                    time: "09:42 AM",
                    date: "24 Jul 2026",
                    done: true,
                  },
                  {
                    title: "Prescription Printed",
                    time: "09:45 AM",
                    date: "24 Jul 2026",
                    done: true,
                  },
                  {
                    title: "Prescription Downloaded",
                    time: "09:50 AM",
                    date: "24 Jul 2026",
                    done: true,
                  },
                ].map((ev, i, arr) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009688] mt-1 shrink-0" />
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 my-1 h-4" />
                      )}
                    </div>
                    <div>
                      <div
                        className="text-xs font-semibold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {ev.title}
                      </div>
                      <div
                        className="text-[10px] text-slate-400"
                        style={{ fontFamily: RB }}
                      >
                        {ev.date} at {ev.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {printModalOpen && (
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
                onClick={() => setPrintModalOpen(false)}
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
                <span className="font-mono text-slate-500">{rxRecord.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Patient:</strong> {rxRecord.patientName}
                </div>
                <div>
                  <strong>MRN:</strong> {rxRecord.mrn}
                </div>
                <div>
                  <strong>Doctor:</strong> {rxRecord.doctorName}
                </div>
                <div>
                  <strong>Date:</strong> {rxRecord.consultationDate}
                </div>
              </div>
              <div>
                <strong>Diagnosis:</strong> {rxRecord.finalDiagnosis}
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">
                  Medicines ({rxRecord.medicines.length}):
                </div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {rxRecord.medicines.map((m) => (
                    <li key={m.id}>
                      {m.name} {m.strength} — {m.frequency} ({m.instructions})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalOpen(false);
                  showToast(`Prescription ${rxRecord.id} sent to printer`);
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
