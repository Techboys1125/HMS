import { useState, useMemo } from "react";
import {
  ChevronRight,
  RefreshCw,
  UserCheck,
  Search,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { PP, RB } from "../../appointments/constants/appointment.constants";
import { Chip } from "../../appointments/components/Chip";
import type { ChipVariant } from "../../appointments/constants/appointment.constants";
import { CheckInConfirmationModal } from "../components/CheckInConfirmationModal";
import { receptionService } from "../services/reception.service";

export interface ReceptionQueueManagementScreenProps {
  onBack?: () => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  onPatientSearchClick?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterPatientClick?: () => void;
  onBookAppointmentClick?: () => void;
  userRole?: string;
}

interface QueueItem {
  token: string;
  name: string;
  mrn: string;
  aptId: string | number;
  doctor: string;
  dept: string;
  apptTime: string;
  arrivalTime: string;
  waitTime: string;
  status: string;
  type: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export function ReceptionQueueManagementScreen({
  onBack,
  onCheckInClick,
  onPatientSearchClick,
  onPatientSelect,
}: ReceptionQueueManagementScreenProps) {
  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
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

  // Selected Row for Right Context Panel
  const [selectedTokenId, setSelectedTokenId] = useState<string>("TK-086");

  // Dialog States
  const [noShowDialogApt, setNoShowDialogApt] = useState<QueueItem | null>(
    null,
  );

  // Queue Data List
  const [queueItems, setQueueItems] = useState([
    {
      token: "TK-086",
      name: "Sarah Mitchell",
      mrn: "MRN-892101",
      aptId: "APT-2026-8912",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      apptTime: "09:00 AM",
      arrivalTime: "08:42 AM",
      waitTime: "18 min",
      status: "In Consultation",
      type: "Follow-up",
      age: 34,
      gender: "Female",
      bloodGroup: "A+",
    },
    {
      token: "TK-087",
      name: "James Thornton",
      mrn: "MRN-892102",
      aptId: "APT-2026-8913",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      apptTime: "09:15 AM",
      arrivalTime: "09:03 AM",
      waitTime: "12 min",
      status: "Waiting",
      type: "Routine",
      age: 67,
      gender: "Male",
      bloodGroup: "O+",
    },
    {
      token: "TK-088",
      name: "Emma Reyes",
      mrn: "MRN-892103",
      aptId: "APT-2026-8914",
      doctor: "Dr. Sunita Patel",
      dept: "Gynecology",
      apptTime: "09:30 AM",
      arrivalTime: "09:22 AM",
      waitTime: "08 min",
      status: "Checked-In",
      type: "New Visit",
      age: 28,
      gender: "Female",
      bloodGroup: "B+",
    },
    {
      token: "TK-089",
      name: "Robert Chen",
      mrn: "MRN-892104",
      aptId: "APT-2026-8915",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      apptTime: "10:00 AM",
      arrivalTime: "—",
      waitTime: "00 min",
      status: "Scheduled",
      type: "Emergency",
      age: 52,
      gender: "Male",
      bloodGroup: "AB+",
    },
    {
      token: "TK-090",
      name: "Aisha Kumar",
      mrn: "MRN-892105",
      aptId: "APT-2026-8916",
      doctor: "Dr. Rajesh Kapoor",
      dept: "Neurology",
      apptTime: "10:15 AM",
      arrivalTime: "10:11 AM",
      waitTime: "04 min",
      status: "Checked-In",
      type: "Consultation",
      age: 41,
      gender: "Female",
      bloodGroup: "O-",
    },
    {
      token: "TK-091",
      name: "David Walsh",
      mrn: "MRN-892106",
      aptId: "APT-2026-8917",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      apptTime: "10:30 AM",
      arrivalTime: "—",
      waitTime: "00 min",
      status: "Scheduled",
      type: "Routine",
      age: 38,
      gender: "Male",
      bloodGroup: "A-",
    },
    {
      token: "TK-092",
      name: "Nina Patel",
      mrn: "MRN-892107",
      aptId: "APT-2026-8918",
      doctor: "Dr. Rajesh Kapoor",
      dept: "Dermatology",
      apptTime: "11:00 AM",
      arrivalTime: "10:45 AM",
      waitTime: "00 min",
      status: "Completed",
      type: "Follow-up",
      age: 29,
      gender: "Female",
      bloodGroup: "B-",
    },
    {
      token: "TK-093",
      name: "Carlos Mendez",
      mrn: "MRN-892108",
      aptId: "APT-2026-8919",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      apptTime: "11:30 AM",
      arrivalTime: "—",
      waitTime: "00 min",
      status: "No Show",
      type: "Consultation",
      age: 63,
      gender: "Male",
      bloodGroup: "O+",
    },
  ]);

  // Filter Logic
  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.mrn.toLowerCase().includes(q) ||
        item.token.toLowerCase().includes(q) ||
        item.aptId.toLowerCase().includes(q);

      const matchDoc =
        selectedDoctor === "All Doctors" || item.doctor === selectedDoctor;
      const matchDept =
        selectedDept === "All Departments" || item.dept === selectedDept;
      const matchStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;
      const matchType =
        selectedType === "All Types" || item.type === selectedType;

      return matchSearch && matchDoc && matchDept && matchStatus && matchType;
    });
  }, [
    queueItems,
    searchQuery,
    selectedDoctor,
    selectedDept,
    selectedStatus,
    selectedType,
  ]);

  const selectedItem = useMemo(() => {
    return (
      queueItems.find((i) => i.token === selectedTokenId) ||
      filteredQueue[0] ||
      queueItems[0]
    );
  }, [queueItems, selectedTokenId, filteredQueue]);

  // Summary KPI Metrics
  const metrics = useMemo(() => {
    const waiting = queueItems.filter((i) => i.status === "Waiting").length;
    const checkedIn = queueItems.filter(
      (i) => i.status === "Checked-In",
    ).length;
    const inConsultation = queueItems.filter(
      (i) => i.status === "In Consultation",
    ).length;
    const completed = queueItems.filter((i) => i.status === "Completed").length;
    const noShows = queueItems.filter((i) => i.status === "No Show").length;
    return { waiting, checkedIn, inConsultation, completed, noShows };
  }, [queueItems]);

  // Check-In Confirmation Modal State
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

  const handleDirectCheckIn = async (token?: string, mrn?: string) => {
    const targetToken = token || selectedTokenId;
    const targetItem = queueItems.find(
      (i) => i.token === targetToken || i.mrn === mrn,
    );
    if (!targetItem) return;

    if (
      targetItem.status === "Waiting for Vitals" ||
      targetItem.status === "Checked-In"
    ) {
      triggerToast(
        `Patient ${targetItem.name} (${targetItem.token}) is already checked in.`,
      );
      return;
    }

    try {
      // Call reception service API to patch check-in & transition status to Waiting for Vitals
      const res = await receptionService.checkInPatient(
        targetItem.aptId || targetItem.token,
      );

      const generatedToken = res.tokenNumber || targetItem.token;

      setQueueItems((prev) =>
        prev.map((i) =>
          i.token === targetItem.token || (mrn && i.mrn === mrn)
            ? {
                ...i,
                token: generatedToken,
                status: "Waiting for Vitals",
                arrivalTime:
                  i.arrivalTime && i.arrivalTime !== "—"
                    ? i.arrivalTime
                    : new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
              }
            : i,
        ),
      );

      // Show Centered Confirmation Modal
      setCheckInModalData({
        isOpen: true,
        tokenNumber: generatedToken,
        patientName: targetItem.name,
        patientMrn: targetItem.mrn,
        doctorName: targetItem.doctor,
        departmentName: targetItem.dept,
        appointmentTime: targetItem.apptTime,
        status: "Waiting for Vitals",
      });

      if (onCheckInClick) onCheckInClick(generatedToken, targetItem.mrn);
    } catch (err) {
      const errorObj = err as Error | { message?: string } | null | undefined;
      triggerToast(
        errorObj?.message || "Check-in failed for this appointment.",
      );
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDoctor("All Doctors");
    setSelectedDept("All Departments");
    setSelectedDate("Today (2026-07-24)");
    setSelectedStatus("All Statuses");
    setSelectedType("All Types");
  };

  const handleMarkNoShow = (token: string) => {
    setQueueItems((prev) =>
      prev.map((i) => (i.token === token ? { ...i, status: "No Show" } : i)),
    );
    setNoShowDialogApt(null);
    triggerToast(`Appointment ${token} marked as No Show.`);
  };

  const getStatusChipVariant = (status: string): ChipVariant => {
    switch (status) {
      case "In Consultation":
        return "teal";
      case "Waiting":
        return "warning";
      case "Checked-In":
        return "info";
      case "Scheduled":
        return "info";
      case "Completed":
        return "success";
      case "No Show":
        return "error";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] font-body relative"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-[#009688]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER & BREADCRUMBS & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors cursor-pointer"
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
            onClick={() => triggerToast("Queue refreshed successfully.")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-xs cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <RefreshCw size={15} /> Refresh Queue
          </button>
          <button
            onClick={() => {
              if (selectedItem) {
                handleDirectCheckIn(selectedItem.token, selectedItem.mrn);
              } else {
                const sched = queueItems.find(
                  (i) => i.status === "Scheduled" || i.status === "Waiting",
                );
                if (sched) handleDirectCheckIn(sched.token, sched.mrn);
                else triggerToast("No scheduled patients found to check in.");
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-xs cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <UserCheck size={15} /> Patient Check-In
          </button>
          <button
            onClick={onPatientSearchClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <Search size={15} /> Patient Search
          </button>
        </div>
      </div>

      {/* 6 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-1">
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

      {/* GLOBAL SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
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
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none cursor-pointer"
            >
              <option>All Doctors</option>
              <option>Dr. Arjun Mehta</option>
              <option>Dr. Priya Sharma</option>
              <option>Dr. Sunita Patel</option>
              <option>Dr. Rajesh Kapoor</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none cursor-pointer"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>General OPD</option>
              <option>Gynecology</option>
              <option>Neurology</option>
              <option>Dermatology</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none cursor-pointer"
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Checked-In</option>
              <option>Waiting</option>
              <option>In Consultation</option>
              <option>Completed</option>
              <option>No Show</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none cursor-pointer"
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
              className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* WORKSPACE GRID */}

      {/* LEFT COLUMN: QUEUE TABLE (8 COLS) */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                  style={{ fontFamily: PP }}
                >
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">MRN</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Appt Time</th>
                  <th className="px-4 py-3">Arrival Time</th>
                  <th className="px-4 py-3">Queue Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#111827]">
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((item) => {
                    const isSelected = selectedTokenId === item.token;
                    return (
                      <tr
                        key={item.token}
                        onClick={() => setSelectedTokenId(item.token)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50/60 font-medium" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                          {item.token}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#111827]">
                          {item.name}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">
                          {item.mrn}
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          {item.doctor}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {item.dept}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">
                          {item.apptTime}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">
                          {item.arrivalTime}
                        </td>
                        <td className="px-4 py-3.5">
                          <Chip
                            label={item.status}
                            variant={getStatusChipVariant(item.status)}
                          />
                        </td>
                        <td
                          className="px-4 py-3.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {(item.status === "Scheduled" ||
                              item.status === "Waiting") && (
                              <button
                                onClick={() =>
                                  handleDirectCheckIn(item.token, item.mrn)
                                }
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors bg-[#009688] text-white hover:bg-teal-700 cursor-pointer"
                                title="Check-In Patient"
                              >
                                Check-In
                              </button>
                            )}

                            <button
                              onClick={() =>
                                onPatientSelect && onPatientSelect(item.mrn)
                              }
                              title="View Patient"
                              className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              View
                            </button>

                            {item.status !== "Completed" &&
                              item.status !== "Cancelled" &&
                              item.status !== "No Show" && (
                                <button
                                  onClick={() => setNoShowDialogApt(item)}
                                  title="Mark No Show"
                                  className="px-2 py-1 rounded-lg bg-red-50 text-[#EF4444] text-[11px] font-semibold hover:bg-red-100 transition-colors cursor-pointer"
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
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users size={32} className="text-slate-300" />
                        <p className="text-sm font-semibold text-[#111827]">
                          No patients are currently in today's queue.
                        </p>
                        <button
                          onClick={onPatientSearchClick}
                          className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center gap-1.5 cursor-pointer"
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
        </div>
      </div>

      {/* RIGHT COLUMN: SELECTED PATIENT SUMMARY PANEL (4 COLS) */}
      {/* <div className="xl:col-span-4 space-y-6">
          {selectedItem && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                style={{ fontFamily: PP }}
              >
                Selected Patient Summary
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Token Number</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">
                    {selectedItem.token}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Patient Name</span>
                  <span className="font-bold text-[#111827]">
                    {selectedItem.name} ({selectedItem.gender}/{selectedItem.age}Y)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">MRN</span>
                  <span className="font-mono font-bold text-slate-700">
                    {selectedItem.mrn}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Assigned Doctor</span>
                  <span className="font-semibold text-[#111827]">
                    {selectedItem.doctor}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Department</span>
                  <span className="text-slate-600">{selectedItem.dept}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Appointment Slot</span>
                  <span className="font-mono font-medium text-[#111827]">
                    {selectedItem.apptTime}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Queue Status</span>
                  <Chip
                    label={selectedItem.status}
                    variant={getStatusChipVariant(selectedItem.status)}
                  />
                </div>

                {selectedItem.status !== "Checked-In" &&
                  selectedItem.status !== "Completed" && (
                    <button
                      onClick={() =>
                        handleDirectCheckIn(selectedItem.token, selectedItem.mrn)
                      }
                      className="w-full mt-3 py-2.5 px-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      style={{ fontFamily: PP }}
                    >
                      <UserCheck size={15} /> Check-In Patient
                    </button>
                  )}
              </div>
            </div>
          )}
        </div> */}

      {/* CONFIRMATION DIALOG: MARK NO SHOW */}
      {noShowDialogApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
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
                <strong>Patient:</strong> {noShowDialogApt.name} (
                {noShowDialogApt.mrn})
              </p>
              <p>
                <strong>Doctor:</strong> {noShowDialogApt.doctor} (
                {noShowDialogApt.dept})
              </p>
              <p>
                <strong>Time Slot:</strong> {noShowDialogApt.apptTime}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoShowDialogApt(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkNoShow(noShowDialogApt.token)}
                className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 shadow-xs cursor-pointer"
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

export default ReceptionQueueManagementScreen;
