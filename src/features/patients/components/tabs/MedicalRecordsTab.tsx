/**
 * MedicalRecordsTab – Patient Profile Tab for Medical Records
 * Displays consultations, vitals, diagnoses from existing OPD/Vitals endpoints
 * No duplicate module — reuses existing backend data
 */
import { useState } from "react";
import {
  Stethoscope,
  Heart,
  Activity,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import type {
  ConsultationRecord,
  VitalsRecord,
  DiagnosisRecord,
  MedicalHistoryEntry,
} from "../../types/medicalRecord.types";

export interface MedicalRecordsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

type MedicalSubTab = "timeline" | "consultations" | "vitals" | "diagnoses";

const SUB_TABS: Array<{
  id: MedicalSubTab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "consultations", label: "Consultations", icon: Stethoscope },
  { id: "vitals", label: "Vitals", icon: Heart },
  { id: "diagnoses", label: "Diagnoses", icon: Activity },
];

const STATUS_STYLE: Record<string, string> = {
  Completed: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  "In-Progress": "bg-sky-50 text-sky-700 border-sky-200",
  "Follow-up Required": "bg-amber-50 text-[#F59E0B] border-amber-200",
  Active: "bg-blue-50 text-[#0D47A1] border-blue-200",
  Resolved: "bg-gray-50 text-gray-600 border-gray-200",
  Chronic: "bg-purple-50 text-purple-700 border-purple-200",
  Cancelled: "bg-red-50 text-[#EF4444] border-red-200",
};

function TimelineView({ entries }: { entries: MedicalHistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No medical history found.
      </div>
    );
  }

  const iconMap: Record<string, React.ElementType> = {
    consultation: Stethoscope,
    vitals: Heart,
    diagnosis: Activity,
    prescription: FileText,
  };

  const colorMap: Record<string, string> = {
    consultation: "bg-blue-50 text-[#0D47A1]",
    vitals: "bg-rose-50 text-rose-600",
    diagnosis: "bg-purple-50 text-purple-700",
    prescription: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const Icon = iconMap[entry.type] || FileText;
        const colorCls = colorMap[entry.type] || "bg-slate-50 text-slate-600";
        return (
          <div
            key={`${entry.type}-${entry.id}`}
            className="flex items-start gap-3 bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full ${colorCls} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-[#111827] truncate">
                  {entry.title}
                </div>
                {entry.status && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${STATUS_STYLE[entry.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                  >
                    {entry.status}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {entry.description}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                {entry.date && <span>{entry.date}</span>}
                {entry.doctorName && <span>· {entry.doctorName}</span>}
                {entry.department && <span>· {entry.department}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConsultationsView({ records }: { records: ConsultationRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No consultation records found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center">
              <Stethoscope size={14} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827]">
                {c.doctorName}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {c.consultationDate} · {c.department}
              </div>
              {c.diagnosis && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {c.diagnosis}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[c.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {c.status}
            </span>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

function VitalsView({ records }: { records: VitalsRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No vitals records found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((v) => (
        <div
          key={v.id}
          className="bg-white border border-[#E5E7EB] rounded-xl p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-[#111827]">
              {v.recordedAt || "—"}
            </div>
            {v.recordedBy && (
              <div className="text-[11px] text-[#64748B]">
                By: {v.recordedBy}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {v.bloodPressure && (
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">BP</div>
                <div className="text-xs font-bold text-[#111827]">
                  {v.bloodPressure}
                </div>
              </div>
            )}
            {v.heartRate && (
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">Heart Rate</div>
                <div className="text-xs font-bold text-[#111827]">
                  {v.heartRate}
                </div>
              </div>
            )}
            {v.temperature && (
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">Temperature</div>
                <div className="text-xs font-bold text-[#111827]">
                  {v.temperature}
                </div>
              </div>
            )}
            {v.spo2 && (
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">SpO2</div>
                <div className="text-xs font-bold text-[#111827]">{v.spo2}</div>
              </div>
            )}
            {v.weight && (
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">Weight</div>
                <div className="text-xs font-bold text-[#111827]">
                  {v.weight}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagnosesView({ records }: { records: DiagnosisRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No diagnosis records found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((d) => (
        <div
          key={d.id}
          className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Activity size={14} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827]">
                {d.diagnosisName}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {d.date} · {d.doctorName}
              </div>
              {d.diagnosisCode && (
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ICD: {d.diagnosisCode}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {d.severity && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  d.severity === "Critical" || d.severity === "Severe"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : d.severity === "Moderate"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-green-50 text-green-600 border-green-200"
                }`}
              >
                {d.severity}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[d.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {d.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PatientMedicalRecordsTab({ patient }: MedicalRecordsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<MedicalSubTab>("timeline");
  const { data: medicalSummary, isLoading } = useMedicalRecords(patient.mrn);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading medical records...
      </div>
    );
  }

  const summary = medicalSummary || {
    consultations: [],
    vitals: [],
    diagnoses: [],
    timeline: [],
    totalVisits: 0,
  };

  const subTabContent = (() => {
    switch (activeSubTab) {
      case "timeline":
        return <TimelineView entries={summary.timeline} />;
      case "consultations":
        return <ConsultationsView records={summary.consultations} />;
      case "vitals":
        return <VitalsView records={summary.vitals} />;
      case "diagnoses":
        return <DiagnosesView records={summary.diagnoses} />;
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Medical Records
        </h3>
        <span className="text-[11px] text-[#64748B]">
          {summary.totalVisits} visits
        </span>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? "bg-[#0D47A1] text-white"
                  : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {subTabContent}
    </div>
  );
}
