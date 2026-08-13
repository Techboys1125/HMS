import React, { useState, useMemo, useCallback, useEffect } from "react";
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
} from "lucide-react";
import { usePermissions } from "../../../permissions";
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
import { useAuthStore } from "../../auth";

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
    WAITING: "WAITING",
    WAITING_FOR_VITALS: "WAITING_FOR_VITALS",
    WAITING_FOR_DOCTOR: "WAITING_FOR_DOCTOR",
    WAITING_FOR_DOCTOR_CALL: "WAITING_FOR_DOCTOR_CALL",
    CALLED: "CALLED",
    IN_CONSULTATION: "IN_CONSULTATION",
    COMPLETED: "COMPLETED",
  };
  const normalizedStatus = String(item.status || "")
    .toUpperCase()
    .replace(/[\s-]/g, "_");

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
  const {
    callPatient: apiCallPatient,
    startConsultation: apiStartConsultation,
  } = useConsultation();

  const isDoctor = overrideRole
    ? overrideRole === "doctor"
    : String(user?.role || "").toUpperCase() === "DOCTOR" ||
      can("CONSULTATION_START");
  const resolvedRole: OauthRole = isDoctor ? "doctor" : "admin";

  const {
    items: queueItems,
    refetch,
    error: queueError,
  } = useQueue({
    doctorId: isDoctor
      ? (user?.doctorId ?? user?.id)
        ? Number(user.doctorId || user.id)
        : undefined
      : undefined,
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

  // The queue endpoint can return appointments from earlier workflow stages.
  // Keep the backend status as the source of truth and admit only consultations
  // that have reached the doctor stage (plus completed history).
  const consultations = useMemo(() => {
    return mappedConsultations.filter((item) =>
      isDoctorConsultationStatus(item.status),
    );
  }, [mappedConsultations]);

  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterVisitType, setFilterVisitType] = useState("All");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedPrescriptionRecord, setSelectedPrescriptionRecord] =
    useState<ConsultationRecord | null>(null);
  const [isLoadingPrescription] = useState(false);

  const handleViewPrescriptionDetails = (id: string) => {
    const localRecord = consultations.find((c) => c.id === id);
    if (localRecord) {
      setSelectedPrescriptionRecord(localRecord);
    }
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const waitingStatuses: ConsultationStatus[] = useMemo(
    () => ["WAITING_FOR_DOCTOR_CALL", "WAITING_FOR_DOCTOR", "WAITING"],
    [],
  );

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const itemStatusUpper = String(item.status || "")
        .toUpperCase()
        .replace(/[\s-]/g, "_");
      if (activeTab === "Waiting" || activeTab === "WAITING") {
        if (!waitingStatuses.includes(itemStatusUpper as ConsultationStatus)) {
          return false;
        }
      } else if (activeTab !== "All") {
        const activeTabUpper = String(activeTab)
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        if (
          activeTabUpper === "WAITING" ||
          activeTabUpper === "WAITING_FOR_DOCTOR_CALL" ||
          activeTabUpper === "WAITING_FOR_DOCTOR"
        ) {
          if (
            !waitingStatuses.includes(itemStatusUpper as ConsultationStatus)
          ) {
            return false;
          }
        } else if (itemStatusUpper !== activeTabUpper) {
          return false;
        }
      }
      if (filterStatus !== "All") {
        const filterStatusUpper = String(filterStatus)
          .toUpperCase()
          .replace(/[\s-]/g, "_");
        if (
          filterStatusUpper === "WAITING_FOR_DOCTOR_CALL" ||
          filterStatusUpper === "WAITING_FOR_DOCTOR" ||
          filterStatusUpper === "WAITING"
        ) {
          if (!waitingStatuses.includes(itemStatusUpper as ConsultationStatus))
            return false;
        } else if (itemStatusUpper !== filterStatusUpper) {
          return false;
        }
      }
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;

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
    filterStatus,
    filterVisitType,
    filterDepartment,
    filterDoctor,
    searchQuery,
    waitingStatuses,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDate(new Date().toISOString().split("T")[0]);
    setFilterDoctor("All");
    setFilterDepartment("All");
    setFilterStatus("All");
    setFilterVisitType("All");
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
      return waitingStatuses.includes(statusUpper as ConsultationStatus);
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
        return s === "COMPLETED";
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
    return waitingStatuses.includes(s as ConsultationStatus);
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
    if (!waitingStatuses.includes(statusUpper as ConsultationStatus)) {
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
      console.error("Failed to start consultation:", err);
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Clock size={16} className="text-[#0D47A1]" />
                Today's Summary
              </button>
              <button
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Clock size={16} className="text-[#0D47A1]" />
                Today's Queue
              </button>
              {can("CONSULTATION_START") && hasCalledPatient && (
                <button
                  onClick={() => handleStartConsultation(calledPatient)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white text-sm font-semibold transition-all shadow-sm"
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <Phone size={16} /> Call Next Patient
                  </button>
                )}
              {can("CONSULTATION_START") && currentPatient && (
                <button
                  onClick={() => handleOpenConsultation(currentPatient.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
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
            Unable to load consultation queue: {queueError instanceof Error
              ? queueError.message
              : "Please refresh and try again."}
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
            placeholder={
              resolvedRole === "doctor"
                ? "Search by Patient Name, MRN, Consultation ID or Mobile Number..."
                : "Search by Patient Name, MRN, Consultation ID or Doctor Name..."
            }
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
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
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

              {/* Vitals Summary Card */}
              <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                <h3
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                  style={{ fontFamily: PP }}
                >
                  Patient Vitals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-blue-50/50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">
                      Height / Weight
                    </div>
                    <div className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.vitals?.height
                        ? `${selectedPrescriptionRecord.vitals.height} cm`
                        : "--"}{" "}
                      /{" "}
                      {selectedPrescriptionRecord.vitals?.weight
                        ? `${selectedPrescriptionRecord.vitals.weight} kg`
                        : "--"}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">
                      Blood Pressure
                    </div>
                    <div className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.vitals?.bp || "--"}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">
                      Pulse / Temp
                    </div>
                    <div className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.vitals?.pulse
                        ? `${selectedPrescriptionRecord.vitals.pulse} bpm`
                        : "--"}{" "}
                      /{" "}
                      {selectedPrescriptionRecord.vitals?.temp
                        ? `${selectedPrescriptionRecord.vitals.temp} °C`
                        : "--"}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">SpO2 / BMI</div>
                    <div className="font-bold text-slate-800">
                      {selectedPrescriptionRecord.vitals?.spo2
                        ? `${selectedPrescriptionRecord.vitals.spo2} %`
                        : "--"}{" "}
                      / {selectedPrescriptionRecord.vitals?.bmi || "--"}
                    </div>
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
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                style={{ fontFamily: PP }}
              >
                Close & Exit
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={16} /> Print Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const OpdConsultationCenterScreen: React.FC<OPDConsultationPageProps> =
  OPDConsultationPage;
export const OpdConsultationMonitoringCenterScreen: React.FC<OPDConsultationPageProps> =
  OPDConsultationPage;

export default OPDConsultationPage;
