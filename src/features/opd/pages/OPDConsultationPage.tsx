import React, {
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router";
import {
  Clock,
  Download,
  Phone,
  Plus,
  FolderOpen,
  CheckCircle2,
  X,
  Printer,
  FileText,
} from "lucide-react";
import { usePermissions } from "../../../permissions/usePermissions";
import { useConsultation } from "../hooks/useConsultation";
import { useQueue } from "../hooks/useQueue";
import {
  type ConsultationRecord,
  type OauthRole,
  type ConsultationStatus,
  type MedicineItem,
  appointmentStatusMap,
  isDoctorConsultationStatus,
} from "../types/consultation";
import type { QueueItem } from "../types/queue.types";
import type { AppointmentStatus } from "../../appointments/types/appointment.types";
import { useAuthStore } from "../../auth/store/auth.store";
import { normalizeStatus } from "../../../lib/status-utils";
import { getTodayDateString } from "../../../lib/time-utils";
import { EncounterPrescriptionViewModal } from "../../prescriptions/components/EncounterPrescriptionViewModal";

import { ConsultationHeader } from "../components/ConsultationHeader";
import { ConsultationKPICards } from "../components/ConsultationKPICards";
import { ConsultationFilters } from "../components/ConsultationFilters";
import { ConsultationTabs } from "../components/ConsultationTabs";
import { ConsultationTable } from "../components/ConsultationTable";
import { OperationalSummaryModal } from "../components/OperationalSummaryModal";

const PP = "'Poppins', system-ui, sans-serif";

export interface OPDConsultationPageProps {
  role?: OauthRole;
  onStartConsultation?: (consultationId?: string) => void;
  onOpenConsultation?: (consultationId?: string) => void;
  onViewDetails?: (consultationId: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onPatientSelect?: (patientId: string) => void;
  onNavigateAppointments?: () => void;
  onNavigateReports?: () => void;
  onExportReport?: () => void;
}

function mapQueueItemToConsultation(item: QueueItem): ConsultationRecord {
  const statusMap: Record<string, ConsultationStatus> = {
    WAITING: "WAITING_FOR_DOCTOR",
    WAITING_FOR_VITALS: "WAITING_FOR_VITALS",
    WAITING_FOR_DOCTOR: "WAITING_FOR_DOCTOR",
    WAITING_FOR_DOCTOR_CALL: "WAITING_FOR_DOCTOR",
    CALLED: "CALLED",
    IN_CONSULTATION: "IN_CONSULTATION",
    IN_PROGRESS: "IN_CONSULTATION",
    CONSULTATION_COMPLETED: "COMPLETED",
    COMPLETED: "COMPLETED",
    FINALIZED: "COMPLETED",
    FINISHED: "COMPLETED",
    CLOSED: "COMPLETED",
    READY_FOR_BILLING: "COMPLETED",
    BILLING_PENDING: "COMPLETED",
    PAYMENT_COMPLETED: "COMPLETED",
    CHECKED_OUT: "COMPLETED",
    DONE: "COMPLETED",
  };
  const rawStatus =
    (item as { appointmentStatus?: string }).appointmentStatus ||
    item.status ||
    item.queueStatus ||
    "";
  const normalizedStatus = normalizeStatus(rawStatus);

  return {
    id: String(item.appointmentId),
    appointmentId: item.appointmentId,
    tokenNo: item.token || "",
    patientName: item.patient?.name || "",
    mrn: item.patient?.mrn || "",
    age: Number(item.patient?.age || 0),
    gender: (item.patient?.gender === "FEMALE"
      ? "Female"
      : item.patient?.gender === "MALE"
        ? "Male"
        : "Other") as "Male" | "Female" | "Other",
    phone: item.patient?.contact || "",
    doctor: item.doctor?.name || "",
    department: item.doctor?.department || "",
    appointmentTime: item.checkInTime || "",
    visitType: "First Visit" as const,
    status:
      statusMap[normalizedStatus] || (normalizedStatus as ConsultationStatus),
    chiefComplaint: "",
    opdRoom: "",
    date:
      item.checkInTime?.split("T")[0] || new Date().toISOString().split("T")[0],
    vitals: undefined,
    clinicalExamination: undefined,
    advice: undefined,
    doctorName: item.doctor?.name || "",
    completionTime: "",
    allergies: [],
    bloodGroup: "",
    durationOfSymptoms: "",
  };
}

export function OPDConsultationPage({
  role: overrideRole,
  onStartConsultation,
  onOpenConsultation,
  onViewDetails,
  onViewHistory,
  onPatientSelect,
  onNavigateAppointments,
  onExportReport,
}: OPDConsultationPageProps) {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const user = useAuthStore((s) => s.user);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const {
    callPatient: apiCallPatient,
    startConsultation: apiStartConsultation,
  } = useConsultation();

  const userRoleUpper = String(user?.role || "").toUpperCase();
  const isDoctor = overrideRole
    ? overrideRole === "doctor"
    : userRoleUpper === "DOCTOR" || userRoleUpper === "ROLE_DOCTOR";
  const resolvedRole: OauthRole = isDoctor ? "doctor" : "admin";

  // Resolve doctorId: parse out DOC- prefix so NaN is never passed
  const rawDocId = isDoctor
    ? (user?.doctorProfile?.doctorId ?? user?.doctorId ?? user?.id ?? undefined)
    : undefined;
  const parsedDocId = rawDocId
    ? String(rawDocId).replace(/^DOC-/, "").trim()
    : undefined;
  const numericDocId =
    parsedDocId && !isNaN(Number(parsedDocId))
      ? Number(parsedDocId)
      : undefined;

  const {
    items: queueItems,
    refetch,
    error: queueError,
  } = useQueue({
    doctorId: numericDocId,
  });

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  const mappedConsultations = useMemo(() => {
    return queueItems.map(mapQueueItemToConsultation);
  }, [queueItems]);

  // Both Admin and Doctor roles on the Consultation page show queue items across the hospital / doctor
  // that have reached the doctor consultation stage (or completed history), excluding pre-vitals statuses.
  const consultations = useMemo(() => {
    return mappedConsultations.filter((item) =>
      isDoctorConsultationStatus(item.status),
    );
  }, [mappedConsultations]);

  type FilterState = {
    filterDate: string;
    filterDoctor: string;
    filterDepartment: string;
    filterStatus: string;
    filterVisitType: string;
  };
  type FilterAction = {
    type: "SET_FIELD";
    field: keyof FilterState;
    value: string;
  };
  const filterReducer = (
    state: FilterState,
    action: FilterAction,
  ): FilterState => ({
    ...state,
    [action.field]: action.value,
  });
  const [filters, dispatch] = useReducer(filterReducer, {
    filterDate: getTodayDateString(),
    filterDoctor: "All",
    filterDepartment: "All",
    filterStatus: "All",
    filterVisitType: "All",
  });
  const setFilter = (field: keyof FilterState, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedPrescriptionRecord, setSelectedPrescriptionRecord] =
    useState<ConsultationRecord | null>(null);
  const [isLoadingPrescription] = useState(false);
  const [viewPrescriptionEncounterId, setViewPrescriptionEncounterId] =
    useState<string | number | null>(null);

  const handleViewPrescriptionDetails = (id: string) => {
    const localRecord = consultations.find((c) => c.id === id);
    if (localRecord) {
      setSelectedPrescriptionRecord(localRecord);
    }
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const waitingStatuses = useMemo(
    () =>
      new Set<ConsultationStatus>([
        "WAITING_FOR_DOCTOR_CALL",
        "WAITING_FOR_DOCTOR",
        "WAITING",
      ]),
    [],
  );

  const doctorOptions = useMemo(() => {
    const docs = Array.from(
      new Set(consultations.flatMap((c) => (c.doctor ? [c.doctor] : []))),
    );
    return [
      { value: "All", label: "All Doctors" },
      ...docs.map((d) => ({ value: d, label: d })),
    ];
  }, [consultations]);

  const departmentOptions = useMemo(() => {
    const depts = Array.from(
      new Set(consultations.flatMap((c) => (c.department ? [c.department] : []))),
    );
    return [
      { value: "All", label: "All Departments" },
      ...depts.map((d) => ({ value: d, label: d })),
    ];
  }, [consultations]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const itemStatusUpper = String(item.status || "")
        .toUpperCase()
        .replace(/[\s-]/g, "_");
      if (activeTab === "Waiting" || activeTab === "WAITING") {
        if (!waitingStatuses.has(itemStatusUpper as ConsultationStatus)) {
          return false;
        }
      } else if (activeTab !== "All") {
        const activeTabUpper = String(activeTab)
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        if (
          activeTabUpper === "COMPLETED" ||
          activeTabUpper === "CONSULTATION_COMPLETED"
        ) {
          const isComp =
            itemStatusUpper === "COMPLETED" ||
            itemStatusUpper === "CONSULTATION_COMPLETED" ||
            itemStatusUpper === "FINALIZED" ||
            itemStatusUpper === "FINISHED" ||
            itemStatusUpper === "CLOSED" ||
            itemStatusUpper === "READY_FOR_BILLING" ||
            itemStatusUpper === "BILLING_PENDING" ||
            itemStatusUpper === "PAYMENT_COMPLETED" ||
            itemStatusUpper === "CHECKED_OUT" ||
            itemStatusUpper === "DONE";
          if (!isComp) return false;
        } else if (itemStatusUpper !== activeTabUpper) {
          return false;
        }
      }
      if (filters.filterStatus !== "All") {
        const filterStatusUpper = String(filters.filterStatus)
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        if (
          filterStatusUpper === "WAITING_FOR_DOCTOR_CALL" ||
          filterStatusUpper === "WAITING_FOR_DOCTOR" ||
          filterStatusUpper === "WAITING"
        ) {
          if (!waitingStatuses.has(itemStatusUpper as ConsultationStatus))
            return false;
        } else if (
          filterStatusUpper === "COMPLETED" ||
          filterStatusUpper === "CONSULTATION_COMPLETED"
        ) {
          const isComp =
            itemStatusUpper === "COMPLETED" ||
            itemStatusUpper === "CONSULTATION_COMPLETED" ||
            itemStatusUpper === "FINALIZED" ||
            itemStatusUpper === "FINISHED" ||
            itemStatusUpper === "CLOSED" ||
            itemStatusUpper === "READY_FOR_BILLING" ||
            itemStatusUpper === "BILLING_PENDING" ||
            itemStatusUpper === "PAYMENT_COMPLETED" ||
            itemStatusUpper === "CHECKED_OUT" ||
            itemStatusUpper === "DONE";
          if (!isComp) return false;
        } else if (itemStatusUpper !== filterStatusUpper) {
          return false;
        }
      }
      if (
        filters.filterVisitType !== "All" &&
        item.visitType !== filters.filterVisitType
      )
        return false;
      if (
        filters.filterDepartment !== "All" &&
        item.department !== filters.filterDepartment
      )
        return false;
      if (
        filters.filterDoctor !== "All" &&
        item.doctor !== filters.filterDoctor
      )
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchMrn = item.mrn.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchPhone = (item.phone || "").toLowerCase().includes(q);
        const matchDoc = item.doctor.toLowerCase().includes(q);
        if (!matchName && !matchMrn && !matchId && !matchPhone && !matchDoc)
          return false;
      }

      return true;
    });
  }, [
    consultations,
    activeTab,
    filters.filterStatus,
    filters.filterVisitType,
    filters.filterDepartment,
    filters.filterDoctor,
    searchQuery,
    waitingStatuses,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilter("filterDate", new Date().toISOString().split("T")[0]);
    setFilter("filterDoctor", "All");
    setFilter("filterDepartment", "All");
    setFilter("filterStatus", "All");
    setFilter("filterVisitType", "All");
    setActiveTab("All");
  };

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    refetch();
    setTimeout(() => setIsLoading(false), 500);
  }, [refetch]);

  const tabCounts = useMemo(() => {
    const waitingCount = consultations.filter((c) => {
      const statusUpper = String(c.status || "")
        .toUpperCase()
        .replace(/[\s-]/g, "_");
      return waitingStatuses.has(statusUpper as ConsultationStatus);
    }).length;
    const counts: Record<string, number> = {
      All: consultations.length,
      WAITING: waitingCount,
      WAITING_FOR_DOCTOR: waitingCount,
      WAITING_FOR_DOCTOR_CALL: waitingCount,
      CALLED: consultations.filter((c) => {
        const s = String(c.status || "")
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        return s === "CALLED";
      }).length,
      IN_CONSULTATION: consultations.filter((c) => {
        const s = String(c.status || "")
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        return s === "IN_CONSULTATION";
      }).length,
      COMPLETED: consultations.filter((c) => {
        const s = String(c.status || "")
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        return (
          s === "COMPLETED" ||
          s === "CONSULTATION_COMPLETED" ||
          s === "FINALIZED" ||
          s === "FINISHED" ||
          s === "CLOSED" ||
          s === "READY_FOR_BILLING" ||
          s === "BILLING_PENDING" ||
          s === "PAYMENT_COMPLETED" ||
          s === "CHECKED_OUT" ||
          s === "DONE"
        );
      }).length,
      Waiting: waitingCount,
    };
    return counts;
  }, [consultations, waitingStatuses]);

  const currentPatient = consultations.find((c) => {
    const s = String(c.status || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
    return s === "IN_CONSULTATION";
  });
  const calledPatient = consultations.find((c) => {
    const s = String(c.status || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
    return s === "CALLED";
  });
  const nextPatient = consultations.find((c) => {
    const s = String(c.status || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
    return waitingStatuses.has(s as ConsultationStatus);
  });
  const hasCalledPatient = consultations.some((c) => {
    const s = String(c.status || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
    return s === "CALLED";
  });

  const handleCallPatient = async (record: ConsultationRecord) => {
    const statusUpper = String(record.status || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
    if (!waitingStatuses.has(statusUpper as ConsultationStatus)) {
      return;
    }
    const aptId = record.appointmentId || record.id;
    await apiCallPatient(aptId);
    await refetch();
  };

  const handleStartConsultation = async (
    record?: ConsultationRecord,
  ): Promise<void> => {
    if (!record) {
      if (calledPatient) await handleStartConsultation(calledPatient);
      return;
    }
    if (record.status !== "CALLED") return;
    try {
      setIsLoading(true);
      await apiStartConsultation(
        {
          id: record.id,
          patientId: record.id,
          patientName: record.patientName,
          doctorId: 0,
          doctorName: record.doctor,
          departmentName: record.department,
          appointmentTime: record.appointmentTime,
          time: record.appointmentTime || "",
          appointmentDate: record.date,
          tokenNumber: record.tokenNo,
          roomNumber: record.opdRoom,
          appointmentType: record.visitType,
          status: record.status as AppointmentStatus,
          chiefComplaint: record.chiefComplaint,
        },
        record.chiefComplaint,
      );
      await refetch();
      if (onStartConsultation) {
        onStartConsultation(record.id);
      } else {
        navigate("/consultation/workspace");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to start consultation";
      console.error("Failed to start consultation:", err);
      triggerToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConsultation = (id: string) => {
    if (onOpenConsultation) {
      onOpenConsultation(id);
    } else {
      navigate("/consultation/workspace");
    }
  };

  const handleExportReport = () => {
    if (onExportReport) {
      onExportReport();
    } else {
      alert("Exporting OPD Operational Report (PDF/Excel)");
    }
  };

  const tabs = [
    { id: "All", label: "All", count: tabCounts.All },
    {
      id: "Waiting",
      label: "Waiting",
      count: tabCounts.Waiting || 0,
    },
    {
      id: "IN_CONSULTATION",
      label: appointmentStatusMap["IN_CONSULTATION"],
      count: tabCounts.IN_CONSULTATION || 0,
    },
    {
      id: "COMPLETED",
      label: appointmentStatusMap.COMPLETED,
      count: tabCounts.COMPLETED || 0,
    },
  ];

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <ConsultationHeader
        roleLabel={resolvedRole === "admin" ? "Hospital Admin" : "Doctor"}
        moduleLabel="OPD Consultation Management"
        pageTitle={
          resolvedRole === "admin"
            ? "OPD Consultation Monitoring"
            : "OPD Consultation Management"
        }
        subtitle={
          resolvedRole === "admin"
            ? "Monitor outpatient consultation workflow and doctor activities."
            : "Manage outpatient consultations and patient visits efficiently."
        }
        breadcrumbs={[]}
        actions={
          resolvedRole === "admin" ? (
            <>
              <button
                onClick={() => setShowSummaryModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Clock size={16} className="text-[#0D47A1]" />
                Today's Summary
              </button>
              <button
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Download size={16} />
                Export Report
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onNavigateAppointments}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Clock size={16} className="text-[#0D47A1]" />
                Today's Queue
              </button>
              {can("CONSULTATION_START") && hasCalledPatient && (
                <button
                  onClick={() => handleStartConsultation(calledPatient)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white text-sm font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={16} /> Start Consultation
                </button>
              )}
              {can("CONSULTATION_START") &&
                !hasCalledPatient &&
                nextPatient && (
                  <button
                    onClick={() => handleCallPatient(nextPatient)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <Phone size={16} /> Call Next Patient
                  </button>
                )}
              {can("CONSULTATION_START") && currentPatient && (
                <button
                  onClick={() => handleOpenConsultation(currentPatient.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <FolderOpen size={16} /> Open Consultation
                </button>
              )}
            </>
          )
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {queueError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load consultation queue:{" "}
            {queueError instanceof Error
              ? queueError.message
              : "Please refresh and try again."}
          </div>
        )}
        {toastMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {toastMsg}
          </div>
        )}
        {/* ── SUMMARY KPI CARDS ── */}
        <ConsultationKPICards
          role={resolvedRole}
          consultations={consultations}
          tabCounts={tabCounts}
        />

        {/* LEFT & CENTER CONTENT */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* SEARCH AND FILTER BAR */}
          <ConsultationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterDate={filters.filterDate}
            onDateChange={(value) => setFilter("filterDate", value)}
            filterDoctor={filters.filterDoctor}
            onDoctorChange={(value) => setFilter("filterDoctor", value)}
            filterDepartment={filters.filterDepartment}
            onDepartmentChange={(value) => setFilter("filterDepartment", value)}
            filterStatus={filters.filterStatus}
            onStatusChange={(value) => setFilter("filterStatus", value)}
            filterVisitType={filters.filterVisitType}
            onVisitTypeChange={(value) => setFilter("filterVisitType", value)}
            onReset={handleResetFilters}
            onApply={handleRefresh}
            resultCount={filteredConsultations.length}
            placeholder={
              resolvedRole === "doctor"
                ? "Search by Patient Name, MRN, Consultation ID or Mobile Number..."
                : "Search by Patient Name, MRN, Consultation ID or Doctor Name..."
            }
            doctorOptions={doctorOptions}
            departmentOptions={departmentOptions}
            showStatusFilter={true}
            showVisitTypeFilter={true}
          />

          {/* CONSULTATION STATUS TABS */}
          <ConsultationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {/* ENTERPRISE DATA TABLE */}
          <ConsultationTable
            role={resolvedRole}
            filteredConsultations={filteredConsultations}
            isLoading={isLoading}
            onStartConsultation={
              resolvedRole === "doctor"
                ? (id) => {
                    const record = consultations.find((c) => c.id === id);
                    if (record) handleStartConsultation(record);
                  }
                : undefined
            }
            onOpenConsultation={
              resolvedRole === "doctor" ? handleOpenConsultation : undefined
            }
            onCallPatient={
              resolvedRole === "doctor" ? handleCallPatient : undefined
            }
            onViewDetails={handleViewPrescriptionDetails}
            onViewHistory={onViewHistory}
            onPatientSelect={onPatientSelect}
            onPrint={(item) =>
              void alert(`Printed Operational Summary for ${item.id}`)
            }
            onResetFilters={handleResetFilters}
            canStartConsultation={can("CONSULTATION_START")}
            canPrint={can("CONSULTATION_PRINT")}
          />
        </div>
      </div>
      {/* ── TODAY'S SUMMARY MODAL (Admin only) ── */}
      <OperationalSummaryModal
        show={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        consultations={consultations}
        tabCounts={tabCounts}
      />

      {/* ── CONSULTATION FINALIZED / PRESCRIPTION SUMMARY MODAL ── */}
      {selectedPrescriptionRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl p-8 border border-slate-100 animate-in fade-in duration-200 my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Consultation Finalized
                  </h2>
                  <p className="text-xs text-slate-500">
                    The encounter has been completed and saved successfully.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrescriptionRecord(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Printable Content Wrapper */}
            <div className="space-y-6 flex-1 mt-6">
              {isLoadingPrescription && (
                <div className="py-2 text-center text-xs text-[#0D47A1] font-semibold flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin"></div>
                  Loading complete consultation record...
                </div>
              )}

              {/* Patient & Encounter Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Details */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.patientName}
                    </span>
                    <span className="text-slate-500">MRN:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedPrescriptionRecord.mrn}
                    </span>
                    <span className="text-slate-500">Age / Gender:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.age} Years /{" "}
                      {selectedPrescriptionRecord.gender}
                    </span>
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.phone}
                    </span>
                  </div>
                </div>

                {/* Encounter Details */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Encounter Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Encounter ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ENC-
                      {selectedPrescriptionRecord.encounterId ||
                        selectedPrescriptionRecord.id}
                    </span>
                    <span className="text-slate-500">Doctor Name:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.doctorName ||
                        selectedPrescriptionRecord.doctor}
                    </span>
                    <span className="text-slate-500">Department:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.department}
                    </span>
                    <span className="text-slate-500">Visit Type:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.visitType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Symptoms & SOAP Notes
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        Chief Complaint:
                      </span>
                      <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1">
                        {selectedPrescriptionRecord.chiefComplaint || "None"}
                      </span>
                    </div>
                    {selectedPrescriptionRecord.clinicalExamination && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          Clinical Examination:
                        </span>
                        <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1">
                          {selectedPrescriptionRecord.clinicalExamination}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Diagnosis
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        Final Diagnosis:
                      </span>
                      <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1 font-semibold">
                        {selectedPrescriptionRecord.finalDiagnosis ||
                          "Recorded"}
                      </span>
                    </div>
                    {selectedPrescriptionRecord.icdCode && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          ICD-10 Code:
                        </span>
                        <span className="font-mono text-[#0D47A1] block bg-blue-50 p-2 rounded-lg mt-1 font-semibold">
                          {selectedPrescriptionRecord.icdCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Prescribed Medications */}
              {selectedPrescriptionRecord.medicines &&
                selectedPrescriptionRecord.medicines.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl p-5 space-y-3">
                    <h3
                      className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Prescribed Medications (Rx)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-medium">
                            <th className="py-2 pr-4 font-bold text-slate-500">
                              Medicine
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Dosage
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Frequency
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Duration
                            </th>
                            <th className="py-2 pl-4 font-bold text-slate-500">
                              Instructions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedPrescriptionRecord.medicines.map(
                            (med: MedicineItem) => (
                              <tr
                                key={med.id || med.name}
                                className="text-slate-700"
                              >
                                <td className="py-2.5 pr-4 font-bold text-slate-800">
                                  {med.name}
                                </td>
                                <td className="py-2.5 px-4">{med.dosage}</td>
                                <td className="py-2.5 px-4">{med.frequency}</td>
                                <td className="py-2.5 px-4">{med.duration}</td>
                                <td className="py-2.5 pl-4 text-slate-500 italic">
                                  {med.instructions || "After food"}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Advice & Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    General & Diet Advice
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        General Advice:
                      </span>
                      <span className="text-slate-600 block mt-1">
                        {selectedPrescriptionRecord.chiefComplaint ||
                          "Follow doctor advice"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Instructions
                  </h3>
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs">
                    <span className="font-bold text-amber-800 block">
                      Next Recommended Visit:
                    </span>
                    <span className="font-mono text-amber-700 block font-bold mt-0.5">
                      {selectedPrescriptionRecord.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                onClick={() => setSelectedPrescriptionRecord(null)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                style={{ fontFamily: PP }}
              >
                Close & Exit
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const encId =
                      selectedPrescriptionRecord?.encounterId ||
                      selectedPrescriptionRecord?.id;
                    if (encId) setViewPrescriptionEncounterId(encId);
                  }}
                  className="px-6 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <FileText size={16} /> View Prescription
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Printer size={16} /> Print Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      <EncounterPrescriptionViewModal
        encounterId={viewPrescriptionEncounterId}
        isOpen={Boolean(viewPrescriptionEncounterId)}
        onClose={() => setViewPrescriptionEncounterId(null)}
      />
    </div>
  );
}

export const OpdConsultationCenterScreen: React.FC<OPDConsultationPageProps> =
  OPDConsultationPage;
