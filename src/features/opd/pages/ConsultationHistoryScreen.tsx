import { useState, useMemo } from "react";
import {
  Stethoscope,
  User,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  ChevronDown,
  Printer,
  Download,
  Search,
  RotateCcw,
  Plus,
  Eye,
  ArrowLeft,
  ChevronUp,
  X,
} from "lucide-react";

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface TimelineConsultationItem {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  visitType: "First Visit" | "Follow-up" | "Walk-In";
  status: "Completed" | "In Progress" | "Cancelled" | "Follow-up Scheduled";
  chiefComplaint: string;
  diagnosis: string;
  icdCode: string;
  medicinesCount: number;
  investigationsCount: number;
  followupStatus: string;
  nextFollowupDate?: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    bmi: string;
  };
  medicines: { name: string; dosage: string; freq: string; duration: string }[];
  investigations: string[];
  examinationFindings: string;
  clinicalNotes: string;
}

const HISTORICAL_CONSULTATIONS: TimelineConsultationItem[] = [
  {
    id: "CNS-1001",
    date: "24 Jul 2026",
    time: "09:00 AM",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    visitType: "First Visit",
    status: "Completed",
    chiefComplaint:
      "Severe chest tightness radiating to left shoulder with acute dyspnea",
    diagnosis: "Angina Pectoris, unspecified",
    icdCode: "I20.9",
    medicinesCount: 2,
    investigationsCount: 3,
    followupStatus: "Scheduled for 31 Jul 2026",
    nextFollowupDate: "31 Jul 2026",
    vitals: {
      bp: "145/92",
      pulse: "88 bpm",
      temp: "37.2°C",
      spo2: "97%",
      bmi: "25.5 kg/m²",
    },
    medicines: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        freq: "Once Daily",
        duration: "30 Days",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        freq: "Twice Daily",
        duration: "30 Days",
      },
    ],
    investigations: ["CBC", "ECG", "2D Echocardiogram & Trop-I STAT"],
    examinationFindings:
      "Chest wall non-tender. Normal S1/S2 heart sounds. Bilateral vesicular breath sounds.",
    clinicalNotes:
      "High cardiovascular risk profile. Low sodium diet & rest recommended.",
  },
  {
    id: "CNS-0982",
    date: "12 Jun 2026",
    time: "11:15 AM",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    visitType: "Follow-up",
    status: "Completed",
    chiefComplaint: "Routine hypertension follow-up & BP check",
    diagnosis: "Essential (primary) Hypertension",
    icdCode: "I10",
    medicinesCount: 3,
    investigationsCount: 1,
    followupStatus: "Completed",
    vitals: {
      bp: "138/86",
      pulse: "76 bpm",
      temp: "36.8°C",
      spo2: "98%",
      bmi: "25.7 kg/m²",
    },
    medicines: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        freq: "Once Daily",
        duration: "30 Days",
      },
      {
        name: "Aspirin",
        dosage: "75mg",
        freq: "Once Daily",
        duration: "30 Days",
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        freq: "Once Nightly",
        duration: "30 Days",
      },
    ],
    investigations: ["Lipid Profile"],
    examinationFindings: "No peripheral edema. Heart sounds clear.",
    clinicalNotes:
      "BP response satisfactory. Continue current anti-hypertensive regimen.",
  },
  {
    id: "CNS-0941",
    date: "15 Apr 2026",
    time: "10:30 AM",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    visitType: "Walk-In",
    status: "Completed",
    chiefComplaint: "Mild exertional palpitations & fatigue",
    diagnosis: "Fatigue & Malaise, unspecified",
    icdCode: "R53.83",
    medicinesCount: 2,
    investigationsCount: 2,
    followupStatus: "Completed",
    vitals: {
      bp: "130/82",
      pulse: "82 bpm",
      temp: "36.6°C",
      spo2: "99%",
      bmi: "25.8 kg/m²",
    },
    medicines: [
      {
        name: "Multivitamin Tab",
        dosage: "1 Tab",
        freq: "Once Daily",
        duration: "15 Days",
      },
      {
        name: "Magnesium Supplement",
        dosage: "250mg",
        freq: "Once Nightly",
        duration: "15 Days",
      },
    ],
    investigations: ["Complete Blood Count (CBC)", "Thyroid Panel (TSH)"],
    examinationFindings:
      "General physical examination normal. Thyroid non-palpable.",
    clinicalNotes:
      "Hydration advised. Reassure patient regarding stress-related symptoms.",
  },
  {
    id: "CNS-0890",
    date: "08 Feb 2026",
    time: "09:45 AM",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    visitType: "First Visit",
    status: "Completed",
    chiefComplaint: "Initial cardiac risk assessment & baseline screening",
    diagnosis: "Borderline Hypertension & Hyperlipidemia",
    icdCode: "I10 / E78.5",
    medicinesCount: 1,
    investigationsCount: 3,
    followupStatus: "Completed",
    vitals: {
      bp: "142/90",
      pulse: "84 bpm",
      temp: "36.7°C",
      spo2: "98%",
      bmi: "26.0 kg/m²",
    },
    medicines: [
      {
        name: "Amlodipine",
        dosage: "2.5mg",
        freq: "Once Daily",
        duration: "30 Days",
      },
    ],
    investigations: ["ECG 12-Lead", "Fasting Blood Sugar", "Lipid Panel"],
    examinationFindings: "Mild systolic elevation. Heart sounds normal.",
    clinicalNotes:
      "Initiate dietary salt restriction and light cardio exercise.",
  },
];

