import { useState, useEffect, useCallback, useReducer } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Eye,
  X,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import type { PatientAppointment, ApiPatientAppointment } from "../types/patient.types";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import { PP, RB } from "../constants/patient.fonts";
import { usePatientPortal } from "../context/usePatientPortal";
import type { FamilyMember } from "./FamilyMembersManagement";
import {
  PatientCancelAppointmentDialog,
  PatientRescheduleAppointmentDialog,
} from "../components/PatientDialogs";
import { BookAppointmentScreen } from "../../appointments/pages/BookAppointmentScreen";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { Pagination } from "../../../common/components/Pagination";
import type { ApiResponse } from "../../auth/types/auth.types";
import { to24Hour } from "../../../lib/time-utils";
import { downloadAppointmentSlipPdf } from "../../../utils/appointmentPdf.utils";

function formatDisplayTime(timeStr?: string): string {
  if (!timeStr) return "09:00 AM";
  const trimmed = timeStr.trim();
  if (trimmed.toUpperCase().includes("AM") || trimmed.toUpperCase().includes("PM")) {
    return trimmed;
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return trimmed;
  let hour = parseInt(match[1], 10);
  const min = match[2];
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  const hStr = hour < 10 ? `0${hour}` : `${hour}`;
  return `${hStr}:${min} ${ampm}`;
}

function formatStatusPretty(s?: string): string {
  if (!s) return "Booked";
  const upper = s.toUpperCase().replace(/_/g, " ");
  if (upper === "BOOKED") return "Booked";
  if (upper === "SCHEDULED") return "Scheduled";
  if (upper === "CONFIRMED") return "Confirmed";
  if (upper === "IN CONSULTATION" || upper === "IN PROGRESS") return "In Consultation";
  if (upper === "CHECKED IN") return "Checked-In";
  if (upper === "WAITING FOR VITALS") return "Waiting for Vitals";
  if (upper === "WAITING FOR DOCTOR") return "Waiting for Doctor";
  if (upper === "COMPLETED" || upper === "CONSULTATION COMPLETED") return "Completed";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

type AppointmentListState = {
  appointments: PatientAppointment[];
  viewMode: "list" | "book";
};
type AppointmentListAction =
  | { type: "SET_VIEW_MODE"; viewMode: "list" | "book" }
  | { type: "SET_APPOINTMENTS"; appointments: PatientAppointment[] }
  | { type: "CLEAR_APPOINTMENTS" };
const appointmentListReducer = (
  state: AppointmentListState,
  action: AppointmentListAction,
): AppointmentListState => {
  switch (action.type) {
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.viewMode };
    case "SET_APPOINTMENTS":
      return { ...state, appointments: action.appointments };
    case "CLEAR_APPOINTMENTS":
      return { ...state, appointments: [] };
  }
};

type FilterState = {
  reschedulingAppt: PatientAppointment | null;
  activeTab: "all" | "upcoming" | "completed" | "cancelled";
  searchQuery: string;
  deptFilter: string;
  doctorFilter: string;
  statusFilter: string;
  visitTypeFilter: string;
  dateRangeFilter: string;
  toastMsg: string | null;
};

type FilterAction =
  | { type: "SET_RESCHEDULING"; appointment: PatientAppointment | null }
  | { type: "SET_ACTIVE_TAB"; tab: "all" | "upcoming" | "completed" | "cancelled" }
  | {
      type: "SET_FILTER";
      field:
        | "searchQuery"
        | "deptFilter"
        | "doctorFilter"
        | "statusFilter"
        | "visitTypeFilter"
        | "dateRangeFilter";
      value: string;
    }
  | { type: "RESET_FILTERS" }
  | { type: "SET_TOAST"; msg: string | null }
  | { type: "CLEAR_TOAST" };

const filterReducer = (
  state: FilterState,
  action: FilterAction,
): FilterState => {
  switch (action.type) {
    case "SET_RESCHEDULING":
      return { ...state, reschedulingAppt: action.appointment };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "RESET_FILTERS":
      return {
        ...state,
        activeTab: "all",
        searchQuery: "",
        deptFilter: "All",
        doctorFilter: "All",
        statusFilter: "All",
        visitTypeFilter: "All",
        dateRangeFilter: "All",
      };
    case "SET_TOAST":
      return { ...state, toastMsg: action.msg };
    case "CLEAR_TOAST":
      return { ...state, toastMsg: null };
    default:
      return state;
  }
};

type BookingDrawerState = {
  showBookDrawer: boolean;
  editingAppt: PatientAppointment | null;
  selectedDetailsAppt: PatientAppointment | null;
  formDept: string;
  formDoctor: string;
  formDate: string;
  formTime: string;
  formType: "In-Person OPD" | "Follow-up OPD";
  formReason: string;
  formNotes: string;
  currentPage: number;
};

type BookingDrawerAction =
  | { type: "OPEN_BOOK_DRAWER"; appt?: PatientAppointment }
  | { type: "CLOSE_BOOK_DRAWER" }
  | { type: "SET_BOOKING_FIELD"; field: keyof Omit<BookingDrawerState, "showBookDrawer" | "editingAppt" | "selectedDetailsAppt">; value: string | number }
  | { type: "SET_SELECTED_DETAILS"; appt: PatientAppointment | null }
  | { type: "SET_CURRENT_PAGE"; page: number };

const bookingDrawerReducer = (
  state: BookingDrawerState,
  action: BookingDrawerAction,
): BookingDrawerState => {
  switch (action.type) {
    case "OPEN_BOOK_DRAWER": {
      if (action.appt) {
        return {
          ...state,
          showBookDrawer: true,
          editingAppt: action.appt,
          formDept: action.appt.department,
          formDoctor: action.appt.doctor,
          formDate: action.appt.date,
          formTime: action.appt.time,
          formType: action.appt.visitType as "In-Person OPD" | "Follow-up OPD",
          formReason: action.appt.reason,
          formNotes: action.appt.notes,
        };
      }
      return {
        ...state,
        showBookDrawer: true,
        editingAppt: null,
        formDept: "Cardiology",
        formDoctor: "Dr. Arjun Mehta",
        formDate: "2025-03-30",
        formTime: "10:30 AM",
        formType: "In-Person OPD",
        formReason: "",
        formNotes: "",
      };
    }
    case "CLOSE_BOOK_DRAWER":
      return {
        ...state,
        showBookDrawer: false,
        editingAppt: null,
      };
    case "SET_BOOKING_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_SELECTED_DETAILS":
      return { ...state, selectedDetailsAppt: action.appt };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.page };
    default:
      return state;
  }
};

