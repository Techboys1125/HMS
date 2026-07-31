import { useState } from "react";
import {
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  FileText,
  Pill,
  Activity,
  Plus,
  Download,
  Check,
  AlertTriangle,
  Phone,
  ClipboardList,
  Save,
  ArrowRight,
  Building2,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  VITALS_DATA,
  MEDICATIONS,
  TIMELINE,
} from "../../../mocks/doctors.mock";
import { PP, RB } from "../constants/doctors.constants";
import { Card } from "./Card";
import { Avatar } from "./Avatar";

type ConsultTab = "overview" | "vitals" | "soap" | "prescription" | "history";

const CONSULT_TABS: {
  id: ConsultTab;
  label: string;
  Icon: React.ElementType;
}[] = [
  { id: "overview", label: "Overview", Icon: User },
  { id: "vitals", label: "Vitals", Icon: Activity },
  { id: "soap", label: "Clinical Notes", Icon: ClipboardList },
  { id: "prescription", label: "Prescription", Icon: Pill },
  { id: "history", label: "History", Icon: FileText },
];

export function DoctorConsultationScreen({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<ConsultTab>("overview");
  const [soapData, setSoapData] = useState({
    subjective:
      "Patient presents with severe chest pain radiating to left arm, onset 2 hours ago. Associated with diaphoresis and nausea. Pain rated 8/10.",
    objective:
      "BP 145/92 mmHg, HR 88 bpm, SpO2 97%, Temp 37.2°C. Patient appears distressed. Chest wall non-tender.",
    assessment:
      "R07.9 — Chest pain, unspecified. Rule out NSTEMI / ACS. Differential includes musculoskeletal and GERD.",
    plan: "Serial ECGs, cardiac biomarkers. Aspirin 300mg stat. GTN PRN. Cardiology consult if troponin elevated. Admit for observation.",
  });

  return (
    <div className="flex-1 overflow-hidden flex bg-[#F1F5F9]">
      {/* ── Left Panel: Patient Summary ── */}
      <div className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-gray-50">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D47A1] mb-4 transition-colors font-medium"
              style={{ fontFamily: RB }}
            >
              <ChevronLeft size={13} /> Back
            </button>
          )}
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-100 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse shrink-0" />
            <span
              className="text-xs font-semibold text-[#009688]"
              style={{ fontFamily: PP }}
            >
              Consultation Active
            </span>
          </div>
          <Avatar name="Sarah Mitchell" size="lg" />
          <div className="mt-3">
            <div
              className="font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Sarah Mitchell
            </div>
            <div
              className="text-xs text-slate-500 mt-0.5"
              style={{ fontFamily: RB }}
            >
              Female · 34 years · Blood A+
            </div>
            <div className="font-mono text-xs text-[#0D47A1] mt-1.5 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              MRN-2024-001
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          <div>
            <div
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2"
              style={{ fontFamily: PP }}
            >
              Allergies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Penicillin", "Aspirin"].map((a) => (
                <span
                  key={a}
                  className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-100 font-semibold"
                  style={{ fontFamily: PP }}
                >
                  ⚠ {a}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Phone", value: "+1 (555) 234-5678", Icon: Phone },
              { label: "Doctor", value: "Dr. A. Mehta", Icon: Stethoscope },
              { label: "Room", value: "OPD Wing A", Icon: Building2 },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div
                    className="text-[9px] text-slate-400 font-bold uppercase tracking-wide"
                    style={{ fontFamily: PP }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-xs text-slate-700 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3"
              style={{ fontFamily: PP }}
            >
              Visit Timeline
            </div>
            <div className="space-y-0">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] mt-1 shrink-0" />
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 my-0.5" />
                    )}
                  </div>
                  <div className="pb-3">
                    <div className="font-mono text-[10px] text-slate-400">
                      {t.time}
                    </div>
                    <div
                      className="text-[11px] text-slate-700 leading-snug"
                      style={{ fontFamily: RB }}
                    >
                      {t.event}
                    </div>
                    <div
                      className="text-[10px] text-slate-400"
                      style={{ fontFamily: RB }}
                    >
                      {t.by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#009688] text-white text-sm font-semibold hover:bg-[#00827a] transition-colors"
            style={{ fontFamily: PP }}
          >
            <Check size={14} /> Complete Consultation
          </button>
        </div>
      </div>

      {/* ── Right Panel: Tabbed Workspace ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-5 flex items-center gap-1 shrink-0">
          {CONSULT_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                tab === id
                  ? "border-[#0D47A1] text-[#0D47A1]"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
              }`}
              style={{ fontFamily: PP }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "overview" && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={15} className="text-[#EF4444]" />
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold text-slate-400 uppercase tracking-wide"
                      style={{ fontFamily: PP }}
                    >
                      Chief Complaint
                    </div>
                    <div
                      className="text-sm font-semibold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Chest Pain — High Priority
                    </div>
                  </div>
                </div>
                <p
                  className="text-sm text-slate-600 leading-relaxed"
                  style={{ fontFamily: RB }}
                >
                  Severe chest pain radiating to left arm, onset 2 hours ago.
                  Associated with diaphoresis and nausea. Pain rated 8/10. No
                  prior similar episodes. PMH: Hypertension, Type 2 Diabetes.
                </p>
              </Card>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VITALS_DATA.map((v) => (
                  <Card key={v.label} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <v.Icon size={14} style={{ color: v.color }} />
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${v.status === "high" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                        style={{ fontFamily: PP }}
                      >
                        {v.status === "high" ? "HIGH" : "OK"}
                      </span>
                    </div>
                    <div
                      className="text-xl font-bold text-[#111827] leading-none"
                      style={{ fontFamily: PP }}
                    >
                      {v.value}
                    </div>
                    <div
                      className="text-[10px] text-slate-400 mt-0.5"
                      style={{ fontFamily: RB }}
                    >
                      {v.unit}
                    </div>
                    <div
                      className="text-[10px] text-slate-400 mt-1"
                      style={{ fontFamily: RB }}
                    >
                      {v.label}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-5">
                <div
                  className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3"
                  style={{ fontFamily: PP }}
                >
                  Known Conditions & PMH
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Hypertension",
                    "Type 2 Diabetes",
                    "Hyperlipidaemia",
                    "Ex-smoker",
                  ].map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] text-xs rounded-full font-medium border border-blue-100"
                      style={{ fontFamily: RB }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="text-xs font-bold text-slate-400 uppercase tracking-wide"
                    style={{ fontFamily: PP }}
                  >
                    Current Medications
                  </div>
                  <button
                    onClick={() => setTab("prescription")}
                    className="text-xs text-[#0D47A1] font-medium hover:underline flex items-center gap-1"
                    style={{ fontFamily: RB }}
                  >
                    Manage <ArrowRight size={11} />
                  </button>
                </div>
                <div className="space-y-2">
                  {MEDICATIONS.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#009688]/10 flex items-center justify-center shrink-0">
                        <Pill size={12} className="text-[#009688]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-semibold text-[#111827] truncate"
                          style={{ fontFamily: PP }}
                        >
                          {m.name} {m.dose}
                        </div>
                        <div
                          className="text-[10px] text-slate-400"
                          style={{ fontFamily: RB }}
                        >
                          {m.freq} · {m.route}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${m.status === "prn" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}
                        style={{ fontFamily: PP }}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "vitals" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {VITALS_DATA.map((v) => (
                  <Card key={v.label} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: v.color + "18" }}
                      >
                        <v.Icon size={16} style={{ color: v.color }} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${v.status === "high" ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}
                        style={{ fontFamily: PP }}
                      >
                        {v.status === "high" ? "▲ HIGH" : "✓ NORMAL"}
                      </span>
                    </div>
                    <div
                      className="text-2xl font-bold text-[#111827] leading-none"
                      style={{ fontFamily: PP }}
                    >
                      {v.value}
                    </div>
                    <div
                      className="text-xs text-slate-400 mt-1"
                      style={{ fontFamily: RB }}
                    >
                      {v.unit} · {v.label}
                    </div>
                    <div
                      className="text-[10px] text-slate-300 mt-2 pt-2 border-t border-gray-50"
                      style={{ fontFamily: RB }}
                    >
                      Normal: {v.normal}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="text-sm font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Vitals Trend — Today
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                    style={{ fontFamily: RB }}
                  >
                    <Clock size={11} /> Recorded at 09:12 by Nurse R. Singh
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { t: "08:00", sys: 138, dia: 88 },
                        { t: "09:12", sys: 145, dia: 92 },
                      ]}
                      margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                    >
                      <XAxis
                        dataKey="t"
                        tick={{ fontSize: 10, fill: "#94A3B8", fontFamily: RB }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                        domain={[60, 180]}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 11,
                          fontFamily: RB,
                          borderRadius: 8,
                        }}
                      />
                      <Bar
                        dataKey="sys"
                        name="Systolic"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="dia"
                        name="Diastolic"
                        fill="#0D47A1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="flex items-center gap-4 mt-2 text-[10px] text-slate-400"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" />{" "}
                    Systolic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#0D47A1]" />{" "}
                    Diastolic
                  </span>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="text-sm font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Record New Vitals
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Blood Pressure", "Heart Rate", "Temperature", "SpO₂"].map(
                    (field) => (
                      <div key={field}>
                        <label
                          className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block"
                          style={{ fontFamily: PP }}
                        >
                          {field}
                        </label>
                        <input
                          placeholder="Enter value"
                          className="w-full px-3 py-2 text-sm border border-gray-100 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                          style={{ fontFamily: RB }}
                        />
                      </div>
                    ),
                  )}
                </div>
                <button
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <Save size={12} /> Save Vitals
                </button>
              </Card>
            </div>
          )}

          {tab === "soap" && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="text-sm font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    SOAP Clinical Notes
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium hover:underline"
                    style={{ fontFamily: RB }}
                  >
                    <Save size={11} /> Auto-saved
                  </button>
                </div>

                {[
                  {
                    key: "subjective" as const,
                    label: "S — Subjective",
                    sub: "Patient's own account",
                    color: "#0D47A1",
                  },
                  {
                    key: "objective" as const,
                    label: "O — Objective",
                    sub: "Clinical findings",
                    color: "#009688",
                  },
                  {
                    key: "assessment" as const,
                    label: "A — Assessment",
                    sub: "Diagnosis & impression",
                    color: "#F59E0B",
                  },
                  {
                    key: "plan" as const,
                    label: "P — Plan",
                    sub: "Management strategy",
                    color: "#66BB6A",
                  },
                ].map(({ key, label, sub, color }) => (
                  <div key={key} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-1.5 h-4 rounded-full"
                        style={{ background: color }}
                      />
                      <div>
                        <div
                          className="text-xs font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-[10px] text-slate-400"
                          style={{ fontFamily: RB }}
                        >
                          {sub}
                        </div>
                      </div>
                    </div>
                    <textarea
                      className="w-full h-24 text-sm text-slate-700 border border-gray-100 rounded-xl p-3 resize-none bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                      style={{ fontFamily: RB }}
                      value={soapData[key]}
                      onChange={(e) =>
                        setSoapData((p) => ({ ...p, [key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </Card>

              <Card className="p-5">
                <div
                  className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3"
                  style={{ fontFamily: PP }}
                >
                  ICD-10 Diagnosis Codes
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      code: "R07.9",
                      desc: "Chest Pain, Unspecified",
                      status: "primary",
                    },
                    {
                      code: "I10",
                      desc: "Essential (primary) Hypertension",
                      status: "secondary",
                    },
                    {
                      code: "E11",
                      desc: "Type 2 Diabetes Mellitus",
                      status: "secondary",
                    },
                  ].map((d) => (
                    <div
                      key={d.code}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-slate-50"
                    >
                      <span className="font-mono text-xs font-bold text-[#0D47A1]">
                        {d.code}
                      </span>
                      <span
                        className="text-xs text-slate-700 flex-1"
                        style={{ fontFamily: RB }}
                      >
                        {d.desc}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === "primary" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}
                        style={{ fontFamily: PP }}
                      >
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  <button
                    className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium mt-1 hover:underline"
                    style={{ fontFamily: RB }}
                  >
                    <Plus size={11} /> Add Diagnosis Code
                  </button>
                </div>
              </Card>
            </div>
          )}

          {tab === "prescription" && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div
                    className="text-sm font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Current Medications
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium hover:underline"
                    style={{ fontFamily: RB }}
                  >
                    <Plus size={11} /> Add Medication
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {MEDICATIONS.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#009688]/10 flex items-center justify-center shrink-0">
                        <Pill size={14} className="text-[#009688]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-semibold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {m.name} {m.dose}
                        </div>
                        <div
                          className="text-xs text-slate-500 mt-0.5"
                          style={{ fontFamily: RB }}
                        >
                          {m.freq} · {m.route}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === "prn" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}
                          style={{ fontFamily: PP }}
                        >
                          {m.status.toUpperCase()}
                        </span>
                        <div
                          className="text-[10px] text-slate-400 mt-1"
                          style={{ fontFamily: RB }}
                        >
                          Refill: {m.refill}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#EF4444] transition-all p-1">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div
                  className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3"
                  style={{ fontFamily: PP }}
                >
                  Add New Medication
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Medication Name",
                    "Dose",
                    "Frequency",
                    "Route",
                    "Duration",
                    "Instructions",
                  ].map((f) => (
                    <div key={f}>
                      <label
                        className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block"
                        style={{ fontFamily: PP }}
                      >
                        {f}
                      </label>
                      <input
                        placeholder={f}
                        className="w-full px-3 py-2 text-xs border border-gray-100 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Plus size={12} /> Add to Prescription
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Download size={12} /> Print & Sign
                  </button>
                </div>
              </Card>
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <div
                    className="text-sm font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Visit History
                  </div>
                  <div
                    className="text-xs text-slate-400 mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    Previous consultations and encounters
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    {
                      date: "12 Jun 2026",
                      complaint: "Hypertension Follow-up",
                      doctor: "Dr. A. Mehta",
                      outcome: "Medication adjusted",
                    },
                    {
                      date: "04 Apr 2026",
                      complaint: "Diabetes Review",
                      doctor: "Dr. P. Sharma",
                      outcome: "HbA1c improved — 7.2%",
                    },
                    {
                      date: "18 Jan 2026",
                      complaint: "Annual Health Check",
                      doctor: "Dr. A. Mehta",
                      outcome: "All normal, lipids reviewed",
                    },
                    {
                      date: "22 Oct 2025",
                      complaint: "Chest Discomfort",
                      doctor: "Dr. A. Mehta",
                      outcome: "ECG normal, advised lifestyle mod",
                    },
                  ].map((v, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-[#0D47A1]" />
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm font-semibold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {v.complaint}
                        </div>
                        <div
                          className="text-xs text-slate-500 mt-0.5"
                          style={{ fontFamily: RB }}
                        >
                          {v.doctor} · {v.date}
                        </div>
                        <div
                          className="text-xs text-slate-400 mt-1 italic"
                          style={{ fontFamily: RB }}
                        >
                          Outcome: {v.outcome}
                        </div>
                      </div>
                      <button
                        className="text-xs text-[#0D47A1] font-medium hover:underline shrink-0 mt-1"
                        style={{ fontFamily: RB }}
                      >
                        View <ChevronRight size={11} className="inline" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
