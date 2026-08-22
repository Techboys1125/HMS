import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCheck,
  Calendar,
  Stethoscope,
  Edit,
  FileText,
  Droplets,
  Printer,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { PatientProfileScreenProps } from "../types/patient.types";
import type {
  Patient,
  ApiPatientAppointment,
  ApiPatientPrescription,
  ApiPatientInvoice,
} from "../types/patient.types";
import { PP, RB } from "../constants/patient.fonts";
import { formatTime } from "../../../lib/time-utils";
import { Avatar, Chip } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadges";
import { Pagination } from "../../../common/components/Pagination";
import { patientsApi } from "../api/patient.api";
import {
  mapApiPatientToPatientRecord,
  extractDoctorName,
} from "../api/mapApiPatientToPatientRecord";
import { useAuthStore } from "../../auth/store/auth.store";
import { can, type Role } from "../utils/patientPermissions";

export function PatientProfileScreen({
  onBack,
  onEditPatient,
  onBookAppointment,
  onCheckInClick,
  patientMrn = "",
}: PatientProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "appointments"
    | "visits"
    | "medical-history"
    | "billing"
    | "documents"
  >("overview");

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<ApiPatientAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<ApiPatientPrescription[]>(
    [],
  );
  const [billing, setBilling] = useState<ApiPatientInvoice[]>([]);
  const [loading, setLoading] = useState(!patientMrn ? false : true);
  const [error, setError] = useState<string | null>(
    !patientMrn ? "No patient MRN provided" : null,
  );

  const missingMrn = !patientMrn;

  useEffect(() => {
    if (missingMrn) return;

    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [rawPatient, appts, rxBills, bills] = await Promise.allSettled([
          patientsApi.getPatientByMrn(patientMrn),
          patientsApi.getAppointments(patientMrn),
          patientsApi.getPrescriptions(patientMrn),
          patientsApi.getBilling(patientMrn),
        ]);

        if (!cancelled) {
          if (rawPatient.status === "fulfilled") {
            setPatient(mapApiPatientToPatientRecord(rawPatient.value));

            const safeArray = <T,>(val: unknown): T[] => {
              if (Array.isArray(val)) return val as T[];
              if (val && typeof val === "object") {
                const obj = val as Record<string, unknown>;
                if (Array.isArray(obj.content)) return obj.content as T[];
                if (Array.isArray(obj.data)) return obj.data as T[];
                if (Array.isArray(obj.items)) return obj.items as T[];
              }
              return [];
            };

            if (appts.status === "fulfilled")
              setAppointments(safeArray(appts.value));
            if (rxBills.status === "fulfilled")
              setPrescriptions(safeArray(rxBills.value));
            if (bills.status === "fulfilled")
              setBilling(safeArray(bills.value));
          } else {
            setError("Failed to load patient profile");
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load patient data");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, [patientMrn, missingMrn]);

  const mrn = patient?.mrn || patientMrn;

  const displayName =
    patient?.fullName || patient?.name || patient?.patientName || "Patient";
  const displayAge = patient?.age ?? "";
  const displayGender = patient?.gender || "";
  const displayDob = patient?.dob || patient?.dateOfBirth || "";
  const displayBloodGroup = (
    patient?.bloodGroup ||
    patient?.blood_type ||
    ""
  ).replace(/_/g, " ");
  const displayPhone =
    patient?.phone || patient?.mobileNumber || patient?.mobile || "";
  const displayEmail = patient?.email || "";
  const displayAddress =
    typeof patient?.address === "string"
      ? patient.address
      : patient?.address?.addressLine1 || patient?.address?.street || "";
  const displayMaritalStatus = patient?.maritalStatus || "";
  const displayStatus = patient?.status || "ACTIVE";
  const displayRegDate = patient?.registrationDate || patient?.createdAt || "";
  const displayRegType = patient?.registrationType || "";
  const displayCategory = patient?.patientCategory || "General";
  const displayAssignedDoctor =
    extractDoctorName(patient) || patient?.assignedDoctor || "";
  const displayPhoto = patient?.photoUrl || patient?.photo || "";

  const emergencyContactName =
    patient?.emergencyContact?.name ||
    patient?.emergencyContact?.contactName ||
    "";
  const emergencyContactRelation =
    patient?.emergencyContact?.relationship || "";
  const emergencyContactPhone =
    patient?.emergencyContact?.mobile ||
    patient?.emergencyContact?.contactNumber ||
    patient?.emergencyContact?.mobileNumber ||
    "";

  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];
  const safeBilling = Array.isArray(billing) ? billing : [];

  const sortedAppointments = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    return safeAppointments.toSorted((a, b) => {
      const da = a.appointmentDate || a.date || "";
      const db = b.appointmentDate || b.date || "";
      return db.localeCompare(da);
    });
  }, [appointments]);

  const visitHistory = useMemo(
    () =>
      sortedAppointments.filter(
        (a) =>
          (a.status || a.appointmentStatus || "").toLowerCase() ===
            "completed" ||
          (a.status || a.appointmentStatus || "").toLowerCase() ===
            "checked-in",
      ),
    [sortedAppointments],
  );

  const upcomingAppointments = useMemo(
    () =>
      sortedAppointments.filter(
        (a) =>
          (a.status || a.appointmentStatus || "").toLowerCase() ===
            "scheduled" ||
          (a.status || a.appointmentStatus || "").toLowerCase() === "confirmed",
      ),
    [sortedAppointments],
  );

  const totalVisits = visitHistory.length;
  const lastVisitDate =
    visitHistory.length > 0
      ? visitHistory[0].appointmentDate || visitHistory[0].date || ""
      : "";
  const nextAppointmentDate =
    upcomingAppointments.length > 0
      ? upcomingAppointments[0].appointmentDate ||
        upcomingAppointments[0].date ||
        ""
      : "";
  const activePrescriptions = safePrescriptions.filter(
    (p) =>
      (p.status || "").toLowerCase() === "issued" ||
      (p.status || "").toLowerCase() === "active",
  ).length;
  const unpaidBilling = safeBilling.filter(
    (b) =>
      (b.status || "").toLowerCase() !== "paid" &&
      (b.status || "").toLowerCase() !== "voided",
  ).length;

  const [apptPage, setApptPage] = useState(1);
  const apptPageSize = 10;
  const apptTotalPages = Math.max(
    1,
    Math.ceil(sortedAppointments.length / apptPageSize),
  );
  const paginatedAppointments = sortedAppointments.slice(
    (apptPage - 1) * apptPageSize,
    apptPage * apptPageSize,
  );

  const [visitPage, setVisitPage] = useState(1);
  const visitPageSize = 10;
  const visitTotalPages = Math.max(
    1,
    Math.ceil(visitHistory.length / visitPageSize),
  );
  const paginatedVisits = visitHistory.slice(
    (visitPage - 1) * visitPageSize,
    visitPage * visitPageSize,
  );

  const [billingPage, setBillingPage] = useState(1);
  const billingPageSize = 10;
  const billingTotalPages = Math.max(
    1,
    Math.ceil(billing.length / billingPageSize),
  );
  const paginatedBilling = billing.slice(
    (billingPage - 1) * billingPageSize,
    billingPage * billingPageSize,
  );

  const getStatusChipVariant = (status: string) => {
    switch (status) {
      case "Scheduled":
      case "CONFIRMED":
        return "info";
      case "Checked-In":
      case "Waiting for Vitals":
        return "teal";
      case "Waiting":
      case "Waiting for Doctor":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const userRole = useAuthStore((s) => s.user?.role);
  const normalizedRole: Role =
    String(userRole || "").toUpperCase() === "RECEPTIONIST"
      ? "RECEPTIONIST"
      : String(userRole || "").toUpperCase() === "NURSE"
        ? "NURSE"
        : String(userRole || "").toUpperCase() === "ACCOUNTANT"
          ? "ACCOUNTANT"
          : String(userRole || "").toUpperCase() === "PATIENT"
            ? "PATIENT"
            : String(userRole || "").toUpperCase() === "DOCTOR"
              ? "DOCTOR"
              : "ADMIN";

  const allTabs = [
    {
      id: "overview" as const,
      label: "Overview",
      action: "viewProfile" as const,
    },
    {
      id: "appointments" as const,
      label: "Appointments",
      action: "viewAppointments" as const,
    },
    {
      id: "visits" as const,
      label: "Visit History",
      action: "viewAppointments" as const,
    },
    {
      id: "billing" as const,
      label: "Billing",
      action: "viewBilling" as const,
    },
    {
      id: "documents" as const,
      label: "Documents",
      action: "viewProfile" as const,
    },
  ];

  const tabs = allTabs.filter((t) => can(normalizedRole, t.action));

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
        <div className="flex items-center justify-center min-h-100">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#0D47A1]" />
            <span className="text-sm text-slate-500">
              Loading patient profile...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
        <div className="flex items-center justify-center min-h-100">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={32} className="text-red-400" />
            <span className="text-sm text-slate-600 font-medium">
              {error || "Patient not found"}
            </span>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="w-full space-y-6">
        {/* ── HEADER & BREADCRUMBS ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Patient Profile
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs text-slate-500 pl-8"
            style={{ fontFamily: RB }}
          >
            <span>Reception Management</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patient Search
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">{displayName}</span>
          </div>
        </div>

        {/* ── PATIENT HERO HEADER ── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={displayName} size="lg" src={displayPhoto} />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {displayName}
                </h2>
                <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {mrn}
                </span>
                <StatusBadge status={displayStatus} />
              </div>
              <div
                className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1"
                style={{ fontFamily: RB }}
              >
                {displayAge && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <UserCheck size={14} className="text-slate-400" />{" "}
                    {displayAge} Y / {displayGender}
                  </span>
                )}
                {displayBloodGroup && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Droplets size={14} className="text-red-500" />{" "}
                    {displayBloodGroup}
                  </span>
                )}
                {displayPhone && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone size={14} className="text-slate-400" />{" "}
                    {displayPhone}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                {displayRegDate && (
                  <span>Reg: {formatDisplayDate(displayRegDate)}</span>
                )}
                {displayAssignedDoctor && (
                  <>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1">
                      <Stethoscope size={13} className="text-[#009688]" />{" "}
                      {displayAssignedDoctor}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {can(normalizedRole, "manageAppointments") && (
              <button
                onClick={() => onBookAppointment?.(mrn)}
                className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Calendar size={14} /> Book Appointment
              </button>
            )}
            {can(normalizedRole, "checkIn") && (
              <button
                onClick={() => onCheckInClick?.(undefined, mrn)}
                className="px-3.5 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <UserCheck size={14} /> Patient Check-In
              </button>
            )}
            {can(normalizedRole, "editProfile") && (
              <button
                onClick={onEditPatient}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Edit size={14} className="text-slate-500" /> Edit Patient
                Information
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} className="text-slate-500" /> Print Patient
              Card
            </button>
          </div>
        </div>

        {/* ── KPI SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Total Visits
            </div>
            <div
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {totalVisits}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Last Visit
            </div>
            <div className="text-xs font-bold text-[#111827] mt-1">
              {lastVisitDate ? formatDisplayDate(lastVisitDate) : "—"}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Upcoming
            </div>
            <div className="text-xs font-bold text-[#0D47A1] mt-1">
              {nextAppointmentDate
                ? formatDisplayDate(nextAppointmentDate)
                : "—"}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Active Scripts
            </div>
            <div
              className="text-xl font-bold text-[#009688]"
              style={{ fontFamily: PP }}
            >
              {activePrescriptions}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Outstanding
            </div>
            <div
              className={`text-xs font-bold mt-1 ${unpaidBilling > 0 ? "text-amber-600" : "text-green-600"}`}
            >
              {unpaidBilling > 0 ? `${unpaidBilling} Invoice(s)` : "Cleared"}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Category
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              {displayCategory}
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-12 space-y-6">
            {/* TAB NAVIGATION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#0D47A1] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  style={{ fontFamily: PP }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-105"
              style={{ fontFamily: RB }}
            >
              {/* ── TAB: OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal & Emergency Contact Details */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]"
                        style={{ fontFamily: PP }}
                      >
                        Personal &amp; Emergency Contact Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Date of Birth &amp; Marital Status
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayDob ? formatDisplayDate(displayDob) : "—"}
                            {displayAge ? ` (${displayAge} Yrs)` : ""}
                            {displayMaritalStatus
                              ? ` · ${displayMaritalStatus}`
                              : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Residential Address
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayAddress || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Email Address
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayEmail || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Emergency Contact Person &amp; Phone
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {emergencyContactName
                              ? `${emergencyContactName}${emergencyContactRelation ? ` (${emergencyContactRelation})` : ""}${emergencyContactPhone ? ` — ${emergencyContactPhone}` : ""}`
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Registration & Reception Details */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-[#009688]"
                        style={{ fontFamily: PP }}
                      >
                        Registration &amp; Reception Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Registration Date
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayRegDate
                              ? formatDisplayDate(displayRegDate)
                              : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Registration Type
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayRegType || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Patient Category
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayCategory}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Primary Care Doctor
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {displayAssignedDoctor || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Known Allergies & Chronic Conditions */}
                  {((patient.knownAllergies &&
                    patient.knownAllergies.length > 0) ||
                    (patient.chronicDiseases &&
                      patient.chronicDiseases.length > 0)) && (
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-3">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-red-500"
                        style={{ fontFamily: PP }}
                      >
                        Medical Alerts
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(patient.knownAllergies || []).map((a) => (
                          <span
                            key={`allergy-${a}`}
                            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-semibold border border-red-100"
                          >
                            Allergy: {a}
                          </span>
                        ))}
                        {(patient.chronicDiseases || []).map((d) => (
                          <span
                            key={`chronic-${d}`}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-100"
                          >
                            Chronic: {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Appointments Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                        style={{ fontFamily: PP }}
                      >
                        Recent Appointments Summary
                      </h3>
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className="text-xs font-bold text-[#0D47A1] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {sortedAppointments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        No appointments found
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {sortedAppointments.slice(0, 3).map((a) => (
                          <div
                            key={String(a.id || a.appointmentId)}
                            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                          >
                            <div>
                              <div className="font-bold text-[#111827] text-xs">
                                {typeof a.doctor === "object"
                                  ? (a.doctor as { name?: string }).name
                                  : a.doctor || a.doctorName || "—"}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {typeof a.department === "object"
                                  ? (
                                      a.department as {
                                        departmentName?: string;
                                      }
                                    ).departmentName
                                  : a.department ||
                                    a.departmentName ||
                                    "—"}{" "}
                                •{" "}
                                {formatDisplayDate(
                                  a.appointmentDate || a.date || "",
                                )}{" "}
                                {a.time || a.startTime
                                  ? `(${formatTime(a.time || a.startTime || "")})`
                                  : ""}
                              </div>
                            </div>
                            <StatusBadge
                              status={a.status || a.appointmentStatus || ""}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: APPOINTMENTS ── */}
              {activeTab === "appointments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Appointment History
                    </h3>
                    <button
                      onClick={() => onBookAppointment?.(mrn)}
                      className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1"
                      style={{ fontFamily: PP }}
                    >
                      <Calendar size={14} /> Book Appointment
                    </button>
                  </div>
                  {sortedAppointments.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">
                      No appointments found
                    </p>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table
                          className="w-full text-left text-xs"
                          style={{ fontFamily: RB }}
                        >
                          <thead>
                            <tr
                              className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                              style={{ fontFamily: PP }}
                            >
                              <th className="px-3 py-2.5">Appt ID</th>
                              <th className="px-3 py-2.5">Doctor</th>
                              <th className="px-3 py-2.5">Department</th>
                              <th className="px-3 py-2.5">Date &amp; Time</th>
                              <th className="px-3 py-2.5">Status</th>
                              <th className="px-3 py-2.5 text-right">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[#111827]">
                            {paginatedAppointments.map((item) => {
                              const apptId = String(
                                item.id || item.appointmentId || "",
                              );
                              const doctorName =
                                typeof item.doctor === "object"
                                  ? (item.doctor as { name?: string }).name
                                  : item.doctor || item.doctorName || "—";
                              const deptName =
                                typeof item.department === "object"
                                  ? (
                                      item.department as {
                                        departmentName?: string;
                                      }
                                    ).departmentName
                                  : item.department ||
                                    item.departmentName ||
                                    "—";
                              const apptDate =
                                item.appointmentDate || item.date || "";
                              const apptTime =
                                item.time || item.startTime || "";
                              const apptStatus =
                                item.status || item.appointmentStatus || "";
                              return (
                                <tr
                                  key={apptId}
                                  className="hover:bg-slate-50 transition-colors"
                                >
                                  <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">
                                    {apptId}
                                  </td>
                                  <td className="px-3 py-3 font-semibold">
                                    {doctorName}
                                  </td>
                                  <td className="px-3 py-3 text-slate-600">
                                    {deptName}
                                  </td>
                                  <td className="px-3 py-3 font-mono text-slate-500">
                                    {formatDisplayDate(apptDate)}
                                    {apptTime
                                      ? ` · ${formatTime(apptTime)}`
                                      : ""}
                                  </td>
                                  <td className="px-3 py-3">
                                    <Chip
                                      label={apptStatus}
                                      variant={getStatusChipVariant(apptStatus)}
                                    />
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    {apptStatus.toLowerCase() === "scheduled" ||
                                    apptStatus.toLowerCase() === "confirmed" ? (
                                      <button
                                        onClick={() =>
                                          onCheckInClick?.(apptId, mrn)
                                        }
                                        className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                      >
                                        Check-In
                                      </button>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 font-medium">
                                        View Only
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={apptPage}
                        totalPages={apptTotalPages}
                        onPageChange={setApptPage}
                        pageSize={apptPageSize}
                        totalCount={sortedAppointments.length}
                      />
                    </>
                  )}
                </div>
              )}

              {/* ── TAB: VISIT HISTORY ── */}
              {activeTab === "visits" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3
                        className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                        style={{ fontFamily: PP }}
                      >
                        Patient Visit History
                      </h3>
                      <p className="text-xs text-slate-500">
                        Comprehensive log of outpatient consultations,
                        diagnoses, and treatments.
                      </p>
                    </div>
                  </div>
                  {visitHistory.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">
                      No visit history found
                    </p>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-200">
                              {[
                                "Visit Date",
                                "Visit ID",
                                "Doctor",
                                "Department",
                                "Status",
                                "Actions",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3.5 py-3 font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                                  style={{ fontFamily: PP }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {paginatedVisits.map((v) => {
                              const visitId = String(
                                v.id || v.appointmentId || "",
                              );
                              const doctorName =
                                typeof v.doctor === "object"
                                  ? (v.doctor as { name?: string }).name
                                  : v.doctor || v.doctorName || "—";
                              const deptName =
                                typeof v.department === "object"
                                  ? (
                                      v.department as {
                                        departmentName?: string;
                                      }
                                    ).departmentName
                                  : v.department || v.departmentName || "—";
                              const visitDate =
                                v.appointmentDate || v.date || "";
                              const visitStatus =
                                v.status || v.appointmentStatus || "";
                              return (
                                <tr
                                  key={visitId}
                                  className="hover:bg-blue-50/30 transition-colors"
                                >
                                  <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-700">
                                    {formatDisplayDate(visitDate)}
                                  </td>
                                  <td className="px-3.5 py-3 whitespace-nowrap font-mono font-bold text-[#0D47A1]">
                                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                      {visitId}
                                    </span>
                                  </td>
                                  <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-[#111827]">
                                    {doctorName}
                                  </td>
                                  <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">
                                    {deptName}
                                  </td>
                                  <td className="px-3.5 py-3 whitespace-nowrap">
                                    <Chip
                                      label={visitStatus}
                                      variant={getStatusChipVariant(
                                        visitStatus,
                                      )}
                                    />
                                  </td>
                                  <td className="px-3.5 py-3 whitespace-nowrap">
                                    <button
                                      className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1"
                                      style={{ fontFamily: PP }}
                                    >
                                      View Visit
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={visitPage}
                        totalPages={visitTotalPages}
                        onPageChange={setVisitPage}
                        pageSize={visitPageSize}
                        totalCount={visitHistory.length}
                      />
                    </>
                  )}
                </div>
              )}

              {/* ── TAB: MEDICAL HISTORY ── */}
              {activeTab === "medical-history" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Medical History Overview
                    </h3>
                    <span className="text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                      Operational View
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-[#111827]">
                      Primary Clinical Profile
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {patient.medicalHistory &&
                      patient.medicalHistory.length > 0
                        ? patient.medicalHistory.join(", ")
                        : patient.specialNotes ||
                          "No medical history recorded."}
                    </p>
                  </div>
                  {prescriptions.length > 0 && (
                    <div className="space-y-2">
                      <h4
                        className="text-xs font-bold text-slate-600 uppercase tracking-wider"
                        style={{ fontFamily: PP }}
                      >
                        Active Prescriptions
                      </h4>
                      {prescriptions.slice(0, 5).map((rx) => (
                        <div
                          key={String(rx.id)}
                          className="p-3 rounded-xl border border-gray-100 bg-white shadow-sm text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#111827]">
                                {rx.doctorName || "—"}
                              </span>
                              <span className="text-slate-400 mx-1">•</span>
                              <span className="text-slate-600">
                                {rx.department || "—"}
                              </span>
                              <span className="text-slate-400 mx-1">•</span>
                              <span className="text-slate-500">
                                {formatDisplayDate(rx.date || "")}
                              </span>
                            </div>
                            <StatusBadge status={rx.status || ""} />
                          </div>
                          {rx.diagnosis && (
                            <div className="text-slate-500 mt-1">
                              Diagnosis: {rx.diagnosis}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: BILLING ── */}
              {activeTab === "billing" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Billing &amp; Payment Records
                    </h3>
                    <span className="text-[10px] bg-[#0D47A1]/10 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                      Read-Only
                    </span>
                  </div>
                  {billing.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">
                      No billing records found
                    </p>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table
                          className="w-full text-left text-xs"
                          style={{ fontFamily: RB }}
                        >
                          <thead>
                            <tr
                              className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                              style={{ fontFamily: PP }}
                            >
                              <th className="px-3 py-2.5">Invoice No</th>
                              <th className="px-3 py-2.5">Date</th>
                              <th className="px-3 py-2.5">Amount</th>
                              <th className="px-3 py-2.5">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[#111827]">
                            {paginatedBilling.map((inv) => (
                              <tr
                                key={String(inv.id)}
                                className="hover:bg-slate-50"
                              >
                                <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">
                                  {inv.invoiceNumber || `INV-${inv.id}`}
                                </td>
                                <td className="px-3 py-3 font-mono text-slate-500">
                                  {formatDisplayDate(inv.date || "")}
                                </td>
                                <td className="px-3 py-3 font-bold text-[#111827]">
                                  {inv.amount != null ? `$${inv.amount}` : "—"}
                                </td>
                                <td className="px-3 py-3">
                                  <Chip
                                    label={inv.status || "—"}
                                    variant={getStatusChipVariant(
                                      inv.status || "",
                                    )}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={billingPage}
                        totalPages={billingTotalPages}
                        onPageChange={setBillingPage}
                        pageSize={billingPageSize}
                        totalCount={billing.length}
                      />
                    </>
                  )}
                </div>
              )}

              {/* ── TAB: DOCUMENTS ── */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Patient Documents &amp; Records
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#0D47A1]" />
                        <div>
                          <div className="font-bold text-[#111827]">
                            Patient Registration Form
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {displayRegDate
                              ? formatDisplayDate(displayRegDate)
                              : "—"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          console.log("Downloading Registration Document...")
                        }
                        className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[#0D47A1] font-semibold text-[11px] hover:bg-blue-50"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
