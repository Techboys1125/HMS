import { useState, useMemo } from "react";
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  RotateCcw,
  Plus,
  Eye,
  MoreVertical,
  Printer,
  Activity,
  ArrowUpRight,
  X,
} from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import type { ConsultationRecord } from "../types/consultation";

// Reusable Components
import { ConsultationHeader } from "../components/ConsultationHeader";
import { ConsultationToolbar } from "../components/ConsultationToolbar";
import { ConsultationTabs } from "../components/ConsultationTabs";
import { ConsultationStatusBadge } from "../components/ConsultationStatusBadge";

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
}

// Keep standard mock as fallback to satisfy list if backend returns empty list or during initialization
const FALLBACK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: "CNS-1001",
    tokenNo: "TK-01",
    patientName: "Sarah Mitchell",
    mrn: "MRN-2024-001",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:00 AM",
    visitType: "First Visit",
    status: "In Progress",
    chiefComplaint: "Chest pain radiating to left arm with diaphoresis",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
    vitals: { bp: "145/92", pulse: "88 bpm", temp: "37.2°C", spo2: "97%" },
  },
  {
    id: "CNS-1002",
    tokenNo: "TK-02",
    patientName: "James Thornton",
    mrn: "MRN-2024-002",
    age: 67,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:30 AM",
    visitType: "Follow-up",
    status: "Waiting",
    chiefComplaint: "Post-angioplasty routine checkup & medication review",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
    vitals: { bp: "130/82", pulse: "74 bpm", temp: "36.8°C", spo2: "98%" },
  },
  {
    id: "CNS-1003",
    tokenNo: "TK-03",
    patientName: "Emma Reyes",
    mrn: "MRN-2024-003",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "10:00 AM",
    visitType: "Walk-In",
    status: "Waiting",
    chiefComplaint: "Acute palpitation episodes during moderate exercise",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
    vitals: { bp: "124/78", pulse: "92 bpm", temp: "36.6°C", spo2: "99%" },
  },
  {
    id: "CNS-1004",
    tokenNo: "TK-04",
    patientName: "Robert Chen",
    mrn: "MRN-2024-004",
    age: 52,
    gender: "Male",
    phone: "+1 (555) 567-8901",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "08:30 AM",
    visitType: "Follow-up",
    status: "Completed",
    chiefComplaint: "Hypertension evaluation and ECG review",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
    vitals: { bp: "128/84", pulse: "70 bpm", temp: "36.7°C", spo2: "98%" },
  },
];

