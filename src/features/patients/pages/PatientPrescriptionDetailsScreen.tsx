import { useState } from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  AlertTriangle,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { PP, RB } from "../constants/patient.mock";
import { Av } from "../components/Avatar";

export function PatientPrescriptionDetailsScreen({
  prescriptionId = "RX-2026-0891",
  onBack,
}: {
  prescriptionId?: string;
  onBack?: () => void;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Prescription Record data matching Patient scope
  const rxRecord = {
    id: prescriptionId,
    consultationId: 'CNS-1001',
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-892101',
    age: 34,
    gender: "Female",
    bloodGroup: "A+",
    photo: "",
    consultationDate: "24 Jul 2026",
    issuedDate: "24 Jul 2026, 09:42 AM",
    status: "Issued" as "Issued" | "Completed" | "Archived",
    doctorName: "Dr. Arjun Mehta",
    doctorSpecialty: "Interventional Cardiology",
    department: "Cardiology",
    mobileNumber: "+1 (555) 234-5678",
    lastConsultationDate: "24 Jul 2026",
    allergies: ["Penicillin", "Aspirin"],
    knownConditions: ["Hypertension", "Borderline Type 2 Diabetes"],

    // Section 01: Diagnosis Summary
    chiefComplaint:
      "Severe chest tightness radiating to left shoulder with acute dyspnea on exertion.",
    clinicalFindings:
      "Chest wall non-tender. S1 and S2 heart sounds heard normal. No murmurs or gallop rhythm. BP 145/92 mmHg, HR 88 bpm.",
    finalDiagnosis: "Angina Pectoris, unspecified",
    icdCode: "I20.9 — Angina Pectoris, unspecified",
    doctorNotes:
      "Patient presented with acute exertional chest discomfort. Electrocardiogram (ECG) performed in clinic. High cardiovascular risk profile noted. Prescribed anti-hypertensive and lipid lowering therapy.",

    // Section 02: Medicines List
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

    // Section 03: General Advice
    dietAdvice:
      "Strict low-sodium (< 2g/day), low saturated fat diet. Increase fiber intake and fresh vegetables.",
    lifestyleAdvice:
      "Smoking cessation strictly advised. Avoid stress and maintain regular sleep hygiene (7-8 hours).",
    exerciseAdvice:
      "Daily light 20-30 min walking after 1 week. Avoid strenuous physical weight lifting until follow-up.",
    specialInstructions:
      "If chest pain recurs or intensifies, use sublingual GTN spray immediately and report to ER.",

    // Section 04: Follow-up Details
    followupRequired: "Yes",
    nextVisitDate: "31 Jul 2026",
    followupNotes:
      "Review ECG & Troponin-I laboratory reports. Re-evaluate blood pressure control and adjust anti-hypertensive dosage if needed.",
  };

  // Timeline Events
  const activityTimeline = [
    {
      title: "Consultation Completed",
      date: "24 Jul 2026, 09:30 AM",
      status: "done",
      desc: "OPD Consultation completed by Dr. Arjun Mehta",
    },
    {
      title: "Prescription Issued",
      date: "24 Jul 2026, 09:42 AM",
      status: "done",
      desc: "Official digital prescription signed & issued",
    },
    {
      title: "Prescription Viewed",
      date: "24 Jul 2026, 10:15 AM",
      status: "done",
      desc: "Viewed via Patient Portal",
    },
    {
      title: "Prescription Downloaded",
      date: "24 Jul 2026, 10:18 AM",
      status: "done",
      desc: "PDF downloaded by patient",
    },
  ];

  // Status Chip Renderer
  const renderStatusChip = (st: "Issued" | "Completed" | "Archived") => {
    switch (st) {
      case "Issued":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
            Issued
          </span>
        );
      case "Completed":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
            Completed
          </span>
        );
      case "Archived":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Archived
          </span>
        );
    }
  };

  return (
    <div
      className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20"
      style={{ fontFamily: RB }}
    >
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className="fixed top-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce"
          style={{ fontFamily: RB }}
        >
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
              style={{ fontFamily: RB }}
            >
              <span>Patient Portal</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>My Prescriptions</span>
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
              View your prescription, medicines and follow-up instructions.
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
                Back to My Prescriptions
              </button>
            )}
            <button
              onClick={() => setPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print Prescription
            </button>
            <button
              onClick={() => triggerToast(`Downloaded PDF for ${rxRecord.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT HERO HEADER (Reused) ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Av name={rxRecord.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{rxRecord.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{rxRecord.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{rxRecord.id}</span>
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
                  Doctor:{" "}
                  <strong className="text-[#111827]">
                    {rxRecord.doctorName} ({rxRecord.department})
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

            {/* Allergy alert badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0"
              style={{ fontFamily: PP }}
            >
              <AlertTriangle size={13} />
              <span>Allergies: {rxRecord.allergies.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE CONTENT: 3-COLUMN LAYOUT ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── LEFT PANEL (Col-span-3): Patient Summary ── */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Patient Summary
              </h3>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{rxRecord.mrn}</span>
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Mobile Number
                  </span>
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />{" "}
                    {rxRecord.mobileNumber}
                  </span>
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Blood Group
                  </span>
                  <span className="font-bold text-slate-800">
                    {rxRecord.bloodGroup}
                  </span>
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Primary Doctor
                  </span>
                  <span className="font-semibold text-slate-800">
                    {rxRecord.doctorName}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {rxRecord.department}
                  </span>
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Last Consultation Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {rxRecord.lastConsultationDate}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Known Allergies
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
              </div>
            </div>
          </div>

          {/* ── CENTER CONTENT (Col-span-6): Prescription Details ── */}
          <div className="lg:col-span-6 space-y-5">
            {/* SECTION 01: Diagnosis Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
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
                    <p className="p-2.5 bg-blue-50/50 rounded-xl font-bold text-[#111827] border border-blue-100">
                      {rxRecord.finalDiagnosis}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                      style={{ fontFamily: PP }}
                    >
                      ICD-10 Code
                    </span>
                    <p className="p-2.5 bg-blue-50 text-[#0D47A1] rounded-xl font-mono font-bold border border-blue-100">
                      {rxRecord.icdCode}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    Doctor Notes
                  </span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 italic border border-gray-100">
                    {rxRecord.doctorNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 02: Medicine List Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h3
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Prescribed Medications
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  Total: {rxRecord.medicines.length} Medicines
                </span>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-left border-collapse text-xs"
                  style={{ fontFamily: RB }}
                >
                  <thead>
                    <tr
                      className="bg-slate-50 border-b border-gray-200 text-[10px] font-bold text-slate-500 uppercase"
                      style={{ fontFamily: PP }}
                    >
                      <th className="p-2">Medicine Name</th>
                      <th className="p-2">Strength</th>
                      <th className="p-2">Route</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rxRecord.medicines.map((m) => (
                      <tr
                        key={m.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td
                          className="p-2 font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {m.name}
                        </td>
                        <td className="p-2 text-slate-700">{m.strength}</td>
                        <td className="p-2 text-slate-600 font-mono text-[10px]">
                          {m.route}
                        </td>
                        <td className="p-2 font-medium">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">
                          {m.frequency}
                        </td>
                        <td className="p-2 text-slate-600">{m.duration}</td>
                        <td className="p-2 font-mono font-medium">
                          {m.quantity}
                        </td>
                        <td className="p-2 text-slate-600 italic text-[11px]">
                          {m.instructions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 03: General Advice */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  General Advice &amp; Care Plan
                </h3>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
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
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
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
            </div>

            {/* SECTION 04: Follow-up Details */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Follow-up Instructions
                </h3>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
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
            </div>

            {/* SECTION 05: Prescription Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
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
            </div>
          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-3) ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* CARD 01: Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2">
              <h4
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Quick Actions
              </h4>

              <button
                onClick={() =>
                  triggerToast(`Downloaded PDF for ${rxRecord.id}`)
                }
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2">
                  <Download size={14} /> Download PDF
                </span>
                <ChevronRight size={13} />
              </button>

              <button
                onClick={() => setPrintModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2">
                  <Printer size={14} /> Print Prescription
                </span>
                <ChevronRight size={13} />
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2">
                    <ChevronLeft size={14} /> Back to My Prescriptions
                  </span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            {/* CARD 02: Prescription Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2.5">
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
                  <span className="text-slate-700">24 Jul 2026</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <div>{renderStatusChip(rxRecord.status)}</div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Next Follow-up</span>
                  <span className="font-bold text-amber-700">
                    {rxRecord.nextVisitDate}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 03: Activity Timeline */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
              <h4
                className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Activity Timeline
              </h4>

              <div className="space-y-3 text-xs relative pl-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                {activityTimeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#0D47A1] border border-white" />
                    <div>
                      <div
                        className="font-semibold text-slate-800"
                        style={{ fontFamily: PP }}
                      >
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.date}
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Print Prescription Document
              </h3>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3 text-xs"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span
                  className="font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  HMS Hospital &amp; Medical Research Center
                </span>
                <span className="font-mono text-slate-500">{rxRecord.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Patient:</strong> {rxRecord.patientName}</div>
                <div><strong>MRN:</strong> {rxRecord.mrn}</div>
                <div><strong>Doctor:</strong> {rxRecord.doctorName}</div>
                <div><strong>Date:</strong> {rxRecord.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {rxRecord.finalDiagnosis}</div>
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

            <div className="flex justify-end gap-2 pt-2">
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
                  triggerToast(`Prescription ${rxRecord.id} sent to printer`);
                  window.print();
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