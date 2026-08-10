import { useState, useEffect } from "react";
import {
  ChevronDown,
  Printer,
  Download,
  Edit3,
  ArrowLeft,
  Shield,
  AlertCircle,
} from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import type { ConsultationRecord } from "../types/consultation";

// Reusable Components
import { ConsultationHeader } from "../components/ConsultationHeader";
import { VitalsCard } from "../components/VitalsCard";
import { ChiefComplaintCard } from "../components/ChiefComplaintCard";
import { ExaminationCard } from "../components/ExaminationCard";
import { DiagnosisCard } from "../components/DiagnosisCard";
import { PrescriptionCard } from "../components/PrescriptionCard";
import { InvestigationCard } from "../components/InvestigationCard";
import { AdviceCard } from "../components/AdviceCard";
import { FollowupCard } from "../components/FollowupCard";
import { TimelineCard } from "../components/TimelineCard";
import { PatientSummaryCard } from "../components/PatientSummaryCard";

const PP = "'Poppins', system-ui, sans-serif";

const emptyVitals = {
  bp: "",
  pulse: "",
  temp: "",
  spo2: "",
  height: "",
  weight: "",
  bmi: "",
  respiratoryRate: "",
  bloodSugar: "",
};
const RB = "'Roboto', system-ui, sans-serif";

interface TimelineEvent {
  title: string;
  date: string;
  time: string;
  status: string;
  badgeColor: string;
}

function parseDateTime(dateStr?: string): { date: string; time: string } {
  if (!dateStr) return { date: "N/A", time: "" };
  const commaIdx = dateStr.indexOf(",");
  if (commaIdx >= 0) {
    return { date: dateStr.slice(0, commaIdx), time: dateStr.slice(commaIdx + 1).trim() };
  }
  return { date: dateStr, time: "" };
}

function generateTimeline(
  record: ConsultationRecord,
  isAuditMode: boolean,
): TimelineEvent[] {
  const created = parseDateTime(record.createdDate);
  const completed = parseDateTime(record.completedDate);
  const visitDate = record.visitDate || record.date || "N/A";

  if (isAuditMode) {
    return [
      { title: "Appointment Booked", date: visitDate, time: record.appointmentTime || "", status: "Scheduled", badgeColor: "bg-slate-100 text-slate-700" },
      { title: "Consultation Started", date: created.date, time: created.time, status: "In Progress", badgeColor: "bg-teal-50 text-[#009688]" },
      { title: "Consultation Completed", date: completed.date, time: completed.time, status: "Completed", badgeColor: "bg-green-50 text-[#66BB6A]" },
      { title: "Prescription Generated", date: completed.date, time: "", status: "Generated", badgeColor: "bg-purple-50 text-purple-700" },
      { title: "Billing Status", date: completed.date, time: "", status: record.billingStatus || "Paid", badgeColor: "bg-blue-50 text-[#0D47A1]" },
    ];
  }

  const events: TimelineEvent[] = [
    { title: "Appointment Scheduled", date: visitDate, time: record.appointmentTime || "", status: "Scheduled", badgeColor: "bg-slate-100 text-slate-700" },
    { title: "Consultation Started", date: created.date, time: created.time, status: "In Progress", badgeColor: "bg-teal-50 text-[#009688]" },
  ];

  if (record.vitals) {
    events.push({ title: "Vitals Recorded", date: created.date, time: created.time, status: "Vitals Recorded", badgeColor: "bg-teal-50 text-[#009688]" });
  }
  if (record.finalDiagnosis) {
    events.push({ title: "Diagnosis Completed", date: completed.date, time: "", status: "Diagnosis Completed", badgeColor: "bg-indigo-50 text-indigo-700" });
  }
  if (record.medicines && record.medicines.length > 0) {
    events.push({ title: "Prescription Added", date: completed.date, time: "", status: "Prescription Added", badgeColor: "bg-purple-50 text-purple-700" });
  }
  if (record.nextVisitDate) {
    events.push({ title: "Follow-up Scheduled", date: visitDate, time: "", status: "Follow-up Scheduled", badgeColor: "bg-amber-50 text-amber-700" });
  }

  events.push({ title: "Consultation Completed", date: completed.date, time: completed.time, status: "Completed", badgeColor: "bg-green-50 text-[#66BB6A]" });
  return events;
}

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
  const { selectedConsultation, loading, error, loadFullConsultationDetails } =
    useConsultation();

  useEffect(() => {
    if (consultationId) {
      void loadFullConsultationDetails(consultationId);
    }
  }, [consultationId, loadFullConsultationDetails]);

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

  const record = selectedConsultation;
  const currentTimeline = record
    ? generateTimeline(record, isAuditMode)
    : [];

  if (loading) {
    return (
      <div className="flex-1 bg-[#F1F5F9] flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0D47A1] border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
            Loading consultation details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-[#F1F5F9] flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={20} />
          </div>
          <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex-1 bg-[#F1F5F9] flex items-center justify-center min-h-100">
        <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
          No consultation data found.
        </p>
      </div>
    );
  }

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
                <VitalsCard values={record.vitals || emptyVitals} />
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
                  <ExaminationCard findings={record.clinicalExamination || ""} />
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
                  required={record.followupRequired || "No"}
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