export function ConsultationHistoryScreen({
  role = "doctor",
  onBack,
  onStartNewConsultation,
  onViewFullConsultation,
  onPatientSelect,
}: {
  patientId?: string;
  role?: "super-admin" | "admin" | "doctor" | "nurse" | "receptionist" | "accountant" | "patient";
  onBack?: () => void;
  onStartNewConsultation?: () => void;
  onViewFullConsultation?: (consultationId: string) => void;
  onPatientSelect?: (patientId: string) => void;
}) {
  const isReadOnly = role === "admin" || role === "nurse" || role === "super-admin";

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterVisitType, setFilterVisitType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Expanded Timeline Cards State
  const [expandedCardIds, setExpandedCardIds] = useState<
    Record<string, boolean>
  >({
    "CNS-1001": true, // default first expanded
  });

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Timeline
  const filteredTimeline = useMemo(() => {
    return HISTORICAL_CONSULTATIONS.filter((item) => {
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchDx = item.diagnosis.toLowerCase().includes(q);
        const matchDate = item.date.toLowerCase().includes(q);
        const matchMeds = item.medicines.some((m) =>
          m.name.toLowerCase().includes(q),
        );
        const matchDoc = item.doctor.toLowerCase().includes(q);
        if (!matchId && !matchDx && !matchDate && !matchMeds && !matchDoc)
          return false;
      }
      return true;
    });
  }, [
    searchQuery,
    filterDoctor,
    filterDepartment,
    filterVisitType,
    filterStatus,
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDoctor("All");
    setFilterDepartment("All");
    setFilterVisitType("All");
    setFilterStatus("All");
  };

  // Breadcrumb label based on role
  const breadcrumbRoleLabel =
    role === "admin" ? "Hospital Admin" : role === "nurse" ? "Nurse" : "Doctor";

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
              style={{ fontFamily: RB }}
            >
              <span>{breadcrumbRoleLabel}</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>OPD Consultation</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">
                Consultation History
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Consultation History
              </h1>
              {isReadOnly && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0D47A1] border border-blue-200"
                  style={{ fontFamily: PP }}
                >
                  {role === "admin"
                    ? "Hospital Admin (Read Only)"
                    : "Nurse (Read Only)"}
                </span>
              )}
            </div>
            <p
              className="text-sm text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              {isReadOnly
                ? "Review patient's previous consultation records."
                : "Review previous consultations, diagnoses and treatments."}
            </p>
          </div>

          <div className="flex items-center gap-2">
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

            {isReadOnly ? (
              <>
                <button
                  onClick={() => alert("Printing Medical History")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Printer size={15} />
                  Print Medical History
                </button>
                <button
                  onClick={() => alert("Exporting Consultation History PDF")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} />
                  Download PDF
                </button>
              </>
            ) : (
              <button
                onClick={() => onStartNewConsultation?.()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Plus size={15} />
                Start New Consultation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── STICKY PATIENT SUMMARY BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div
              className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0"
              style={{ fontFamily: PP }}
            >
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Sarah Mitchell
                </span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                  MRN-2024-001
                </span>
                <span
                  className="text-[11px] font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full"
                  style={{ fontFamily: PP }}
                >
                  {HISTORICAL_CONSULTATIONS.length} Total Visits
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                <span>34 yrs / Female</span>
                <span>•</span>
                <span>
                  Blood: <strong className="text-[#111827]">A+</strong>
                </span>
                <span>•</span>
                <span>
                  Last Visit:{" "}
                  <strong className="text-[#111827]">24 Jul 2026</strong>
                </span>
                <span>•</span>
                <span>
                  Primary Doctor:{" "}
                  <strong className="text-[#0D47A1]">Dr. Arjun Mehta</strong>
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0"
              style={{ fontFamily: PP }}
            >
              <AlertCircle size={13} />
              <span>Allergies: Penicillin, Aspirin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPatientSelect?.("MRN-2024-001")}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Patient Profile
            </button>
            {!isReadOnly && (
              <button
                onClick={() => onStartNewConsultation?.()}
                className="px-3 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors"
                style={{ fontFamily: PP }}
              >
                Start New Consultation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <div className="p-6 space-y-6">
        {/* SUMMARY KPI CARDS (5 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Total Consultations
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <RotateCcw size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                4
              </div>
              <div
                className="text-[11px] text-slate-500 mt-0.5"
                style={{ fontFamily: RB }}
              >
                Recorded in system
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Completed Consultations
              </span>
              <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                4
              </div>
              <div
                className="text-[11px] text-emerald-600 font-medium mt-0.5"
                style={{ fontFamily: RB }}
              >
                100% Verified Records
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Follow-up Visits
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                2
              </div>
              <div
                className="text-[11px] text-purple-600 font-medium mt-0.5"
                style={{ fontFamily: RB }}
              >
                1 Scheduled Next
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Last Consultation
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                24 Jul 2026
              </div>
              <div
                className="text-[11px] text-slate-500 mt-0.5"
                style={{ fontFamily: RB }}
              >
                Dr. Arjun Mehta
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Total Prescriptions
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Pill size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                3
              </div>
              <div
                className="text-[11px] text-slate-500 mt-0.5"
                style={{ fontFamily: RB }}
              >
                Amlodipine, Metformin
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Consultation ID, Diagnosis, Doctor or Date..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Doctor
              </label>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                style={{ fontFamily: RB }}
              >
                <option value="All">All Doctors</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
              </select>
            </div>

            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                style={{ fontFamily: RB }}
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Visit Type
              </label>
              <select
                value={filterVisitType}
                onChange={(e) => setFilterVisitType(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                style={{ fontFamily: RB }}
              >
                <option value="All">All Visit Types</option>
                <option value="First Visit">First Visit</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Walk-In">Walk-In</option>
              </select>
            </div>

            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                style={{ fontFamily: RB }}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Showing{" "}
              <span className="font-semibold text-[#111827]">
                {filteredTimeline.length}
              </span>{" "}
              historical consultations
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          </div>
        </div>

        {/* 2-COLUMN ENTERPRISE TIMELINE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT WORKSPACE — EXPANDABLE CLINICAL TIMELINE (70% on desktop: col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {filteredTimeline.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-[#E5E7EB] text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Stethoscope size={28} />
                </div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  No consultation history available.
                </h3>
                <p
                  className="text-xs text-slate-500 max-w-sm mt-1 mb-4"
                  style={{ fontFamily: RB }}
                >
                  No previous consultation records match your selected filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#0D47A1] text-white text-xs font-semibold rounded-xl hover:bg-[#0a3880]"
                  style={{ fontFamily: PP }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {filteredTimeline.map((item) => {
                  const isExpanded = expandedCardIds[item.id];
                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-[31px] top-4 w-5 h-5 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-[#F1F5F9] shadow-sm">
                        <CheckCircle2 size={12} />
                      </div>

                      {/* Expandable Timeline Card */}
                      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all">
                        {/* Card Header Bar */}
                        <div
                          onClick={() => toggleExpand(item.id)}
                          className="p-5 bg-slate-50/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 border-b border-gray-100"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="font-bold text-sm text-[#111827]"
                                style={{ fontFamily: PP }}
                              >
                                {item.date}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                ({item.time})
                              </span>
                              <span className="font-mono text-xs bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                                {item.id}
                              </span>
                              <span
                                className="px-2 py-0.5 bg-green-50 text-[#66BB6A] border border-green-200 rounded-full text-[10px] font-bold"
                                style={{ fontFamily: PP }}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div
                              className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]"
                              style={{ fontFamily: RB }}
                            >
                              <span>
                                Doctor:{" "}
                                <strong className="text-[#111827]">
                                  {item.doctor}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Dept:{" "}
                                <strong className="text-slate-700">
                                  {item.department}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Type:{" "}
                                <strong className="text-slate-700">
                                  {item.visitType}
                                </strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div
                              className="text-right text-xs hidden md:block"
                              style={{ fontFamily: RB }}
                            >
                              <div className="font-bold text-[#0D47A1]">
                                {item.diagnosis}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {item.medicinesCount} Meds ·{" "}
                                {item.investigationsCount} Tests
                              </div>
                            </div>

                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 bg-white border border-gray-200">
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Summary Line when collapsed */}
                        {!isExpanded && (
                          <div
                            className="p-4 text-xs space-y-1 bg-white"
                            style={{ fontFamily: RB }}
                          >
                            <div>
                              <strong className="text-[#64748B]">
                                Chief Complaint:
                              </strong>{" "}
                              <span className="text-slate-800">
                                "{item.chiefComplaint}"
                              </span>
                            </div>
                            <div>
                              <strong className="text-[#64748B]">
                                Diagnosis:
                              </strong>{" "}
                              <span className="font-bold text-[#0D47A1]">
                                {item.diagnosis}
                              </span>{" "}
                              ({item.icdCode})
                            </div>
                          </div>
                        )}

                        {/* EXPANDED SECTION CARDS */}
                        {isExpanded && (
                          <div
                            className="p-5 space-y-5 bg-white border-t border-gray-100 text-xs"
                            style={{ fontFamily: RB }}
                          >
                            {/* Section: Complaint & Vitals */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                <span
                                  className="text-[10px] font-bold text-slate-400 uppercase"
                                  style={{ fontFamily: PP }}
                                >
                                  Chief Complaint
                                </span>
                                <p className="font-semibold text-slate-800">
                                  "{item.chiefComplaint}"
                                </p>
                              </div>
                              <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-1">
                                <span
                                  className="text-[10px] font-bold text-[#009688] uppercase"
                                  style={{ fontFamily: PP }}
                                >
                                  Patient Vitals
                                </span>
                                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-slate-700">
                                  <span>BP: {item.vitals.bp}</span>
                                  <span>Pulse: {item.vitals.pulse}</span>
                                  <span>Temp: {item.vitals.temp}</span>
                                  <span>SpO₂: {item.vitals.spo2}</span>
                                </div>
                              </div>
                            </div>

                            {/* Section: Examination & Diagnosis */}
                            <div className="space-y-2">
                              <span
                                className="text-[10px] font-bold text-slate-400 uppercase"
                                style={{ fontFamily: PP }}
                              >
                                Examination & Diagnosis
                              </span>
                              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                <p>
                                  <strong className="text-slate-700">
                                    Findings:
                                  </strong>{" "}
                                  {item.examinationFindings}
                                </p>
                                <p>
                                  <strong className="text-slate-700">
                                    Final Diagnosis:
                                  </strong>{" "}
                                  <strong className="text-[#0D47A1]">
                                    {item.diagnosis}
                                  </strong>{" "}
                                  ({item.icdCode})
                                </p>
                              </div>
                            </div>

                            {/* Section: Prescription Summary */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-[10px] font-bold text-slate-400 uppercase"
                                  style={{ fontFamily: PP }}
                                >
                                  Prescription Summary
                                </span>
                                <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded">
                                  {item.medicines.length} Prescribed
                                </span>
                              </div>
                              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                <table className="w-full text-left text-[11px]">
                                  <thead
                                    className="bg-slate-50 text-slate-500 font-bold"
                                    style={{ fontFamily: PP }}
                                  >
                                    <tr>
                                      <th className="py-2 px-3">Medicine</th>
                                      <th className="py-2 px-3">Dosage</th>
                                      <th className="py-2 px-3">Frequency</th>
                                      <th className="py-2 px-3">Duration</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    {item.medicines.map((m, idx) => (
                                      <tr key={idx}>
                                        <td
                                          className="py-1.5 px-3 font-bold text-[#111827]"
                                          style={{ fontFamily: PP }}
                                        >
                                          {m.name}
                                        </td>
                                        <td className="py-1.5 px-3">
                                          {m.dosage}
                                        </td>
                                        <td className="py-1.5 px-3 text-blue-700">
                                          {m.freq}
                                        </td>
                                        <td className="py-1.5 px-3">
                                          {m.duration}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Section: Investigations & Notes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span
                                  className="text-[10px] font-bold text-slate-400 uppercase"
                                  style={{ fontFamily: PP }}
                                >
                                  Recommended Investigations
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {item.investigations.map((inv, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded font-semibold text-[11px]"
                                      style={{ fontFamily: PP }}
                                    >
                                      {inv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span
                                  className="text-[10px] font-bold text-slate-400 uppercase"
                                  style={{ fontFamily: PP }}
                                >
                                  Follow-up Details
                                </span>
                                <p className="text-[#0D47A1] font-semibold mt-1 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                                  {item.followupStatus}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  alert(`Prescription printed for ${item.id}`)
                                }
                                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#009688] font-semibold hover:bg-teal-50 transition-colors flex items-center gap-1.5 text-xs"
                                style={{ fontFamily: PP }}
                              >
                                <Printer size={14} />
                                Print Prescription
                              </button>
                              <button
                                onClick={() =>
                                  onViewFullConsultation?.(item.id)
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white font-semibold hover:bg-[#0a3880] transition-colors flex items-center gap-1.5 text-xs"
                                style={{ fontFamily: PP }}
                              >
                                <Eye size={14} />
                                View Full Consultation
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT CONTEXT PANEL (30% on desktop: col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* CARD 1: PATIENT SNAPSHOT */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Patient Snapshot
                </h3>
                <span className="text-[10px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base"
                  style={{ fontFamily: PP }}
                >
                  SM
                </div>
                <div>
                  <div
                    className="font-bold text-sm text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Sarah Mitchell
                  </div>
                  <div
                    className="text-xs text-slate-500"
                    style={{ fontFamily: RB }}
                  >
                    34 yrs · Female · Blood A+
                  </div>
                </div>
              </div>

              <div
                className="space-y-2 text-xs pt-2 border-t border-gray-100"
                style={{ fontFamily: RB }}
              >
                <div className="flex justify-between text-slate-600">
                  <span>Chronic Conditions:</span>
                  <span className="font-bold text-slate-800">
                    Hypertension Stage 1
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Known Allergies:</span>
                  <span className="font-bold text-red-600">
                    Penicillin, Aspirin
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: CONSULTATION STATISTICS */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Consultation Statistics
              </h3>

              <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-slate-500">Total Visits:</span>
                  <span
                    className="font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    4 Visits
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-slate-500">
                    Completed Consultations:
                  </span>
                  <span
                    className="font-bold text-[#66BB6A]"
                    style={{ fontFamily: PP }}
                  >
                    4 Completed
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-slate-500">Follow-up Visits:</span>
                  <span
                    className="font-bold text-purple-600"
                    style={{ fontFamily: PP }}
                  >
                    2 Visits
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">
                    Avg Consultation Interval:
                  </span>
                  <span
                    className="font-bold text-[#0D47A1]"
                    style={{ fontFamily: PP }}
                  >
                    28 Days
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: RECENT DIAGNOSES (LAST 5) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Recent Diagnoses
              </h3>

              <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
                {[
                  {
                    dx: "Angina Pectoris, unspecified",
                    date: "24 Jul 2026",
                    icd: "I20.9",
                  },
                  {
                    dx: "Essential (primary) Hypertension",
                    date: "12 Jun 2026",
                    icd: "I10",
                  },
                  {
                    dx: "Fatigue & Malaise, unspecified",
                    date: "15 Apr 2026",
                    icd: "R53.83",
                  },
                  {
                    dx: "Borderline Hypertension & Hyperlipidemia",
                    date: "08 Feb 2026",
                    icd: "I10 / E78.5",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded-xl space-y-0.5 border border-slate-100"
                  >
                    <div
                      className="font-bold text-slate-800"
                      style={{ fontFamily: PP }}
                    >
                      {item.dx}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>ICD: {item.icd}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 4: RECENT PRESCRIPTIONS (LAST 5) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Recent Prescriptions
              </h3>

              <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
                {[
                  {
                    med: "Amlodipine 5mg",
                    freq: "Once Daily",
                    date: "24 Jul 2026",
                  },
                  {
                    med: "Metformin 500mg",
                    freq: "Twice Daily",
                    date: "24 Jul 2026",
                  },
                  {
                    med: "Aspirin 75mg",
                    freq: "Once Daily",
                    date: "12 Jun 2026",
                  },
                  {
                    med: "Atorvastatin 20mg",
                    freq: "Once Nightly",
                    date: "12 Jun 2026",
                  },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg text-xs"
                  >
                    <div>
                      <div
                        className="font-bold text-slate-800"
                        style={{ fontFamily: PP }}
                      >
                        {m.med}
                      </div>
                      <div className="text-[10px] text-slate-500">{m.freq}</div>
                    </div>
                    <span className="text-[10px] text-[#0D47A1] font-mono">
                      {m.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 5: QUICK ACTIONS (RBAC SCOPED) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
              <h3
                className="text-sm font-bold text-[#111827] mb-2"
                style={{ fontFamily: PP }}
              >
                Quick Actions
              </h3>

              {role === "admin" && (
                <>
                  <button
                    onClick={() => alert("Printing Medical History")}
                    className="w-full py-2.5 px-4 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={15} />
                    Print Medical History
                  </button>
                  <button
                    onClick={() => alert("Downloading PDF Report")}
                    className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Download size={15} />
                    Download PDF
                  </button>
                  <button
                    onClick={() => onPatientSelect?.("MRN-2024-001")}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <User size={15} />
                    View Patient Profile
                  </button>
                </>
              )}

              {role === "nurse" && (
                <>
                  <button
                    onClick={() => onPatientSelect?.("MRN-2024-001")}
                    className="w-full py-2.5 px-4 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <User size={15} />
                    View Patient Profile
                  </button>
                  <button
                    onClick={() => alert("Printing Medical History")}
                    className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={15} />
                    Print Medical History
                  </button>
                </>
              )}

              {role === "doctor" && (
                <>
                  <button
                    onClick={() => onStartNewConsultation?.()}
                    className="w-full py-2.5 px-4 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Plus size={15} />
                    Start New Consultation
                  </button>
                  <button
                    onClick={() =>
                      alert(
                        `Medical history document printed for Sarah Mitchell`,
                      )
                    }
                    className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={15} />
                    Print Medical History
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Consultation History for{" "}
          <strong className="text-[#111827]">Sarah Mitchell</strong>{" "}
          (MRN-2024-001)
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-[#E5E7EB] text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
              style={{ fontFamily: PP }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => alert(`Medical History printed for Sarah Mitchell`)}
            className="px-4 py-2 border border-[#E5E7EB] bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} className="text-[#009688]" />
            Print Medical History
          </button>
          <button
            onClick={() =>
              alert(`Exporting Consultation History PDF for Sarah Mitchell`)
            }
            className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Export Consultation History PDF
          </button>
        </div>
      </div>
    </div>
  );
}