export function PatientAppointmentsScreen({
  activePatient: propActivePatient,
}: {
  activePatient?: FamilyMember;
}) {
  const portal = usePatientPortal();
  const activePatient = propActivePatient ?? portal?.activePatient;
  const [listState, dispatch] = useReducer(appointmentListReducer, {
    appointments: [],
    viewMode: "list" as const,
  });
  const [cancellingAppt, setCancellingAppt] =
    useState<PatientAppointment | null>(null);
  const [prevPatientMrn, setPrevPatientMrn] = useState<string | number | null>(
    null,
  );

  const activePatientMrn = activePatient?.mrn || activePatient?.id || null;

  if (activePatientMrn !== prevPatientMrn) {
    setPrevPatientMrn(activePatientMrn);
    dispatch({ type: "CLEAR_APPOINTMENTS" });
  }

  const loadAppointments = useCallback((patient?: FamilyMember | null) => {
    const targetMrn = patient?.mrn || patient?.id;
    if (!targetMrn) {
      return;
    }
    appointmentsApi
      .getPatientAppointments(targetMrn)
      .then((res: ApiResponse<unknown>) => {
        type ApiPatientAppointmentWithType = ApiPatientAppointment & {
          appointmentType?: string;
        };
        const data = res?.data || res;
        const list: ApiPatientAppointmentWithType[] = Array.isArray(data)
          ? data
          : data &&
              typeof data === "object" &&
              "content" in data &&
              Array.isArray((data as { content?: unknown }).content)
            ? ((data as { content: ApiPatientAppointmentWithType[] }).content)
            : [];
        if (list && list.length > 0) {
          const mapped: PatientAppointment[] = list.map(
            (a: ApiPatientAppointmentWithType, idx: number) => {
              const dt = a.visitDateTime || a.appointmentDate || a.date || "";
              const datePart = dt.includes("T") ? dt.split("T")[0] : dt;
              const timePart = dt.includes("T")
                ? dt.split("T")[1]?.substring(0, 5)
                : a.startTime || a.time || "";

              const doctorRaw = a.doctor;
              let doctorName = "";

              if (doctorRaw && typeof doctorRaw === "object" && doctorRaw !== null) {
                const docObj = doctorRaw as {
                  name?: string;
                  fullName?: string;
                  doctorName?: string;
                  nameEn?: string;
                  user?: { name?: string; fullName?: string };
                };
                doctorName =
                  docObj.fullName ||
                  docObj.name ||
                  docObj.doctorName ||
                  docObj.nameEn ||
                  docObj.user?.fullName ||
                  docObj.user?.name ||
                  "";
              } else if (typeof doctorRaw === "string" && doctorRaw.trim()) {
                doctorName = doctorRaw.trim();
              }

              if (!doctorName) {
                const alt = a as {
                  doctorName?: string;
                  doctor_name?: string;
                  doctorFullName?: string;
                  assignedDoctor?: string;
                  assignedDoctorName?: string;
                  docName?: string;
                };
                doctorName =
                  alt.doctorName ||
                  alt.doctor_name ||
                  alt.doctorFullName ||
                  alt.assignedDoctor ||
                  alt.assignedDoctorName ||
                  alt.docName ||
                  "Unassigned Doctor";
              }

              if (
                doctorName &&
                doctorName !== "Unassigned Doctor" &&
                !doctorName.toLowerCase().startsWith("dr.") &&
                !doctorName.toLowerCase().startsWith("dr ")
              ) {
                doctorName = `Dr. ${doctorName}`;
              }

              const deptRaw = a.department;
              let deptName: string;
              if (deptRaw && typeof deptRaw === "object" && deptRaw !== null) {
                deptName =
                  (deptRaw as { departmentName?: string; name?: string })
                    .departmentName ||
                  (deptRaw as { departmentName?: string; name?: string })
                    .name ||
                  "General";
              } else if (typeof deptRaw === "string" && deptRaw.trim()) {
                deptName = deptRaw.trim();
              } else {
                deptName = String(a.departmentName || "General");
              }

              let formattedStatus: PatientAppointment["status"] = "Confirmed";
              const rawStatus = (
                a.appointmentStatus ||
                a.status ||
                "SCHEDULED"
              ).toUpperCase();
              if (rawStatus === "COMPLETED") {
                formattedStatus = "Completed";
              } else if (rawStatus === "CANCELLED") {
                formattedStatus = "Cancelled";
              } else if (
                rawStatus === "SCHEDULED" ||
                rawStatus === "BOOKED" ||
                rawStatus === "CONFIRMED"
              ) {
                formattedStatus = "Confirmed";
              } else if (rawStatus === "PENDING") {
                formattedStatus = "Pending";
              } else if (
                rawStatus === "IN_PROGRESS" ||
                rawStatus === "IN-PROGRESS" ||
                rawStatus === "IN CONSULTATION"
              ) {
                formattedStatus = "In Progress";
              } else if (
                rawStatus === "CHECKED_IN" ||
                rawStatus === "CHECKED-IN"
              ) {
                formattedStatus = "Checked-In";
              } else if (rawStatus === "WAITING_FOR_VITALS") {
                formattedStatus = "Waiting for Vitals";
              } else if (
                rawStatus === "WAITING_FOR_DOCTOR" ||
                rawStatus === "WAITING_FOR_DOCTOR_CALL" ||
                rawStatus === "WAITING_FOR_CONSULTATION" ||
                rawStatus === "VITALS_DONE"
              ) {
                formattedStatus = "Waiting for Doctor";
              }

              const patRaw = a.patient || a.patientName;
              let pName = patient?.name || activePatient?.name || "";
              if (patRaw && typeof patRaw === "object" && patRaw !== null) {
                pName = (patRaw as { fullName?: string; name?: string }).fullName || (patRaw as { name?: string }).name || pName;
              } else if (typeof patRaw === "string" && patRaw.trim()) {
                pName = patRaw.trim();
              } else if (a.patientName) {
                pName = String(a.patientName);
              }

              const apptIdStr = String(a.appointmentId || a.id || `APT-${idx}`);
              const storedReason = localStorage.getItem(`appt_reason_${apptIdStr}`);
              const storedNotes = localStorage.getItem(`appt_notes_${apptIdStr}`);

              const finalReason =
                a.reason ||
                a.chiefComplaint ||
                a.chief_complaint ||
                a.reasonForVisit ||
                a.visitReason ||
                a.appointmentReason ||
                a.complaint ||
                a.visitDetails?.reason ||
                a.visitDetails?.chiefComplaint ||
                a.details?.reason ||
                a.description ||
                storedReason ||
                "General Consultation";

              const finalNotes =
                a.notes ||
                a.symptoms ||
                a.remarks ||
                a.clinicalNotes ||
                a.visitNotes ||
                a.comments ||
                a.visitDetails?.notes ||
                a.visitDetails?.remarks ||
                a.details?.notes ||
                storedNotes ||
                "No additional remarks";

              return {
                id: apptIdStr,
                patientName: pName || patient?.name || activePatient?.name || "Patient",
                date: datePart,
                time: timePart,
                doctorId: a.doctorId,
                doctor: doctorName,
                specialty: a.specialty || deptName,
                department: deptName,
                visitType: (a.visitType === "Follow-up OPD" ||
                a.visitType === "FOLLOW_UP"
                  ? "Follow-up OPD"
                  : "In-Person OPD") as "Follow-up OPD" | "In-Person OPD",
                status: formattedStatus,
                roomLocation: a.roomLocation || a.opdRoom || a.roomNo || "OPD Room",
                reason: finalReason,
                notes: finalNotes,
                consultationStatus: rawStatus,
                prescriptionStatus: a.prescriptionStatus || "Pending",
                billingStatus: a.billingStatus || a.paymentStatus || "Pending",
                billingAmount: a.billingAmount || "$50.00",
              };
            },
          );
          dispatch({ type: "SET_APPOINTMENTS", appointments: mapped });
        } else {
          dispatch({ type: "CLEAR_APPOINTMENTS" });
        }
      })
      .catch(() => {
        dispatch({ type: "CLEAR_APPOINTMENTS" });
      });
  }, [activePatient]);

  useEffect(() => {
    loadAppointments(activePatient);
  }, [activePatient, loadAppointments]);

  const [filterState, filterDispatch] = useReducer(filterReducer, {
    reschedulingAppt: null,
    activeTab: "all" as const,
    searchQuery: "",
    deptFilter: "All",
    doctorFilter: "All",
    statusFilter: "All",
    visitTypeFilter: "All",
    dateRangeFilter: "All",
    toastMsg: null,
  });

  // Drawer & form states
  const [booking, bookingDispatch] = useReducer(bookingDrawerReducer, {
    showBookDrawer: false,
    editingAppt: null,
    selectedDetailsAppt: null,
    formDept: "Cardiology",
    formDoctor: "Dr. Arjun Mehta",
    formDate: "2025-03-30",
    formTime: "10:30 AM",
    formType: "In-Person OPD",
    formReason: "",
    formNotes: "",
    currentPage: 1,
  });

  const openBookDrawer = (appt?: PatientAppointment) =>
    bookingDispatch({ type: "OPEN_BOOK_DRAWER", appt });
  const closeBookDrawer = () => bookingDispatch({ type: "CLOSE_BOOK_DRAWER" });
  const setBookingField = <K extends keyof Omit<BookingDrawerState, "showBookDrawer" | "editingAppt" | "selectedDetailsAppt">>(
    field: K,
    value: BookingDrawerState[K],
  ) => bookingDispatch({ type: "SET_BOOKING_FIELD", field, value });
  const setSelectedDetails = (appt: PatientAppointment | null) =>
    bookingDispatch({ type: "SET_SELECTED_DETAILS", appt });

  const triggerToast = (msg: string) => {
    filterDispatch({ type: "SET_TOAST", msg });
    setTimeout(() => filterDispatch({ type: "CLEAR_TOAST" }), 3000);
  };

  if (listState.viewMode === "book") {
    return (
      <BookAppointmentScreen
        role="patient"
        initialMrn={
          activePatient?.mrn ||
          (activePatient?.id ? String(activePatient.id) : undefined)
        }
        onBack={() => dispatch({ type: "SET_VIEW_MODE", viewMode: "list" })}
        onBookSuccess={(createdAppt?: AppointmentRecord, openDetailsDrawer?: boolean) => {
          dispatch({ type: "SET_VIEW_MODE", viewMode: "list" });
          loadAppointments(activePatient);
          triggerToast("Appointment booked successfully!");

          if (openDetailsDrawer && createdAppt) {
            const formatted: PatientAppointment = {
              id: String(createdAppt.id || createdAppt.appointmentNumber || "APT-CONFIRMED"),
              patientName: createdAppt.patientName || activePatient?.name || "Patient",
              date: createdAppt.appointmentDate || createdAppt.date || "2026-08-25",
              time: createdAppt.startTime || createdAppt.time || "10:30 AM",
              doctor: createdAppt.doctorName || (typeof createdAppt.doctor === "string" ? createdAppt.doctor : (createdAppt.doctor as { fullName?: string; name?: string } | undefined)?.fullName || (createdAppt.doctor as { name?: string } | undefined)?.name || "Doctor"),
              specialty: createdAppt.specialty || createdAppt.departmentName || "OPD",
              department: createdAppt.departmentName || (typeof createdAppt.department === "string" ? createdAppt.department : (createdAppt.department as { departmentName?: string; name?: string } | undefined)?.departmentName || (createdAppt.department as { name?: string } | undefined)?.name || "OPD"),
              visitType: (createdAppt.visitType === "Follow-up OPD" ? "Follow-up OPD" : "In-Person OPD"),
              status: "Scheduled",
              roomLocation: "Wing A, OPD Room 102",
              reason: createdAppt.reason || "General Consultation",
              notes: createdAppt.symptoms || createdAppt.notes || "No additional remarks",
              consultationStatus: "Scheduled",
              prescriptionStatus: "Pending",
              billingStatus: "Pending",
              billingAmount: "$65.00",
            };
            setSelectedDetails(formatted);
          }
        }}
      />
    );
  }

  // Summary counts
  const totalCount = listState.appointments.length;
  const upcomingAppointments = listState.appointments.filter((a) =>
    [
      "Confirmed",
      "Scheduled",
      "In Progress",
      "Checked-In",
      "Pending",
      "Waiting for Vitals",
      "Waiting for Doctor",
    ].includes(a.status),
  );
  const upcomingCount = upcomingAppointments.length;
  const completedCount = listState.appointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = listState.appointments.filter(
    (a) => a.status === "Cancelled",
  ).length;

  // Next Appointment Snapshot
  const nextAppointment =
    upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  const filteredAppointments = listState.appointments.filter((appt) => {
    // Tab Filter
    if (filterState.activeTab === "upcoming") {
      if (
        ![
          "Confirmed",
          "Scheduled",
          "In Progress",
          "Checked-In",
          "Pending",
          "Waiting for Vitals",
          "Waiting for Doctor",
        ].includes(appt.status)
      )
        return false;
    }
    if (filterState.activeTab === "completed" && appt.status !== "Completed") return false;
    if (filterState.activeTab === "cancelled" && appt.status !== "Cancelled") return false;

    // Search Query
    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      const match =
        appt.id.toLowerCase().includes(q) ||
        (appt.patientName && appt.patientName.toLowerCase().includes(q)) ||
        appt.doctor.toLowerCase().includes(q) ||
        appt.department.toLowerCase().includes(q) ||
        appt.reason.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Dropdown Filters
    if (filterState.deptFilter !== "All" && appt.department !== filterState.deptFilter) return false;
    if (filterState.doctorFilter !== "All" && appt.doctor !== filterState.doctorFilter) return false;
    if (filterState.statusFilter !== "All" && appt.status !== filterState.statusFilter) return false;
    if (filterState.visitTypeFilter !== "All" && appt.visitType !== filterState.visitTypeFilter)
      return false;

    // Date Range Filter
    if (filterState.dateRangeFilter !== "All") {
      const apptDate = new Date(appt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filterState.dateRangeFilter === "Today") {
        const dateStr = today.toISOString().split("T")[0];
        if (appt.date !== dateStr) return false;
      } else if (filterState.dateRangeFilter === "This Week") {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        if (apptDate < today || apptDate > nextWeek) return false;
      } else if (filterState.dateRangeFilter === "This Month") {
        const sameMonth =
          apptDate.getFullYear() === today.getFullYear() &&
          apptDate.getMonth() === today.getMonth();
        if (!sameMonth) return false;
      }
    }

    return true;
  });

  // Pagination
  const pageSize = 10;
  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice(
    (booking.currentPage - 1) * pageSize,
    booking.currentPage * pageSize,
  );

  // Handlers
  const handleOpenBookDrawer = (apptToReschedule?: PatientAppointment) => {
    openBookDrawer(apptToReschedule);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (booking.editingAppt) {
      dispatch({
        type: "SET_APPOINTMENTS",
        appointments: listState.appointments.map((a) =>
          a.id === booking.editingAppt!.id
            ? {
                ...a,
                department: booking.formDept,
                doctor: booking.formDoctor,
                date: booking.formDate,
                time: booking.formTime,
                visitType: booking.formType,
                reason: booking.formReason || a.reason,
                notes: booking.formNotes || a.notes,
                status: "Scheduled",
              }
            : a,
        ),
      });
      triggerToast(
        `Appointment ${booking.editingAppt.id} successfully rescheduled for ${booking.formDate} at ${booking.formTime}!`,
      );
    } else {
      const newAppt: PatientAppointment = {
        id: `APT-2025-00${listState.appointments.length + 1}`,
        date: booking.formDate,
        time: booking.formTime,
        doctor: booking.formDoctor,
        specialty:
          booking.formDept === "Cardiology" ? "Senior Cardiologist" : "Specialist",
        department: booking.formDept,
        visitType: booking.formType,
        status: "Scheduled",
        roomLocation:
          booking.formType === "Follow-up OPD"
            ? "Wing A, OPD Room 202"
            : "Wing A, OPD Room 102",
        reason: booking.formReason || "General Consultation",
        notes: booking.formNotes || "Booked via Patient Portal",
        consultationStatus: "Scheduled",
        prescriptionStatus: "Pending Consultation",
        billingStatus: "Pending ($65.00)",
        billingAmount: "$65.00",
      };
      dispatch({
        type: "SET_APPOINTMENTS",
        appointments: [newAppt, ...listState.appointments],
      });
      triggerToast(`New appointment ${newAppt.id} booked successfully!`);
    }
    closeBookDrawer();
  };

  const handleCancelAppointment = async (
    id: string,
    reason: string,
    comments?: string,
  ) => {
    try {
      await appointmentsApi.cancelAppointment(id, {
        reason: reason || comments || "Patient request",
      });
      loadAppointments(activePatient);
      triggerToast(`Appointment ${id} has been cancelled.`);
    } catch {
      triggerToast(`Failed to cancel appointment ${id}.`);
    }
  };

  const handleResetFilters = () => {
    filterDispatch({ type: "RESET_FILTERS" });
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback Banner */}
       {filterState.toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
           <span>{filterState.toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-1.5">
            <span>Patient Portal</span>
            <ChevronRight size={12} className="text-slate-400" />
            {activePatient?.name && (
              <>
                <span className="text-slate-500 font-medium">{activePatient.name}</span>
                <ChevronRight size={12} className="text-slate-400" />
              </>
            )}
            <span className="font-semibold text-[#0D47A1]">Appointments</span>
          </div>
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
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              dispatch({ type: "SET_VIEW_MODE", viewMode: "book" })
            }
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
                 value={filterState.searchQuery}
                 onChange={(e) =>
                   filterDispatch({
                     type: "SET_FILTER",
                     field: "searchQuery",
                     value: e.target.value,
                   })
                 }
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
                 value={filterState.statusFilter}
                 onChange={(e) =>
                   filterDispatch({
                     type: "SET_FILTER",
                     field: "statusFilter",
                     value: e.target.value,
                   })
                 }
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
                 value={filterState.deptFilter}
                 onChange={(e) =>
                   filterDispatch({
                     type: "SET_FILTER",
                     field: "deptFilter",
                     value: e.target.value,
                   })
                 }
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
                 value={filterState.visitTypeFilter}
                 onChange={(e) =>
                   filterDispatch({
                     type: "SET_FILTER",
                     field: "visitTypeFilter",
                     value: e.target.value,
                   })
                 }
                 className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
               >
                <option value="All">All Visit Types</option>
                <option value="In-Person OPD">In-Person OPD</option>
                <option value="Follow-up OPD">Follow-up OPD</option>
                <option value="Routine Checkup">Routine Checkup</option>
              </select>

              {/* Date Range Filter */}
               <select
                 value={filterState.dateRangeFilter}
                 onChange={(e) =>
                   filterDispatch({
                     type: "SET_FILTER",
                     field: "dateRangeFilter",
                     value: e.target.value,
                   })
                 }
                 className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
               >
                <option value="All">All Date Ranges</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              {/* Reset Filters Action */}
               {(filterState.deptFilter !== "All" ||
                 filterState.doctorFilter !== "All" ||
                 filterState.statusFilter !== "All" ||
                 filterState.visitTypeFilter !== "All" ||
                 filterState.dateRangeFilter !== "All" ||
                 filterState.searchQuery ||
                 filterState.activeTab !== "all") && (
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
               const isActive = filterState.activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() =>
                     filterDispatch({
                       type: "SET_ACTIVE_TAB",
                       tab: tab.id as "all" | "upcoming" | "completed" | "cancelled",
                     })
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
                        <th className="px-4 py-3.5 font-bold">Patient Name</th>
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
                      {paginatedAppointments.map((appt) => {
                        const isUpcoming = [
                          "Confirmed",
                          "Scheduled",
                          "In Progress",
                          "Checked-In",
                          "Pending",
                          "Waiting for Vitals",
                          "Waiting for Doctor",
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

                            {/* Patient Name */}
                            <td className="px-4 py-4 font-bold text-[#111827]">
                              {appt.patientName || activePatient?.name || "Patient"}
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
                              {formatDisplayTime(appt.time)}
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
                                          : appt.status === "In Progress"
                                            ? "bg-purple-50 text-purple-600"
                                            : appt.status === "Checked-In"
                                              ? "bg-indigo-50 text-indigo-600"
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
                                            : appt.status === "In Progress"
                                              ? "bg-purple-500"
                                              : appt.status === "Checked-In"
                                                ? "bg-indigo-500"
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
                                  onClick={() => setSelectedDetails(appt)}
                                  className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Appointment Details"
                                >
                                  <Eye size={15} />
                                </button>

                                {/* Reschedule */}
                                {isUpcoming && (
                                  <button
                                     onClick={() => filterDispatch({ type: "SET_RESCHEDULING", appointment: appt })}
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

                {/* Pagination */}
                <Pagination
                  currentPage={booking.currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => bookingDispatch({ type: "SET_CURRENT_PAGE", page })}
                  pageSize={pageSize}
                  totalCount={filteredAppointments.length}
                />
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="md:hidden space-y-3">
                {paginatedAppointments.map((appt) => {
                  const isUpcoming = [
                    "Confirmed",
                    "Scheduled",
                    "In Progress",
                    "Checked-In",
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
                                  : appt.status === "In Progress"
                                    ? "bg-purple-50 text-purple-600"
                                    : appt.status === "Checked-In"
                                      ? "bg-indigo-50 text-indigo-600"
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
                            onClick={() => setSelectedDetails(appt)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                          >
                            Details
                          </button>
                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => filterDispatch({ type: "SET_RESCHEDULING", appointment: appt })}
                                className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-xl hover:bg-blue-100"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => setCancellingAppt(appt)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100"
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
              <div className="p-4 rounded-xl bg-linear-to-br from-blue-50/80 to-slate-50 border border-blue-100 space-y-3">
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
                    onClick={() =>
                      setSelectedDetails(nextAppointment)
                    }
                    className="flex-1 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => filterDispatch({ type: "SET_RESCHEDULING", appointment: nextAppointment })}
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
        </div>
      </div>

      {/* ── 4. RIGHT DRAWER: BOOK / RESCHEDULE APPOINTMENT ── */}
      {booking.showBookDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => closeBookDrawer()}
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
                    {booking.editingAppt
                      ? `Reschedule ${booking.editingAppt.id}`
                      : "Book New Appointment"}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Select doctor, date & available slot
                  </p>
                </div>
                <button
                  onClick={() => closeBookDrawer()}
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
                    value={booking.formDept}
                    onChange={(e) => setBookingField("formDept", e.target.value)}
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
                    value={booking.formDoctor}
                    onChange={(e) => setBookingField("formDoctor", e.target.value)}
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
                      onClick={() => setBookingField("formType", "In-Person OPD")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        booking.formType === "In-Person OPD"
                          ? "border-[#0D47A1] bg-blue-50 text-[#0D47A1]"
                          : "border-[#E5E7EB] bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Building2 size={14} /> In-Person OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingField("formType", "Follow-up OPD")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        booking.formType === "Follow-up OPD"
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
                      value={booking.formDate}
                      onChange={(e) => setBookingField("formDate", e.target.value)}
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
                          onClick={() => setBookingField("formTime", t)}
                          className={`py-1.5 rounded-lg border text-xs font-semibold text-center transition-colors ${
                            booking.formTime === t
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
                      value={booking.formReason}
                      onChange={(e) => setBookingField("formReason", e.target.value)}
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
                      value={booking.formNotes}
                      onChange={(e) => setBookingField("formNotes", e.target.value)}
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
                        {booking.formDoctor}
                      </span>
                    </div>
                    <div>
                      Dept:{" "}
                      <span className="font-semibold text-[#111827]">
                        {booking.formDept}
                      </span>
                    </div>
                    <div>
                      Date:{" "}
                      <span className="font-semibold text-[#111827]">
                        {booking.formDate}
                      </span>
                    </div>
                    <div>
                      Time:{" "}
                      <span className="font-semibold text-[#111827]">
                        {booking.formTime}
                      </span>
                    </div>
                    <div>
                      Type:{" "}
                      <span className="font-semibold text-[#111827]">
                        {booking.formType}
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
                    {booking.editingAppt ? "Confirm Reschedule" : "Confirm Appointment"}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeBookDrawer()}
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
      {booking.selectedDetailsAppt && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedDetails(null)}
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
                    {booking.selectedDetailsAppt.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDetails(null)}
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
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-sm shrink-0 border border-blue-100">
                      {booking.selectedDetailsAppt.doctor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .replace("D", "")
                        .replace("r", "")
                        .replace(".", "")
                        .slice(0, 2)
                        .toUpperCase() || "DR"}
                    </div>
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {booking.selectedDetailsAppt.doctor}
                      </h3>
                      <div className="text-xs text-[#64748B]">
                        {booking.selectedDetailsAppt.specialty} ·{" "}
                        {booking.selectedDetailsAppt.department}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Patient Name
                      </span>
                      <span className="font-bold text-[#111827]">
                        {booking.selectedDetailsAppt.patientName || activePatient?.name || "Patient"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Appointment Date
                      </span>
                      <span className="font-semibold text-[#111827]">
                        {booking.selectedDetailsAppt.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Appointment Time
                      </span>
                      <span className="font-semibold text-[#0D47A1]">
                        {formatDisplayTime(booking.selectedDetailsAppt.time)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Visit Type
                      </span>
                      <span className="font-medium text-slate-700">
                        {booking.selectedDetailsAppt.visitType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">
                        Hospital Location
                      </span>
                      <span className="font-medium text-slate-700">
                        {booking.selectedDetailsAppt.roomLocation}
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
                        {booking.selectedDetailsAppt.status}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Consultation Status
                      </span>
                      <span className="font-bold text-[#0D47A1]">
                        {formatStatusPretty(booking.selectedDetailsAppt.consultationStatus)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Prescription Status
                      </span>
                      <span className="font-medium text-slate-700">
                        {booking.selectedDetailsAppt.prescriptionStatus}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">
                        Billing Status
                      </span>
                      <span className="font-bold text-amber-600">
                        {booking.selectedDetailsAppt.billingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visit Details Section */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Visit Details
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block font-medium">
                      Chief Complaint / Reason for Visit
                    </span>
                    <p className="text-xs text-[#111827] mt-0.5 font-medium">
                      {booking.selectedDetailsAppt.reason || "General Consultation"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <span className="text-[#64748B] text-[11px] block font-medium">
                      Remarks & Symptoms / Notes
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {booking.selectedDetailsAppt.notes || "No additional remarks"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                <button
                  onClick={() => {
                    if (booking.selectedDetailsAppt) {
                      downloadAppointmentSlipPdf(booking.selectedDetailsAppt);
                      triggerToast(
                        `Downloading slip for ${booking.selectedDetailsAppt.id}...`,
                      );
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} /> Download Appointment Slip
                </button>
                <button
                  onClick={() => {
                    const apptToReschedule = booking.selectedDetailsAppt;
                    setSelectedDetails(null);
                    filterDispatch({ type: "SET_RESCHEDULING", appointment: apptToReschedule });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-blue-200 text-xs font-bold text-[#0D47A1] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={15} /> Reschedule
                </button>
                <button
                  onClick={() => {
                    const apptToCancel = booking.selectedDetailsAppt;
                    setSelectedDetails(null);
                    setCancellingAppt(apptToCancel);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-[#EF4444] bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <XCircle size={15} /> Cancel
                </button>
                <button
                  onClick={() => setSelectedDetails(null)}
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
        onConfirmCancel={(id, reason, comments) => {
          handleCancelAppointment(id, reason, comments);
        }}
        onBookNewAppointment={() => {
          setCancellingAppt(null);
          dispatch({ type: "SET_VIEW_MODE", viewMode: "book" });
        }}
      />

      {/* ── RESCHEDULE APPOINTMENT DIALOG ── */}
       <PatientRescheduleAppointmentDialog
         appointment={filterState.reschedulingAppt}
         isOpen={!!filterState.reschedulingAppt}
         onClose={() => filterDispatch({ type: "SET_RESCHEDULING", appointment: null })}
        onConfirmReschedule={async (id, newDate, newTime, reason) => {
          try {
            await appointmentsApi.rescheduleAppointment(id, {
              appointmentDate: newDate,
              startTime: to24Hour(newTime),
              reason: reason || "Patient request",
            });
            loadAppointments(activePatient);
            triggerToast(
              `Appointment ${id} rescheduled to ${newDate} at ${newTime}!`,
            );
          } catch (err: unknown) {
            const errorMsg =
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              (err instanceof Error ? err.message : "Requested reschedule slot is unavailable.");
            triggerToast(`Error: ${errorMsg}`);
            throw new Error(errorMsg, { cause: err });
          }
        }}
        onViewDetails={(appt) => {
          setSelectedDetails(appt);
        }}
      />
    </div>
  );
}