export function ConsultationManagementPage({
  onStartConsultation,
  onViewDetails,
  onViewHistory,
  onNavigateAppointments,
}: {
  onStartConsultation?: (consultationId?: string) => void;
  onViewDetails?: (consultationId: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onNavigateAppointments?: () => void;
}) {
  // Roles & Permissions check
  const { can, role } = usePermissions();
  const { callPatient } = useConsultation();

  // --- States ---
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(
    FALLBACK_CONSULTATIONS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDoctor, setFilterDoctor] = useState("Dr. Arjun Mehta");
  const [filterDepartment, setFilterDepartment] = useState("Cardiology");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVisitType, setFilterVisitType] = useState("All");

  // Drawer / Modals state
  const [selectedRecord, setSelectedRecord] =
    useState<ConsultationRecord | null>(null);
  const [activeModal, setActiveModal] = useState<
    "details" | "history" | "print" | null
  >(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // --- Filtering Logic ---
  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      // Tab filter
      if (activeTab !== "All" && item.status !== activeTab) return false;
      // Status filter
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
      // Visit Type filter
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      // Department filter
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      // Doctor filter
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchMrn = item.mrn.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchPhone = item.phone.toLowerCase().includes(q);
        if (!matchName && !matchMrn && !matchId && !matchPhone) return false;
      }

      return true;
    });
  }, [
    consultations,
    activeTab,
    filterStatus,
    filterVisitType,
    filterDepartment,
    filterDoctor,
    searchQuery,
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDate(new Date().toISOString().split("T")[0]);
    setFilterDoctor("Dr. Arjun Mehta");
    setFilterDepartment("Cardiology");
    setFilterStatus("All");
    setFilterVisitType("All");
    setActiveTab("All");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  // Tab count indicators
  const tabCounts = useMemo(() => {
    return {
      All: consultations.length,
      Waiting: consultations.filter((c) => c.status === "Waiting").length,
      "In Progress": consultations.filter((c) => c.status === "In Progress")
        .length,
      Completed: consultations.filter((c) => c.status === "Completed").length,
      "Follow-up Scheduled": consultations.filter(
        (c) => c.status === "Follow-up Scheduled",
      ).length,
      Cancelled: consultations.filter((c) => c.status === "Cancelled").length,
    };
  }, [consultations]);

  // Current Patient & Next Patient for Right Context Panel
  const currentPatient = consultations.find((c) => c.status === "In Progress");
  const nextPatient = consultations.find((c) => c.status === "Waiting");

  // Trigger call patient
  const handleCallPatient = async (record: ConsultationRecord) => {
    await callPatient(record.id);
    setConsultations((prev) =>
      prev.map((c) => (c.id === record.id ? { ...c, status: "Called" } : c)),
    );
  };

  // Start Consultation flow
  const handleStartConsultation = async (record?: ConsultationRecord) => {
    if (!record) return;
    try {
      setIsLoading(true);
      // Calls start appointment, creates encounter, and initializes draft consultation

      setConsultations((prev) =>
        prev.map((c) =>
          c.id === record.id ? { ...c, status: "In Progress" } : c,
        ),
      );

      if (onStartConsultation) {
        onStartConsultation(record.id);
      }
    } catch (err) {
      console.error("Failed to start consultation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans">
      {/* HEADER */}
      <ConsultationHeader
        roleLabel={role === "DOCTOR" ? "Doctor" : "Receptionist"}
        pageTitle="OPD Consultation Management"
        subtitle="Manage outpatient consultations and patient visits efficiently."
        breadcrumbs={[]}
        actions={
          <>
            <button
              onClick={() => onNavigateAppointments?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Clock size={16} className="text-[#0D47A1]" />
              Today's Queue
            </button>
            {can("CONSULTATION_START") && (
              <button
                onClick={() =>
                  handleStartConsultation(nextPatient || currentPatient)
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Plus size={16} />+ Start Consultation
              </button>
            )}
          </>
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* SUMMARY KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Today's Consultations
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <Stethoscope size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {consultations.length}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <ArrowUpRight size={12} />
                <span>+12% vs yesterday</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Waiting Patients
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts.Waiting}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-amber-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <Activity size={12} />
                <span>Avg wait: 14 mins</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                In Progress
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts["In Progress"]}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-[#009688] mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
                <span>Active Sessions</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Completed
              </span>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts.Completed}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <ArrowUpRight size={12} />
                <span>94% efficiency rate</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Follow-up Cases
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts["Follow-up Scheduled"]}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-purple-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <Plus size={12} />
                <span>Scheduled this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* TOOLBAR */}
            <ConsultationToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterDate={filterDate}
              onDateChange={setFilterDate}
              filterDoctor={filterDoctor}
              onDoctorChange={setFilterDoctor}
              filterDepartment={filterDepartment}
              onDepartmentChange={setFilterDepartment}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
              filterVisitType={filterVisitType}
              onVisitTypeChange={setFilterVisitType}
              onReset={handleResetFilters}
              onApply={handleRefresh}
              resultCount={filteredConsultations.length}
            />

            {/* TABS */}
            <ConsultationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: "All", label: "All", count: tabCounts.All },
                { id: "Waiting", label: "Waiting", count: tabCounts.Waiting },
                {
                  id: "In Progress",
                  label: "In Progress",
                  count: tabCounts["In Progress"],
                },
                {
                  id: "Completed",
                  label: "Completed",
                  count: tabCounts.Completed,
                },
                {
                  id: "Follow-up Scheduled",
                  label: "Follow-up Scheduled",
                  count: tabCounts["Follow-up Scheduled"],
                },
                {
                  id: "Cancelled",
                  label: "Cancelled",
                  count: tabCounts.Cancelled,
                },
              ]}
            />

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-12 bg-slate-50 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ) : filteredConsultations.length === 0 ? (
                <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Stethoscope size={32} />
                  </div>
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    No consultations found
                  </h3>
                  <p
                    className="text-xs text-[#64748B] max-w-sm mt-1 mb-6"
                    style={{ fontFamily: RB }}
                  >
                    There are no matching consultation records for the selected
                    filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
                          style={{ fontFamily: PP }}
                        >
                          <th className="py-3.5 px-4">Consultation ID</th>
                          <th className="py-3.5 px-4">Patient</th>
                          <th className="py-3.5 px-4">MRN</th>
                          <th className="py-3.5 px-4">Age / Gender</th>
                          <th className="py-3.5 px-4">Doctor</th>
                          <th className="py-3.5 px-4">Department</th>
                          <th className="py-3.5 px-4">Appointment Time</th>
                          <th className="py-3.5 px-4">Visit Type</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-[#E5E7EB] text-xs"
                        style={{ fontFamily: RB }}
                      >
                        {filteredConsultations.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                              <div className="flex items-center gap-1.5">
                                <span>{item.id}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                                  {item.tokenNo}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={item.patientName} size="sm" />
                                <div>
                                  <div
                                    className="font-bold text-[#111827]"
                                    style={{ fontFamily: PP }}
                                  >
                                    {item.patientName}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {item.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {item.mrn}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">
                              {item.age} yrs / {item.gender}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {item.doctor}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {item.department}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {item.appointmentTime}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                                  item.visitType === "First Visit"
                                    ? "bg-blue-50 text-blue-700"
                                    : item.visitType === "Walk-In"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-purple-50 text-purple-700"
                                }`}
                                style={{ fontFamily: PP }}
                              >
                                {item.visitType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <ConsultationStatusBadge status={item.status} />
                            </td>
                            <td className="py-3.5 px-4 text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                {can("CONSULTATION_START") &&
                                  item.status !== "Completed" && (
                                    <button
                                      onClick={() =>
                                        handleStartConsultation(item)
                                      }
                                      className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors"
                                      style={{ fontFamily: PP }}
                                    >
                                      Open Consultation
                                    </button>
                                  )}

                                {item.status === "Waiting" && (
                                  <button
                                    onClick={() => handleCallPatient(item)}
                                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                    style={{ fontFamily: PP }}
                                  >
                                    Call
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if (onViewDetails) {
                                      onViewDetails(item.id);
                                    } else {
                                      setSelectedRecord(item);
                                      setActiveModal("details");
                                    }
                                  }}
                                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={15} />
                                </button>

                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={() =>
                                      setOpenDropdownId(
                                        openDropdownId === item.id
                                          ? null
                                          : item.id,
                                      )
                                    }
                                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  >
                                    <MoreVertical size={15} />
                                  </button>

                                  {openDropdownId === item.id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 text-left">
                                      <button
                                        onClick={() => {
                                          if (onViewHistory) {
                                            onViewHistory(item.mrn);
                                          } else {
                                            setSelectedRecord(item);
                                            setActiveModal("history");
                                          }
                                          setOpenDropdownId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        style={{ fontFamily: RB }}
                                      >
                                        <RotateCcw
                                          size={14}
                                          className="text-[#0D47A1]"
                                        />
                                        View Consultation History
                                      </button>
                                      {can("CONSULTATION_PRINT") && (
                                        <button
                                          onClick={() => {
                                            setSelectedRecord(item);
                                            setActiveModal("print");
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          style={{ fontFamily: RB }}
                                        >
                                          <Printer
                                            size={14}
                                            className="text-[#009688]"
                                          />
                                          Print Consultation Summary
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    <div>
                      Showing{" "}
                      <span className="font-semibold text-[#111827]">1</span> to{" "}
                      <span className="font-semibold text-[#111827]">
                        {filteredConsultations.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#111827]">
                        {consultations.length}
                      </span>{" "}
                      consultations
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">
                        1
                      </button>
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3
                  className="text-sm font-bold text-[#111827] flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Activity size={16} className="text-[#009688]" />
                  Current Queue
                </h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#009688]"
                  style={{ fontFamily: PP }}
                >
                  Live
                </span>
              </div>

              <div>
                <div
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2"
                  style={{ fontFamily: PP }}
                >
                  Current Patient
                </div>
                {currentPatient ? (
                  <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold text-xs text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {currentPatient.patientName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">
                        {currentPatient.tokenNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {currentPatient.mrn} · {currentPatient.age}y /{" "}
                      {currentPatient.gender}
                    </div>
                    <div className="text-[11px] text-slate-700 italic bg-white/70 p-2 rounded-lg border border-teal-100/50">
                      "{currentPatient.chiefComplaint}"
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    No active consultation
                  </div>
                )}
              </div>

              <div>
                <div
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2"
                  style={{ fontFamily: PP }}
                >
                  Next Patient
                </div>
                {nextPatient ? (
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold text-xs text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {nextPatient.patientName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {nextPatient.appointmentTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {nextPatient.mrn} · {nextPatient.visitType}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    No patient in waiting queue
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {activeModal === "details" && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Consultation Info
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p>
                <strong>Patient:</strong> {selectedRecord.patientName}
              </p>
              <p>
                <strong>MRN:</strong> {selectedRecord.mrn}
              </p>
              <p>
                <strong>Chief Complaint:</strong>{" "}
                {selectedRecord.chiefComplaint}
              </p>
              {selectedRecord.vitals && (
                <p>
                  <strong>Vitals:</strong> BP: {selectedRecord.vitals.bp},
                  Pulse: {selectedRecord.vitals.pulse}, Temp:{" "}
                  {selectedRecord.vitals.temp}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {activeModal === "history" && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Consultation History
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecord.patientName} · {selectedRecord.mrn}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {[
                {
                  date: "2026-07-24",
                  type: "First Visit",
                  dx: "Angina pectoris suspect",
                  doctor: "Dr. Arjun Mehta",
                },
                {
                  date: "2026-06-10",
                  type: "Follow-up",
                  dx: "Hypertension stage 1",
                  doctor: "Dr. Arjun Mehta",
                },
              ].map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1"
                >
                  <div
                    className="flex justify-between font-bold text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    <span>
                      {h.date} — {h.type}
                    </span>
                    <span className="text-[#0D47A1]">{h.doctor}</span>
                  </div>
                  <div className="text-slate-600">Diagnosis: {h.dx}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Print Summary Modal */}
      {activeModal === "print" && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Print Summary
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
              <p className="font-bold text-[#0D47A1]">
                Hospital Management System — OPD Visit Summary
              </p>
              <p>
                Patient: {selectedRecord.patientName} ({selectedRecord.mrn})
              </p>
              <p>Consultation ID: {selectedRecord.id}</p>
              <p>
                Doctor: {selectedRecord.doctor} ({selectedRecord.department})
              </p>
              <p>Date: {selectedRecord.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationManagementPage;
