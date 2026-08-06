import { useState } from "react";
import {
  ChevronDown,
  Printer,
  Download,
  Edit3,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { usePermissions } from "../../../permissions";

// Reusable Components
import { ConsultationHeader } from "../components/ConsultationHeader";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { VitalsCard } from "../components/VitalsCard";
import { ChiefComplaintCard } from "../components/ChiefComplaintCard";
import { ExaminationCard } from "../components/ExaminationCard";
import { DiagnosisCard } from "../components/DiagnosisCard";
import { PrescriptionCard } from "../components/PrescriptionCard";
import { InvestigationCard } from "../components/InvestigationCard";
import { AdviceCard } from "../components/AdviceCard";
import { FollowupCard } from "../components/FollowupCard";
import { TimelineCard } from "../components/TimelineCard";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function ConsultationDetailsPage({
  consultationId = "CNS-1001",
  onBack,
  onEditConsultation,
  onViewHistory,
}: {
  consultationId?: string;
  onBack?: () => void;
  onEditConsultation?: (id: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onViewPatientProfile?: (mrn: string) => void;
}) {
  const { can, role } = usePermissions();

  // If user has HOSPITAL_ADMIN or ADMIN role, or the check returns true for viewing all, we enable Audit Mode
  const isAuditMode =
    role === "HOSPITAL_ADMIN" ||
    role === "ADMIN" ||
    can("CONSULTATION_VIEW_ALL");

  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    visitInfo: false,
    vitals: false,
    examination: false,
    prescription: false,
    investigation: false,
    clinicalNotes: false,
    followup: false,
    summary: false,
    metadata: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Read-only Consultation Record Data
  const record = {
    id: consultationId,
    appointmentId: "APT-1001",
    visitDate: "24 Jul 2026",
    completionTime: "09:42 AM",
    createdDate: "24 Jul 2026, 09:00 AM",
    completedDate: "24 Jul 2026, 09:42 AM",
    duration: "14 mins",
    patientName: "Sarah Mitchell",
    mrn: "MRN-2024-001",
    age: 34,
    gender: "Female" as const,
    bloodGroup: "A+",
    allergies: ["Penicillin", "Aspirin"],
    phone: "+1 (555) 234-5678",
    doctorName: "Dr. Arjun Mehta",
    doctorSpecialty: "Interventional Cardiology",
    department: "Cardiology",
    doctorExperience: "12+ Years Experience",
    visitType: "First Visit" as const,
    chiefComplaint:
      "Severe chest tightness radiating to left shoulder with acute dyspnea",
    durationOfSymptoms: "3 days",
    // Vitals
    vitals: {
      height: "168 cm",
      weight: "72 kg",
      bmi: "25.5 kg/m²",
      temp: "37.2 °C",
      bp: "145/92 mmHg",
      pulse: "88 bpm",
      respiratoryRate: "18 /min",
      spo2: "97 %",
      bloodSugar: "110 mg/dL",
    },
    // Examination
    clinicalExamination:
      "Chest wall non-tender. Normal S1 and S2 heart sounds. No murmurs or gallop rhythm. Bilateral vesicular breath sounds.",
    provisionalDiagnosis: "Acute Coronary Syndrome / Angina Pectoris",
    finalDiagnosis: "Angina Pectoris, unspecified",
    icdCode: "I20.9 — Angina Pectoris, unspecified",
    // Prescriptions
    medicines: [
      {
        id: "1",
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once Daily",
        duration: "30 Days",
        instructions: "Take after breakfast",
      },
      {
        id: "2",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice Daily",
        duration: "30 Days",
        instructions: "Take with meals",
      },
    ],
    // Investigations
    investigations: ["CBC", "ECG", "2D Echocardiogram & Trop-I STAT"],
    investigationRemarks:
      "Perform 12-lead ECG immediately and monitor Troponin-I levels.",
    // Clinical Notes
    symptoms:
      "Substernal chest pressure, exertional shortness of breath, mild diaphoresis.",
    assessment: "High cardiovascular risk profile. Borderline hypertension.",
    advice:
      "Strict low sodium diet. Avoid heavy physical exertion. Continue cardiac regimen.",
    lifestyleRecommendations:
      "Daily 30 min light walking after 1 week. Stress reduction and smoking cessation.",
    // Followup
    followupRequired: "Yes",
    nextVisitDate: "31 Jul 2026",
    followupNotes:
      "Review ECG & Troponin reports. Adjust anti-hypertensive dosage if required.",
    // Fee & Status
    consultationFee: "$150.00",
    billingStatus: "Completed / Paid",
    status: "Completed",
    tokenNo: "TK-01",
  };

  // Operational Timeline Events (Admin mode)
  const operationalTimelineEvents = [
    {
      title: "Appointment Booked",
      date: "24 Jul 2026",
      time: "08:30 AM",
      status: "Scheduled",
      badgeColor: "bg-slate-100 text-slate-700",
    },
    {
      title: "Patient Checked-In",
      date: "24 Jul 2026",
      time: "08:50 AM",
      status: "Checked-In",
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      title: "Consultation Started",
      date: "24 Jul 2026",
      time: "09:00 AM",
      status: "In Progress",
      badgeColor: "bg-teal-50 text-[#009688]",
    },
    {
      title: "Consultation Completed",
      date: "24 Jul 2026",
      time: "09:42 AM",
      status: "Completed",
      badgeColor: "bg-green-50 text-[#66BB6A]",
    },
    {
      title: "Prescription Generated",
      date: "24 Jul 2026",
      time: "09:43 AM",
      status: "Generated",
      badgeColor: "bg-purple-50 text-purple-700",
    },
    {
      title: "Billing Status",
      date: "24 Jul 2026",
      time: "09:45 AM",
      status: "Paid ($150.00)",
      badgeColor: "bg-blue-50 text-[#0D47A1]",
    },
  ];

  // Standard Timeline Events (Doctor/Clinical mode)
  const timelineEvents = [
    {
      title: "Appointment Scheduled",
      date: "24 Jul 2026",
      time: "08:30 AM",
      status: "Scheduled",
      badgeColor: "bg-slate-100 text-slate-700",
    },
    {
      title: "Patient Checked-In",
      date: "24 Jul 2026",
      time: "08:50 AM",
      status: "Checked-In",
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      title: "Consultation Started",
      date: "24 Jul 2026",
      time: "09:00 AM",
      status: "In Progress",
      badgeColor: "bg-teal-50 text-[#009688]",
    },
    {
      title: "Vitals Recorded",
      date: "24 Jul 2026",
      time: "09:05 AM",
      status: "Vitals Recorded",
      badgeColor: "bg-teal-50 text-[#009688]",
    },
    {
      title: "Diagnosis Completed",
      date: "24 Jul 2026",
      time: "09:20 AM",
      status: "Diagnosis Completed",
      badgeColor: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Prescription Added",
      date: "24 Jul 2026",
      time: "09:30 AM",
      status: "Prescription Added",
      badgeColor: "bg-purple-50 text-purple-700",
    },
    {
      title: "Follow-up Scheduled",
      date: "24 Jul 2026",
      time: "09:38 AM",
      status: "Follow-up Scheduled",
      badgeColor: "bg-amber-50 text-amber-700",
    },
    {
      title: "Consultation Completed",
      date: "24 Jul 2026",
      time: "09:42 AM",
      status: "Completed",
      badgeColor: "bg-green-50 text-[#66BB6A]",
    },
  ];

  const currentTimeline = isAuditMode
    ? operationalTimelineEvents
    : timelineEvents;

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* HEADER */}
      <ConsultationHeader
        roleLabel={isAuditMode ? "Hospital Admin" : "Doctor"}
        moduleLabel={
          isAuditMode ? "OPD Consultation Management" : "OPD Consultation"
        }
        pageTitle="Consultation Details"
        subtitle={
          isAuditMode
            ? "Review consultation information and operational records."
            : "Review completed consultation records."
        }
        statusBadge={
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-[#66BB6A] border border-green-200"
            style={{ fontFamily: PP }}
          >
            {isAuditMode ? "Completed (Audit Mode)" : "Completed"}
          </span>
        }
        breadcrumbs={[]}
        actions={
          <>
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}

            {isAuditMode ? (
              <>
                <button
                  onClick={() =>
                    alert(`Downloading Consultation PDF (${record.id})`)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={14} />
                  Download PDF
                </button>
                <button
                  onClick={() =>
                    alert(`Printing Consultation Summary for ${record.id}`)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Printer size={14} />
                  Print Record
                </button>
              </>
            ) : (
              <>
                {can("CONSULTATION_PRINT") && (
                  <button
                    onClick={() =>
                      alert(`Prescription document printed for ${record.id}`)
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={14} />
                    Print Summary
                  </button>
                )}
                {can("CONSULTATION_UPDATE") && onEditConsultation && (
                  <button
                    onClick={() => onEditConsultation(record.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <Edit3 size={14} />
                    Edit Record
                  </button>
                )}
              </>
            )}
          </>
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* PATIENT SUMMARY CARD */}
        <PatientSummaryCard
          patientName={record.patientName}
          mrn={record.mrn}
          age={record.age}
          gender={record.gender}
          bloodGroup={record.bloodGroup}
          allergies={record.allergies}
          phone={record.phone}
          primaryDoctor={record.doctorName}
          opdRoom={record.tokenNo}
          visitType={record.visitType}
          appointmentTime={record.completionTime}
          extraDetails={
            onViewHistory && (
              <button
                type="button"
                onClick={() => onViewHistory(record.mrn)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-bold rounded-xl border border-blue-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                View History
              </button>
            )
          }
        />

        {/* Audit Mode Header Banner */}
        {isAuditMode && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <Shield className="text-[#0D47A1] shrink-0 mt-0.5" size={18} />
            <div>
              <h4
                className="text-xs font-bold text-[#0D47A1]"
                style={{ fontFamily: PP }}
              >
                Administrative Audit View
              </h4>
              <p
                className="text-[11px] text-slate-600 mt-0.5"
                style={{ fontFamily: RB }}
              >
                You are viewing the clinical encounter details and audit logs as
                an administrator. Clinical inputs are locked.
              </p>
            </div>
          </div>
        )}

        {/* Grid layout containing cards and timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Vitals Summary Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("vitals")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Encounter Vitals
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.vitals ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.vitals && (
                <VitalsCard values={record.vitals} />
              )}
            </div>

            {/* Chief Complaint Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("clinicalNotes")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Clinical Symptoms & SOAP
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.clinicalNotes ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.clinicalNotes && (
                <div className="space-y-4">
                  <ChiefComplaintCard
                    complaint={record.chiefComplaint}
                    duration={record.durationOfSymptoms}
                    historyOfPresentIllness={record.symptoms}
                  />
                  <ExaminationCard findings={record.clinicalExamination} />
                </div>
              )}
            </div>

            {/* Diagnosis Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("examination")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Diagnoses & Assessment
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.examination ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.examination && (
                <DiagnosisCard
                  provisionalDiagnosis={record.provisionalDiagnosis}
                  finalDiagnosis={record.finalDiagnosis}
                  icdCode={record.icdCode}
                />
              )}
            </div>

            {/* Prescription Table Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("prescription")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    SOAP Prescriptions
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.prescription ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.prescription && (
                <PrescriptionCard medicines={record.medicines} />
              )}
            </div>

            {/* Investigations Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("investigation")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Recommended Investigations
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.investigation ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.investigation && (
                <InvestigationCard
                  investigations={record.investigations}
                  remarks={record.investigationRemarks}
                />
              )}
            </div>

            {/* Clinical Advice & Lifestyle Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-600" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Advice & Lifestyle Guidance
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.summary ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.summary && (
                <AdviceCard
                  advice={record.advice}
                  lifestyleRecommendations={record.lifestyleRecommendations}
                />
              )}
            </div>

            {/* Followup Card */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("followup")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span
                    className="font-bold text-sm text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Details
                  </span>
                </div>
                <ChevronDown
                  className={`text-slate-400 transition-transform ${collapsedSections.followup ? "-rotate-90" : ""}`}
                  size={18}
                />
              </button>
              {!collapsedSections.followup && (
                <FollowupCard
                  required={record.followupRequired}
                  nextVisitDate={record.nextVisitDate}
                  notes={record.followupNotes}
                />
              )}
            </div>
          </div>

          {/* Right sidebar: timeline + fee summary */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Timeline Card */}
            <TimelineCard
              events={currentTimeline}
              title={isAuditMode ? "Operational Log" : "Clinical Timeline"}
            />

            {/* Financial Summary Card (Admin view specific details) */}
            {isAuditMode && (
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-sm font-bold text-[#111827] border-b border-gray-100 pb-3"
                  style={{ fontFamily: PP }}
                >
                  Financial Audit Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span
                      className="text-slate-400 font-semibold uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Billing Status:
                    </span>
                    <span
                      className="text-emerald-600 font-bold"
                      style={{ fontFamily: RB }}
                    >
                      {record.billingStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-slate-400 font-semibold uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Consultation Fee:
                    </span>
                    <span
                      className="text-slate-800 font-bold"
                      style={{ fontFamily: RB }}
                    >
                      {record.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationDetailsPage;
