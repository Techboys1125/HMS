import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Eye,
  X,
  Activity,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
} from "lucide-react";
import type { PatientAppointment } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";
import { usePatientPortal } from "../context/PatientPortalContext";
import type { FamilyMember } from "./FamilyMembersManagement";
import {
  PatientCancelAppointmentDialog,
  PatientRescheduleAppointmentDialog,
} from "../components/PatientDialogs";
import { BookAppointmentScreen } from "../../appointments/pages/BookAppointmentScreen";
import { appointmentsApi } from "../../appointments/api/appointments.api";

export function PatientAppointmentsScreen({
  activePatient: propActivePatient,
}: {
  activePatient?: FamilyMember;
}) {
  const portal = usePatientPortal();
  const activePatient = propActivePatient ?? portal?.activePatient;
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "book">("list");
  const [cancellingAppt, setCancellingAppt] =
    useState<PatientAppointment | null>(null);

  const loadAppointments = useCallback((patient?: FamilyMember | null) => {
    const targetMrn = patient?.mrn || patient?.id;
    if (!targetMrn) {
      setAppointments([]);
      return;
    }
    appointmentsApi
      .getPatientAppointments(targetMrn)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const data = res?.data || res;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];
        if (list && list.length > 0) {
          const mapped: PatientAppointment[] = list.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, idx: number) => {
              const dt = a.visitDateTime || a.appointmentDate || a.date || "";
              const datePart = dt.includes("T") ? dt.split("T")[0] : dt;
              const timePart = dt.includes("T")
                ? dt.split("T")[1]?.substring(0, 5)
                : a.startTime || a.time || "";

              const doctorName =
                typeof a.doctor === "object"
                  ? a.doctor?.name || a.doctor?.fullName || "Doctor"
                  : a.doctorName || a.doctor || "Doctor";

              const deptName =
                typeof a.department === "object"
                  ? a.department?.departmentName ||
                    a.department?.name ||
                    "General"
                  : a.departmentName || a.department || "General";

              const rawStatus = a.appointmentStatus || a.status || "SCHEDULED";
              const formattedStatus =
                rawStatus === "SCHEDULED" || rawStatus === "BOOKED"
                  ? "Confirmed"
                  : rawStatus;

              return {
                id: String(a.appointmentId || a.id || `APT-${idx}`),
                date: datePart,
                time: timePart,
                doctor: doctorName,
                specialty: a.specialty || deptName,
                department: deptName,
                visitType: a.appointmentType || "In-Person OPD",
                status: formattedStatus,
                roomLocation: a.roomLocation || "OPD Room",
                reason: a.reason || "Consultation",
                notes: a.symptoms || a.notes || "",
                consultationStatus: rawStatus,
                prescriptionStatus: "Pending",
                billingStatus: "Paid",
                billingAmount: "$50.00",
              };
            },
          );
          setAppointments(mapped);
        } else {
          setAppointments([]);
        }
      })
      .catch(() => {
        setAppointments([]);
      });
  }, []);

  useEffect(() => {
    loadAppointments(activePatient);
  }, [activePatient, loadAppointments]);
  const [reschedulingAppt, setReschedulingAppt] =
    useState<PatientAppointment | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drawer states
  const [showBookDrawer, setShowBookDrawer] = useState(false);
  const [editingAppt, setEditingAppt] = useState<PatientAppointment | null>(
    null,
  );
  const [selectedDetailsAppt, setSelectedDetailsAppt] =
    useState<PatientAppointment | null>(null);

  // Form states for booking drawer
  const [formDept, setFormDept] = useState("Cardiology");
  const [formDoctor, setFormDoctor] = useState("Dr. Arjun Mehta");
  const [formDate, setFormDate] = useState("2025-03-30");
  const [formTime, setFormTime] = useState("10:30 AM");
  const [formType, setFormType] = useState<"In-Person OPD" | "Follow-up OPD">(
    "In-Person OPD",
  );
  const [formReason, setFormReason] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (viewMode === "book") {
    return (
      <BookAppointmentScreen
        role="patient"
        initialMrn={activePatient?.mrn || activePatient?.id}
        onBack={() => setViewMode("list")}
        onBookSuccess={() => {
          triggerToast("Appointment booked successfully!");
          setViewMode("list");
          loadAppointments(activePatient);
        }}
      />
    );
  }

  // Summary counts
  const totalCount = appointments.length;
  const upcomingAppointments = appointments.filter((a) =>
    ["Confirmed", "Scheduled", "In-Progress", "Pending"].includes(a.status),
  );
  const upcomingCount = upcomingAppointments.length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled",
  ).length;

  // Next Appointment Snapshot
  const nextAppointment =
    upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appt) => {
    // Tab Filter
    if (
      activeTab === "upcoming" &&
      !["Confirmed", "Scheduled", "In-Progress", "Pending"].includes(
        appt.status,
      )
    )
      return false;
    if (activeTab === "completed" && appt.status !== "Completed") return false;
    if (activeTab === "cancelled" && appt.status !== "Cancelled") return false;

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        appt.id.toLowerCase().includes(q) ||
        appt.doctor.toLowerCase().includes(q) ||
        appt.department.toLowerCase().includes(q) ||
        appt.reason.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Dropdown Filters
    if (deptFilter !== "All" && appt.department !== deptFilter) return false;
    if (doctorFilter !== "All" && appt.doctor !== doctorFilter) return false;
    if (statusFilter !== "All" && appt.status !== statusFilter) return false;
    if (visitTypeFilter !== "All" && appt.visitType !== visitTypeFilter)
      return false;

    return true;
  });

  // Handlers
  const handleOpenBookDrawer = (apptToReschedule?: PatientAppointment) => {
    if (apptToReschedule) {
      setEditingAppt(apptToReschedule);
      setFormDept(apptToReschedule.department);
      setFormDoctor(apptToReschedule.doctor);
      setFormDate(apptToReschedule.date);
      setFormTime(apptToReschedule.time);
      setFormType(
        apptToReschedule.visitType as "In-Person OPD" | "Follow-up OPD",
      );
      setFormReason(apptToReschedule.reason);
      setFormNotes(apptToReschedule.notes);
    } else {
      setEditingAppt(null);
      setFormDept("Cardiology");
      setFormDoctor("Dr. Arjun Mehta");
      setFormDate("2025-03-30");
      setFormTime("10:30 AM");
      setFormType("In-Person OPD");
      setFormReason("");
      setFormNotes("");
    }
    setShowBookDrawer(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppt) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingAppt.id
            ? {
                ...a,
                department: formDept,
                doctor: formDoctor,
                date: formDate,
                time: formTime,
                visitType: formType,
                reason: formReason || a.reason,
                notes: formNotes || a.notes,
                status: "Scheduled",
              }
            : a,
        ),
      );
      triggerToast(
        `Appointment ${editingAppt.id} successfully rescheduled for ${formDate} at ${formTime}!`,
      );
    } else {
      const newAppt: PatientAppointment = {
        id: `APT-2025-00${appointments.length + 1}`,
        date: formDate,
        time: formTime,
        doctor: formDoctor,
        specialty:
          formDept === "Cardiology" ? "Senior Cardiologist" : "Specialist",
        department: formDept,
        visitType: formType,
        status: "Scheduled",
        roomLocation:
          formType === "Follow-up OPD"
            ? "Wing A, OPD Room 202"
            : "Wing A, OPD Room 102",
        reason: formReason || "General Consultation",
        notes: formNotes || "Booked via Patient Portal",
        consultationStatus: "Scheduled",
        prescriptionStatus: "Pending Consultation",
        billingStatus: "Pending ($65.00)",
        billingAmount: "$65.00",
      };
      setAppointments([newAppt, ...appointments]);
      triggerToast(`New appointment ${newAppt.id} booked successfully!`);
    }
    setShowBookDrawer(false);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Cancelled", consultationStatus: "Cancelled" }
          : a,
      ),
    );
    triggerToast(`Appointment ${id} has been cancelled.`);
  };

  const handleResetFilters = () => {
    setDeptFilter("All");
    setDoctorFilter("All");
    setStatusFilter("All");
    setVisitTypeFilter("All");
    setDateRangeFilter("All");
    setSearchQuery("");
    setActiveTab("all");
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            My Appointments
          </h1>
          <p
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Manage your upcoming and previous appointments.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1.5">
            <span>Patient Portal</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-medium text-[#111827]">Appointments</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewMode("book")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Plus size={15} /> Book Appointment
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 01: Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Upcoming Appointments
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {upcomingCount}
            </div>
            <div className="text-[11px] text-[#0D47A1] font-semibold mt-1 flex items-center gap-1">
              <Clock size={12} /> Scheduled & Confirmed
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1] shrink-0">
            <Calendar size={22} />
          </div>
        </div>

        {/* Card 02: Completed Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-teal-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Completed Appointments
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {completedCount}
            </div>
            <div className="text-[11px] text-[#009688] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Past Consultations
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688] shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 03: Cancelled Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-red-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Cancelled Appointments
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {cancelledCount}
            </div>
            <div className="text-[11px] text-[#EF4444] font-semibold mt-1 flex items-center gap-1">
              <XCircle size={12} /> Cancelled Requests
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[#EF4444] shrink-0">
            <XCircle size={22} />
          </div>
        </div>

        {/* Card 04: Next Appointment */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-purple-200 transition-colors">
          <div className="truncate pr-2">
            <div className="text-xs text-[#64748B] font-medium">
              Next Appointment
            </div>
            {nextAppointment ? (
              <>
                <div
                  className="text-sm font-bold text-[#111827] mt-0.5 truncate"
                  style={{ fontFamily: PP }}
                >
                  {nextAppointment.doctor}
                </div>
                <div className="text-[11px] text-[#0D47A1] font-semibold mt-1 truncate">
                  {nextAppointment.date} · {nextAppointment.time}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-[#64748B] mt-1">
                  None Scheduled
                </div>
                <div className="text-[11px] text-[#0D47A1] font-medium mt-0.5">
                  Click to book
                </div>
              </>
            )}
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Stethoscope size={22} />
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT LAYOUT (8 COLS LEFT, 4 COLS RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Search, Filters, Tabs & List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Doctor Name, Appointment ID, Department..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            {/* Filter Dropdowns & Controls */}
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-[#64748B] font-medium">
                <Filter size={13} />
                <span>Filters:</span>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Department Filter */}
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>

              {/* Visit Type Filter */}
              <select
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Visit Types</option>
                <option value="In-Person OPD">In-Person OPD</option>
                <option value="Follow-up OPD">Follow-up OPD</option>
                <option value="Routine Checkup">Routine Checkup</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Date Ranges</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              {/* Reset Filters Action */}
              {(deptFilter !== "All" ||
                doctorFilter !== "All" ||
                statusFilter !== "All" ||
                visitTypeFilter !== "All" ||
                dateRangeFilter !== "All" ||
                searchQuery ||
                activeTab !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#0D47A1] font-semibold hover:underline px-2 py-1 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5 overflow-x-auto">
            {[
              { id: "all", label: "All", count: totalCount },
              { id: "upcoming", label: "Upcoming", count: upcomingCount },
              { id: "completed", label: "Completed", count: completedCount },
              { id: "cancelled", label: "Cancelled", count: cancelledCount },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "all" | "upcoming" | "completed" | "cancelled",
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 whitespace-nowrap ${
                    isActive
                      ? "border-[#0D47A1] text-[#0D47A1]"
                      : "border-transparent text-[#64748B] hover:text-[#111827]"
                  }`}
                  style={{ fontFamily: PP }}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? "bg-blue-50 text-[#0D47A1]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Appointment Workspace */}
          {filteredAppointments.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-[#0D47A1]">
                <Calendar size={32} />
              </div>
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                No appointments found
              </h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                No appointments found. You don't have any appointments matching
                your search criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table (Hidden on mobile/tablet) */}
              <div className="hidden md:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-left text-xs"
                    style={{ fontFamily: RB }}
                  >
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3.5 font-bold">
                          Appointment ID
                        </th>
                        <th className="px-4 py-3.5 font-bold">Doctor</th>
                        <th className="px-4 py-3.5 font-bold">Department</th>
                        <th className="px-4 py-3.5 font-bold">Date</th>
                        <th className="px-4 py-3.5 font-bold">Time</th>
                        <th className="px-4 py-3.5 font-bold">Visit Type</th>
                        <th className="px-4 py-3.5 font-bold">Status</th>
                        <th className="px-4 py-3.5 font-bold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                      {filteredAppointments.map((appt) => {
                        const isUpcoming = [
                          "Confirmed",
                          "Scheduled",
                          "Pending",
                        ].includes(appt.status);
                        return (
                          <tr
                            key={appt.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            {/* Appointment ID */}
                            <td className="px-4 py-4 font-mono font-bold text-[#0D47A1]">
                              {appt.id}
                            </td>

                            {/* Doctor */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-100">
                                  {appt.doctor
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .replace("D", "")
                                    .replace("r", "")
                                    .replace(".", "") || "DR"}
                                </div>
                                <div>
                                  <div className="font-bold text-[#111827]">
                                    {appt.doctor}
                                  </div>
                                  <div className="text-[11px] text-[#64748B]">
                                    {appt.specialty}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Department */}
                            <td className="px-4 py-4 text-slate-700 font-medium">
                              {appt.department}
                            </td>

                            {/* Appointment Date */}
                            <td className="px-4 py-4 font-medium text-[#111827]">
                              {appt.date}
                            </td>

                            {/* Appointment Time */}
                            <td className="px-4 py-4 text-[#0D47A1] font-semibold">
                              {appt.time}
                            </td>

                            {/* Visit Type */}
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                                  appt.visitType === "Follow-up OPD"
                                    ? "bg-teal-50 text-teal-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                <Building2 size={12} />
                                {appt.visitType}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  appt.status === "Confirmed"
                                    ? "bg-green-50 text-[#66BB6A]"
                                    : appt.status === "Scheduled"
                                      ? "bg-blue-50 text-[#0D47A1]"
                                      : appt.status === "Pending"
                                        ? "bg-amber-50 text-[#F59E0B]"
                                        : appt.status === "Completed"
                                          ? "bg-teal-50 text-[#009688]"
                                          : "bg-red-50 text-[#EF4444]"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    appt.status === "Confirmed"
                                      ? "bg-[#66BB6A]"
                                      : appt.status === "Scheduled"
                                        ? "bg-[#0D47A1]"
                                        : appt.status === "Pending"
                                          ? "bg-[#F59E0B]"
                                          : appt.status === "Completed"
                                            ? "bg-[#009688]"
                                            : "bg-[#EF4444]"
                                  }`}
                                />
                                {appt.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* View Details */}
                                <button
                                  onClick={() => setSelectedDetailsAppt(appt)}
                                  className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Appointment Details"
                                >
                                  <Eye size={15} />
                                </button>

                                {/* Reschedule */}
                                {isUpcoming && (
                                  <button
                                    onClick={() => setReschedulingAppt(appt)}
                                    className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                                    title="Reschedule Appointment"
                                  >
                                    <Calendar size={15} />
                                  </button>
                                )}

                                {/* Cancel */}
                                {isUpcoming && (
                                  <button
                                    onClick={() => setCancellingAppt(appt)}
                                    className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                                    title="Cancel Appointment"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
                  <div className="text-xs text-[#64748B]">
                    Showing{" "}
                    <span className="font-bold text-[#111827]">
                      {filteredAppointments.length}
                    </span>{" "}
                    of {totalCount} appointments
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium"
                    >
                      Previous
                    </button>
                    <button className="w-7 h-7 bg-[#0D47A1] text-white rounded-lg text-xs font-bold">
                      1
                    </button>
                    <button
                      disabled
                      className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="md:hidden space-y-3">
                {filteredAppointments.map((appt) => {
                  const isUpcoming = [
                    "Confirmed",
                    "Scheduled",
                    "Pending",
                  ].includes(appt.status);
                  return (
                    <div
                      key={appt.id}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-sm border border-blue-100">
                            {appt.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .replace("D", "")
                              .replace("r", "")
                              .replace(".", "") || "DR"}
                          </div>
                          <div>
                            <h4
                              className="text-xs font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              {appt.doctor}
                            </h4>
                            <div className="text-[11px] text-[#64748B]">
                              {appt.department} · {appt.specialty}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            appt.status === "Confirmed"
                              ? "bg-green-50 text-[#66BB6A]"
                              : appt.status === "Scheduled"
                                ? "bg-blue-50 text-[#0D47A1]"
                                : appt.status === "Completed"
                                  ? "bg-teal-50 text-[#009688]"
                                  : "bg-red-50 text-[#EF4444]"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[#64748B] text-[10px] block">
                            Appointment ID
                          </span>
                          <span className="font-mono font-bold text-[#0D47A1]">
                            {appt.id}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[#64748B] text-[10px] block">
                            Date & Time
                          </span>
                          <span className="font-semibold text-[#111827]">
                            {appt.date} ({appt.time})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {appt.visitType}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedDetailsAppt(appt)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                          >
                            Details
                          </button>
                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => setReschedulingAppt(appt)}
                                className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-bold rounded-xl hover:bg-blue-100"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => setCancellingAppt(appt)}
                                className="px-3 py-1.5 bg-red-50 text-[#EF4444] text-xs font-bold rounded-xl hover:bg-red-100"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Column (4 cols - Context Panel) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Next Appointment Snapshot */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Clock size={15} className="text-[#0D47A1]" /> Next Appointment
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-[#0D47A1] font-bold">
                Upcoming
              </span>
            </div>

            {nextAppointment ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-slate-50 border border-blue-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                    {nextAppointment.doctor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .replace("D", "")
                      .replace("r", "")
                      .replace(".", "") || "DR"}
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {nextAppointment.doctor}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      {nextAppointment.specialty} · {nextAppointment.department}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#111827] pt-2 border-t border-blue-100/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Date & Time:</span>
                    <span className="font-bold text-[#0D47A1]">
                      {nextAppointment.date} @ {nextAppointment.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Location:</span>
                    <span className="font-semibold text-slate-700">
                      {nextAppointment.roomLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Visit Type:</span>
                    <span className="font-medium text-[#009688]">
                      {nextAppointment.visitType}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDetailsAppt(nextAppointment)}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setReschedulingAppt(nextAppointment)}
                    className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <Calendar size={28} className="mx-auto text-slate-400" />
                <p className="text-xs text-[#64748B]">
                  You have no upcoming appointments scheduled.
                </p>
                <button
                  onClick={() => handleOpenBookDrawer()}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                  style={{ fontFamily: PP }}
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Appointment Statistics */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <TrendingUp size={15} className="text-[#009688]" /> Appointment
              Overview
            </h3>

            <div className="space-y-3">
              {/* Upcoming Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">Upcoming & Confirmed</span>
                  <span className="font-bold text-[#0D47A1]">
                    {upcomingCount} (
                    {totalCount > 0
                      ? Math.round((upcomingCount / totalCount) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0D47A1] h-full rounded-full"
                    style={{
                      width: `${totalCount > 0 ? (upcomingCount / totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Completed Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">
                    Completed Consultations
                  </span>
                  <span className="font-bold text-[#009688]">
                    {completedCount} (
                    {totalCount > 0
                      ? Math.round((completedCount / totalCount) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#009688] h-full rounded-full"
                    style={{
                      width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Cancelled Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">Cancelled Requests</span>
                  <span className="font-bold text-[#EF4444]">
                    {cancelledCount} (
                    {totalCount > 0
                      ? Math.round((cancelledCount / totalCount) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#EF4444] h-full rounded-full"
                    style={{
                      width: `${totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Activity size={15} className="text-[#F59E0B]" /> Quick Actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setViewMode("book")}
                className="w-full p-3 rounded-xl bg-blue-50 border border-blue-100 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-between"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} /> Book New Appointment
                </span>
                <ChevronRight size={15} />
              </button>

              <button
                onClick={() => {
                  if (nextAppointment) setSelectedDetailsAppt(nextAppointment);
                  else triggerToast("No upcoming appointment to view details.");
                }}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Eye size={16} /> View Next Appointment Details
                </span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. RIGHT DRAWER: BOOK / RESCHEDULE APPOINTMENT ── */}
      {showBookDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowBookDrawer(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    {editingAppt
                      ? `Reschedule ${editingAppt.id}`
                      : "Book New Appointment"}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Select doctor, date & available slot
                  </p>
                </div>
                <button
                  onClick={() => setShowBookDrawer(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form
                onSubmit={handleSaveAppointment}
                className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
                style={{ fontFamily: RB }}
              >
                {/* 1. Department */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label
                    className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    1. Select Department
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Cardiology">
                      Cardiology (Heart & Vascular)
                    </option>
                    <option value="General Medicine">
                      General Medicine (OPD)
                    </option>
                    <option value="Neurology">Neurology (Brain & Spine)</option>
                    <option value="Gynecology">Gynecology & Obstetrics</option>
                    <option value="Pediatrics">Pediatrics (Child Care)</option>
                  </select>
                </div>

                {/* 2. Doctor */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label
                    className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    2. Select Doctor
                  </label>
                  <select
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Dr. Arjun Mehta">
                      Dr. Arjun Mehta — Senior Cardiologist (10 yrs exp)
                    </option>
                    <option value="Dr. Priya Sharma">
                      Dr. Priya Sharma — Endocrinologist (8 yrs exp)
                    </option>
                    <option value="Dr. Rajesh Kapoor">
                      Dr. Rajesh Kapoor — Neurologist (12 yrs exp)
                    </option>
                    <option value="Dr. Sunita Patel">
                      Dr. Sunita Patel — Gynecologist (9 yrs exp)
                    </option>
                  </select>
                </div>

                {/* 3. Visit Type, Date & Time Slots */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-4">
                  <label
                    className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    3. Visit Type & Date Selection
                  </label>

                  {/* Visit Type Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormType("In-Person OPD")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        formType === "In-Person OPD"
                          ? "border-[#0D47A1] bg-blue-50 text-[#0D47A1]"
                          : "border-[#E5E7EB] bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Building2 size={14} /> In-Person OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("Follow-up OPD")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        formType === "Follow-up OPD"
                          ? "border-[#0D47A1] bg-blue-50 text-[#0D47A1]"
                          : "border-[#E5E7EB] bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Stethoscope size={14} /> Follow-up OPD
                    </button>
                  </div>

                  {/* Date Input */}
                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">
                      Select Preferred Date
                    </span>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-2 font-medium">
                      Available Time Slots
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "09:00 AM",
                        "10:30 AM",
                        "02:00 PM",
                        "03:30 PM",
                        "04:15 PM",
                        "05:00 PM",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormTime(t)}
                          className={`py-1.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                            formTime === t
                              ? "border-[#0D47A1] bg-[#0D47A1] text-white shadow-sm"
                              : "border-[#E5E7EB] bg-slate-50 text-[#111827] hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Reason for Visit & Notes */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label
                    className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    4. Clinical Reason & Symptoms
                  </label>

                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">
                      Reason for Visit *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Routine follow-up, BP check, Chest tightness..."
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">
                      Additional Notes
                    </span>
                    <textarea
                      rows={2}
                      placeholder="Any symptoms, ongoing medications, or special requests..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>

                {/* Appointment Summary Card */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <div
                    className="text-xs font-bold text-[#0D47A1]"
                    style={{ fontFamily: PP }}
                  >
                    Appointment Summary
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B]">
                    <div>
                      Doctor:{" "}
                      <span className="font-semibold text-[#111827]">
                        {formDoctor}
                      </span>
                    </div>
                    <div>
                      Dept:{" "}
                      <span className="font-semibold text-[#111827]">
                        {formDept}
                      </span>
                    </div>
                    <div>
                      Date:{" "}
                      <span className="font-semibold text-[#111827]">
                        {formDate}
                      </span>
                    </div>
                    <div>
                      Time:{" "}
                      <span className="font-semibold text-[#111827]">
                        {formTime}
                      </span>
                    </div>
                    <div>
                      Type:{" "}
                      <span className="font-semibold text-[#111827]">
                        {formType}
                      </span>
                    </div>
                    <div>
                      Consultation Fee:{" "}
                      <span className="font-bold text-[#009688]">$65.00</span>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    {editingAppt ? "Confirm Reschedule" : "Confirm Appointment"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookDrawer(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#64748B] hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. RIGHT DRAWER: APPOINTMENT DETAILS ── */}
      {selectedDetailsAppt && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedDetailsAppt(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              {/* Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    Appointment Details
                  </h2>
                  <span className="font-mono text-xs text-blue-200">
                    {selectedDetailsAppt.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDetailsAppt(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Details Body */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
                style={{ fontFamily: RB }}
              >
                {/* Doctor & Location Info */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-sm shrink-0">
                      AM
                    </div>
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {selectedDetailsAppt.doctor}
                      </h3>
                      <div className="text-xs text-[#64748B]">
                        {selectedDetailsAppt.specialty} ·{" "}
                        {selectedDetailsAppt.department}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Appointment Date
                      </span>
                      <span className="font-semibold text-[#111827]">
                        {selectedDetailsAppt.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Appointment Time
                      </span>
                      <span className="font-semibold text-[#0D47A1]">
                        {selectedDetailsAppt.time}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Visit Type
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedDetailsAppt.visitType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Hospital Location
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedDetailsAppt.roomLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges Section */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Status Overview
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Appointment Status
                      </span>
                      <span className="font-bold text-[#66BB6A]">
                        {selectedDetailsAppt.status}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Consultation Status
                      </span>
                      <span className="font-bold text-[#0D47A1]">
                        {selectedDetailsAppt.consultationStatus}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Prescription Status
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedDetailsAppt.prescriptionStatus}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Billing Status
                      </span>
                      <span className="font-bold text-amber-600">
                        {selectedDetailsAppt.billingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visit Reason & Clinical Notes */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Reason & Notes
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block font-medium">
                      Reason for Visit
                    </span>
                    <p className="text-xs text-[#111827] mt-0.5 font-medium">
                      {selectedDetailsAppt.reason}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <span className="text-[#64748B] text-[11px] block font-medium">
                      Doctor / Staff Notes
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedDetailsAppt.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                <button
                  onClick={() =>
                    triggerToast(
                      `Downloading slip for ${selectedDetailsAppt.id}...`,
                    )
                  }
                  className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} /> Download Appointment Slip
                </button>
                <button
                  onClick={() => {
                    const apptToReschedule = selectedDetailsAppt;
                    setSelectedDetailsAppt(null);
                    setReschedulingAppt(apptToReschedule);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-blue-200 text-xs font-bold text-[#0D47A1] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={15} /> Reschedule
                </button>
                <button
                  onClick={() => {
                    const apptToCancel = selectedDetailsAppt;
                    setSelectedDetailsAppt(null);
                    setCancellingAppt(apptToCancel);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-[#EF4444] bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <XCircle size={15} /> Cancel
                </button>
                <button
                  onClick={() => setSelectedDetailsAppt(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL APPOINTMENT CONFIRMATION DIALOG ── */}
      <PatientCancelAppointmentDialog
        appointment={cancellingAppt}
        isOpen={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        onConfirmCancel={(id) => {
          handleCancelAppointment(id);
        }}
        onBookNewAppointment={() => {
          setCancellingAppt(null);
          setViewMode("book");
        }}
      />

      {/* ── RESCHEDULE APPOINTMENT DIALOG ── */}
      <PatientRescheduleAppointmentDialog
        appointment={reschedulingAppt}
        isOpen={!!reschedulingAppt}
        onClose={() => setReschedulingAppt(null)}
        onConfirmReschedule={(id, newDate, newTime) => {
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === id
                ? { ...a, date: newDate, time: newTime, status: "Scheduled" }
                : a,
            ),
          );
          triggerToast(
            `Appointment ${id} rescheduled to ${newDate} at ${newTime}!`,
          );
        }}
        onViewDetails={(appt) => {
          setSelectedDetailsAppt(appt);
        }}
      />
    </div>
  );
}
