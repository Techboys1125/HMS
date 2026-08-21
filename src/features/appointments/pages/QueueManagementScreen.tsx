import { useState, useMemo, useEffect } from "react";
import { PP, RB } from "../constants/appointment.constants";
import type { ChipVariant } from "../constants/appointment.constants";
import { Chip } from "../components/Chip";
import { CheckInConfirmationModal } from "../../reception/components/CheckInConfirmationModal";
import { receptionService } from "../../reception/services/reception.service";
import { appointmentService } from "../../appointments/services/appointment.service";
import { departmentsApi } from "../../users/api/departments.api";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import { type QueueManagementScreenProps } from "../types/appointment-screen.types";
import { usePermissions } from "../../../permissions/usePermissions";
import {
  ChevronRight,
  RefreshCw,
  UserCheck,
  Search,
  Users,
  AlertCircle,
} from "lucide-react";
import { Pagination } from "../../../common/components/Pagination";

export function QueueManagementScreen({
  onBack,
  onCheckInClick,
  onPatientSearchClick,
  onPatientSelect,
}: QueueManagementScreenProps) {
  const { can } = usePermissions();
  const canCheckIn = can("APPOINTMENT_CHECK_IN") || can("CHECKIN_CREATE");
  const canRecordVitals = can("VITALS_CREATE");

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Global Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Bar state
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [, setSelectedDate] = useState("Today (2026-07-24)");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");

  const [apiDepts, setApiDepts] = useState<string[]>([]);

  useEffect(() => {
    departmentsApi
      .getDepartmentLookup(true)
      .then((lookupList) => {
        if (lookupList && lookupList.length > 0) {
          const names = lookupList.flatMap((d) =>
            d.departmentName ? [d.departmentName] : [],
          );
          setApiDepts(names);
        } else {
          departmentsApi.getDepartments({ activeOnly: true }).then((list) => {
<<<<<<< HEAD
            const names = list.flatMap((d) => {
              const n = d.departmentName || d.name;
              return n ? [n] : [];
            });
=======
            const content = Array.isArray(list) ? list : list.content || [];
            const names = content
              .map((d) => d.departmentName || d.name)
              .filter((n): n is string => Boolean(n));
>>>>>>> 96e9ce1 (refactor: cleanup unused components, hooks, and services while updating core feature modules)
            if (names.length > 0) setApiDepts(names);
          });
        }
      })
      .catch(() => {});
  }, []);

  // Selected Row for Right Context Panel
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");

  // Dialog States
  const [noShowDialogApt, setNoShowDialogApt] =
    useState<AppointmentRecord | null>(null);
  const [checkInModalData, setCheckInModalData] = useState<{
    isOpen: boolean;
    tokenNumber: string;
    patientName: string;
    patientMrn: string;
    doctorName?: string;
    departmentName?: string;
    appointmentTime?: string;
    status?: string;
  } | null>(null);

  const [tokenCounter] = useState(
    () => 100 + (window.crypto.getRandomValues(new Uint32Array(1))[0] % 900),
  );

  const handleExecuteCheckIn = async (apt: AppointmentRecord) => {
    try {
      const res = await receptionService.checkInPatient(apt.id);
      const genToken =
        res.tokenNumber ||
        apt.queueToken ||
        `TK-${tokenCounter + Number(apt.id)}`;

      setQueueItems((prev) =>
        prev.map((i) =>
          i.id === apt.id
            ? {
                ...i,
                queueToken: genToken,
                status: "Waiting for Vitals" as AppointmentRecord["status"],
                arrivalTime: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : i,
        ),
      );

      setCheckInModalData({
        isOpen: true,
        tokenNumber: genToken,
        patientName: apt.patientName,
        patientMrn: apt.patientMrn || apt.mrn || "",
        doctorName: apt.doctorName,
        departmentName: apt.departmentName,
        appointmentTime: apt.startTime || apt.timeSlot,
        status: "Waiting for Vitals",
      });

      if (onCheckInClick)
        onCheckInClick(genToken, apt.patientMrn || apt.mrn || "");
    } catch (err) {
      triggerToast(
        (err instanceof Error ? err.message : null) ||
          "Check-in is only allowed on the appointment date.",
        "error",
      );
    }
  };

  const [queueItems, setQueueItems] = useState<AppointmentRecord[]>([]);

  const fetchQueue = async () => {
    return appointmentService.getActiveAppointments();
  };

  useEffect(() => {
    let cancelled = false;

    const loadQueue = async () => {
      try {
        const data = await fetchQueue();
        if (!cancelled) setQueueItems(data);
      } catch (err) {
        console.warn("Failed to load queue:", err);
      }
    };

    void loadQueue();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter Logic
  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        (item.patientName || "").toLowerCase().includes(q) ||
        (item.patientMrn || item.mrn || "").toLowerCase().includes(q) ||
        (item.queueToken || item.tokenNo || "").toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q);

      const matchDoc =
        selectedDoctor === "All Doctors" ||
        (item.doctorName || "") === selectedDoctor;
      const matchDept =
        selectedDept === "All Departments" ||
        (item.departmentName || "") === selectedDept;
      const matchStatus =
        selectedStatus === "All Statuses" ||
        String(item.status).toUpperCase() === selectedStatus.toUpperCase();

      return matchSearch && matchDoc && matchDept && matchStatus;
    });
  }, [queueItems, searchQuery, selectedDoctor, selectedDept, selectedStatus]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredQueue.length / pageSize);
  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Summary KPI Metrics
  const metrics = useMemo(() => {
    const waiting = queueItems.filter(
      (i) =>
        i.status === "Waiting for Vitals" ||
        i.status === "Waiting for Doctor" ||
        i.status === "Called" ||
        i.status === "Waiting",
    ).length;
    const checkedIn = queueItems.filter(
      (i) => i.status === "Checked-In",
    ).length;
    const inConsultation = queueItems.filter(
      (i) => i.status === "In Consultation" || i.status === "In Progress",
    ).length;
    const completed = queueItems.filter((i) => i.status === "Completed").length;
    const noShows = queueItems.filter((i) => i.status === "No Show").length;
    return { waiting, checkedIn, inConsultation, completed, noShows };
  }, [queueItems]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDoctor("All Doctors");
    setSelectedDept("All Departments");
    setSelectedDate("Today (2026-07-24)");
    setSelectedStatus("All Statuses");
    setSelectedType("All Types");
  };

  const handleMarkNoShow = async (apt: AppointmentRecord) => {
    try {
      await appointmentService.receptionMarkNoShow(
        apt.id,
        "Patient did not arrive",
      );
      setQueueItems((prev) =>
        prev.map((i) =>
          i.id === apt.id
            ? { ...i, status: "No Show" as AppointmentRecord["status"] }
            : i,
        ),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to mark no-show";
      triggerToast(msg, "error");
    }
    setNoShowDialogApt(null);
  };

  const getStatusChipVariant = (status: string): ChipVariant => {
    const s = status.toUpperCase();
    switch (s) {
      case "IN_CONSULTATION":
      case "IN_PROGRESS":
        return "teal";
      case "WAITING_FOR_VITALS":
      case "WAITING_FOR_DOCTOR_CALL":
        return "warning";
      case "CALLED":
        return "info";
      case "CHECKED_IN":
        return "info";
      case "BOOKED":
      case "CONFIRMED":
        return "info";
      case "COMPLETED":
        return "success";
      case "NO_SHOW":
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-50 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 ${toastType === "error" ? "bg-[#EF4444]" : "bg-[#111827]"}`}
        >
          <AlertCircle
            size={16}
            className={
              toastType === "error" ? "text-red-200" : "text-[#66BB6A]"
            }
          />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── HEADER & BREADCRUMBS & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Reception Management
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">
              Queue Management
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Reception Queue Management
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor today's patient queue and manage patient check-ins.
          </p>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchQueue()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <RefreshCw size={15} /> Refresh Queue
          </button>
          <button
            onClick={() => onCheckInClick && onCheckInClick()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserCheck size={15} /> Patient Check-In
          </button>
          <button
            onClick={onPatientSearchClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-colors"
            style={{ fontFamily: PP }}
          >
            <Search size={15} /> Patient Search
          </button>
        </div>
      </div>

      {/* ── GLOBAL SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queue by Patient Name, MRN, Token Number or Appointment ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Doctors</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              {apiDepts.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Checked-In</option>
              <option>Waiting</option>
              <option>In Consultation</option>
              <option>Completed</option>
              <option>No Show</option>
              <option>Cancelled</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Types</option>
              <option>New Visit</option>
              <option>Follow-up</option>
              <option>Routine</option>
              <option>Emergency</option>
              <option>Consultation</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="text-xs text-[#64748B] font-medium">
            Showing{" "}
            <span className="font-bold text-[#0D47A1]">
              {filteredQueue.length}
            </span>{" "}
            queue entries
          </div>
        </div>
      </div>

      {/* ── 6 SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 01: Waiting Patients */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">
            Waiting Patients
          </span>
          <div
            className="text-2xl font-bold text-[#F59E0B]"
            style={{ fontFamily: PP }}
          >
            {metrics.waiting}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">
            In lounge waiting
          </span>
        </div>

        {/* Card 02: Checked-In Patients */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">
            Checked-In Patients
          </span>
          <div
            className="text-2xl font-bold text-[#0D47A1]"
            style={{ fontFamily: PP }}
          >
            {metrics.checkedIn}
          </div>
          <span className="text-[10px] text-blue-600 font-medium">
            Arrived at reception
          </span>
        </div>

        {/* Card 03: Currently In Consultation (Read Only) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-medium">
              In Consultation
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">
              Read Only
            </span>
          </div>
          <div
            className="text-2xl font-bold text-[#009688]"
            style={{ fontFamily: PP }}
          >
            {metrics.inConsultation}
          </div>
          <span className="text-[10px] text-teal-600 font-medium">
            Active doctor room
          </span>
        </div>

        {/* Card 04: Completed (Read Only) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-medium">
              Completed
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">
              Read Only
            </span>
          </div>
          <div
            className="text-2xl font-bold text-[#66BB6A]"
            style={{ fontFamily: PP }}
          >
            {metrics.completed}
          </div>
          <span className="text-[10px] text-green-600 font-medium">
            Consultations done
          </span>
        </div>

        {/* Card 05: No Shows */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">
            No Shows
          </span>
          <div
            className="text-2xl font-bold text-[#EF4444]"
            style={{ fontFamily: PP }}
          >
            {metrics.noShows}
          </div>
          <span className="text-[10px] text-red-600 font-medium">
            Missed slot today
          </span>
        </div>

        {/* Card 06: Average Waiting Time */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">
            Avg Waiting Time
          </span>
          <div
            className="text-2xl font-bold text-[#0D47A1]"
            style={{ fontFamily: PP }}
          >
            14 min
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            OPD bench target
          </span>
        </div>
      </div>

      {/* ── ENTERPRISE LAYOUT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ENTERPRISE QUEUE TABLE (8 COLS) */}
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Today's Queue Table
                </h2>
                <p className="text-xs text-[#64748B]">
                  Real-time patient flow and arrival management
                </p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-150 overflow-y-auto">
              <table
                className="w-full border-collapse text-left text-xs"
                style={{ fontFamily: RB }}
              >
                <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
                  <tr
                    className="text-[#64748B] font-bold"
                    style={{ fontFamily: PP }}
                  >
                    <th className="px-4 py-3.5">Token</th>
                    <th className="px-4 py-3.5">Patient</th>
                    <th className="px-4 py-3.5">MRN</th>
                    <th className="px-4 py-3.5">Doctor</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Appt Time</th>
                    <th className="px-4 py-3.5">Arrival Time</th>
                    <th className="px-4 py-3.5">Wait Time</th>
                    <th className="px-4 py-3.5">Queue Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredQueue.length > 0 ? (
                    paginatedQueue.map((apt) => {
                      const isSelected =
                        selectedTokenId === apt.queueToken ||
                        selectedTokenId === String(apt.id);
                      const displayStatus = String(apt.status || "").replace(
                        /_/g,
                        " ",
                      );
                      return (
                        <tr
                          key={apt.id}
                          onClick={() =>
                            setSelectedTokenId(apt.queueToken || String(apt.id))
                          }
                          className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/60 font-medium" : ""}`}
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                            {apt.queueToken || apt.tokenNo || `TK-${apt.id}`}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[#111827]">
                            {apt.patientName}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">
                            {apt.patientMrn || apt.mrn || ""}
                          </td>
                          <td className="px-4 py-3.5 font-medium">
                            {apt.doctorName}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {apt.departmentName}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">
                            {apt.startTime || apt.timeSlot || ""}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">
                            {apt.arrivalTime || ""}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">
                            {apt.waitingTimeMinutes
                              ? `${apt.waitingTimeMinutes} min`
                              : ""}
                          </td>
                          <td className="px-4 py-3.5">
                            <Chip
                              label={displayStatus}
                              variant={getStatusChipVariant(displayStatus)}
                            />
                          </td>
                          <td
                            className="px-4 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              {(apt.status === "Booked" ||
                                apt.status === "Scheduled" ||
                                apt.status === "BOOKED" ||
                                apt.status === "CONFIRMED") &&
                                canCheckIn && (
                                  <button
                                    onClick={() => handleExecuteCheckIn(apt)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shadow-xs bg-[#009688] text-white hover:bg-teal-700 cursor-pointer"
                                    title="Check-In Patient"
                                  >
                                    Check-In
                                  </button>
                                )}

                              {(apt.status === "Checked-In" ||
                                apt.status === "CHECKED_IN" ||
                                apt.status === "Waiting for Vitals" ||
                                apt.status === "WAITING_FOR_VITALS") &&
                              canRecordVitals ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  Vitals Pending
                                </span>
                              ) : null}

                              <button
                                onClick={() =>
                                  onPatientSelect &&
                                  onPatientSelect(
                                    apt.patientMrn || apt.mrn || "",
                                  )
                                }
                                title="View Patient"
                                className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                              >
                                View
                              </button>

                              {apt.status !== "Completed" &&
                                apt.status !== "COMPLETED" &&
                                apt.status !== "Cancelled" &&
                                apt.status !== "CANCELLED" &&
                                apt.status !== "No Show" &&
                                apt.status !== "NO_SHOW" && (
                                  <button
                                    onClick={() => setNoShowDialogApt(apt)}
                                    title="Mark No Show"
                                    className="px-2 py-1 rounded-lg bg-red-50 text-[#EF4444] text-[11px] font-semibold hover:bg-red-100 transition-colors"
                                  >
                                    No Show
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-slate-300" />
                          <p className="text-sm font-semibold text-[#111827]">
                            No patients are currently in today's queue.
                          </p>
                          <button
                            onClick={onPatientSearchClick}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5"
                            style={{ fontFamily: PP }}
                          >
                            <Search size={15} /> Patient Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              totalCount={filteredQueue.length}
            />
          </div>
        </div>
      </div>

      {/* ── CONFIRMATION DIALOG: MARK NO SHOW ── */}
      {noShowDialogApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Mark Patient as No Show?
                </h3>
                <p className="text-xs text-[#64748B]">
                  This patient did not arrive for the scheduled appointment.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <p>
                <strong>Patient:</strong> {noShowDialogApt.patientName} (
                {noShowDialogApt.patientMrn || noShowDialogApt.mrn || ""})
              </p>
              <p>
                <strong>Doctor:</strong> {noShowDialogApt.doctorName} (
                {noShowDialogApt.departmentName})
              </p>
              <p>
                <strong>Time Slot:</strong>{" "}
                {noShowDialogApt.startTime || noShowDialogApt.timeSlot || ""}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoShowDialogApt(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkNoShow(noShowDialogApt)}
                className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 shadow-sm"
              >
                Confirm No Show
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Check-In Confirmation Modal */}
      {checkInModalData && (
        <CheckInConfirmationModal
          isOpen={checkInModalData.isOpen}
          onClose={() => setCheckInModalData(null)}
          tokenNumber={checkInModalData.tokenNumber}
          patientName={checkInModalData.patientName}
          patientMrn={checkInModalData.patientMrn}
          doctorName={checkInModalData.doctorName}
          departmentName={checkInModalData.departmentName}
          appointmentTime={checkInModalData.appointmentTime}
          status={checkInModalData.status || "Waiting for Vitals"}
        />
      )}
    </div>
  );
}
