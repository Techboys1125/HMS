import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
  import { Clock, Download, Phone, Plus, FolderOpen } from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import { useQueue } from "../hooks/useQueue";
import {
  type ConsultationRecord,
  type OauthRole,
  type ConsultationStatus,
  appointmentStatusMap,
} from "../types/consultation";
import type { QueueItem } from "../types/queue.types";
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
    CALLED: "CALLED",
    IN_CONSULTATION: "IN_CONSULTATION",
    COMPLETED: "COMPLETED",
  };

  return {
    id: String(item.appointmentId),
    appointmentId: item.appointmentId,
    tokenNo: item.token || "",
    patientName: item.patient?.name || "",
    mrn: item.patient?.mrn || "",
    age: Number(item.patient?.age || 0),
    gender: (item.patient?.gender === "FEMALE" ? "Female" : item.patient?.gender === "MALE" ? "Male" : "Other") as "Male" | "Female" | "Other",
    phone: item.patient?.contact || "",
    doctor: item.doctor?.name || "",
    department: item.doctor?.department || "",
    appointmentTime: item.checkInTime || "",
    visitType: "First Visit" as const,
    status: statusMap[item.status] || item.status as ConsultationStatus,
    chiefComplaint: "",
    opdRoom: "",
    date: item.checkInTime?.split("T")[0] || new Date().toISOString().split("T")[0],
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
  onNavigateReports,
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
    : can("CONSULTATION_START");
  const resolvedRole: OauthRole = isDoctor ? "doctor" : "admin";

  const {
    items: queueItems,
    summary: queueSummary,
    isLoading: apiLoading,
    refetch,
    updateParams,
    callPatient: queueCallPatient,
    callNext: queueCallNext,
    isCalling,
  } = useQueue({ doctorId: isDoctor ? (user?.doctorId ?? user?.id ? Number(user.doctorId || user.id) : undefined) : undefined });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  const mappedConsultations = useMemo(() => {
    return queueItems.map(mapQueueItemToConsultation);
  }, [queueItems]);

  useEffect(() => {
    if (mappedConsultations.length > 0) {
      setConsultations(mappedConsultations);
    }
  }, [mappedConsultations]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterVisitType, setFilterVisitType] = useState("All");
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const waitingStatuses: ConsultationStatus[] = useMemo(
    () => ["WAITING", "CALLED"],
    [],
  );

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (activeTab === "Waiting") {
        if (!waitingStatuses.includes(item.status as ConsultationStatus)) {
          return false;
        }
      } else if (activeTab !== "All" && item.status !== activeTab) {
        return false;
      }
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
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
    const counts: Record<string, number> = {
      All: queueSummary.completed + queueSummary.waiting + queueSummary.called + queueSummary.inConsultation,
      WAITING: queueSummary.waiting,
      CALLED: queueSummary.called,
      IN_CONSULTATION: queueSummary.inConsultation,
      COMPLETED: queueSummary.completed,
      Waiting: queueSummary.waiting + queueSummary.called,
    };
    return counts;
  }, [queueSummary]);

  const currentPatient = consultations.find(
    (c) => c.status === "IN_CONSULTATION",
  );
  const calledPatient = consultations.find(
    (c) => c.status === "CALLED",
  );
  const nextPatient = consultations.find(
    (c) => c.status === "WAITING",
  );
  const hasCalledPatient = consultations.some(
    (c) => c.status === "CALLED",
  );

  const handleCallPatient = async (record: ConsultationRecord) => {
    const aptId = record.appointmentId || record.id;
    await apiCallPatient(aptId);
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === record.id
          ? { ...c, status: "CALLED" as ConsultationStatus }
          : c,
      ),
    );
  };

  const handleStartConsultation = async (
    record?: ConsultationRecord,
  ): Promise<void> => {
    if (!record) {
      if (calledPatient) await handleStartConsultation(calledPatient);
      return;
    }
    try {
      setIsLoading(true);
      await apiStartConsultation(
        {
          id: record.id,
          patientName: record.patientName,
          mrn: record.mrn,
          patientAge: record.age,
          patientGender: record.gender,
          patientPhone: record.phone,
          doctorName: record.doctor,
          departmentName: record.department,
          appointmentTime: record.appointmentTime,
          appointmentDate: record.date,
          tokenNo: record.tokenNo,
          opdRoom: record.opdRoom,
          appointmentType: record.visitType,
          chiefComplaint: record.chiefComplaint,
          status: record.status,
        } as any,
        record.chiefComplaint,
      );
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === record.id
            ? { ...c, status: "IN_CONSULTATION" as ConsultationStatus }
            : c,
        ),
      );
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

  const handleNavigateReports = () => {
    if (onNavigateReports) {
      onNavigateReports();
    } else {
      alert("Navigating to Analytics Reports");
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
              {can("CONSULTATION_START") && !hasCalledPatient && nextPatient && (
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
          )}
      />

      <div className="p-6 space-y-6 flex-1">
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
            onViewDetails={onViewDetails}
            onViewHistory={onViewHistory}
            onPatientSelect={onPatientSelect}
            onPrint={(item) =>
              void alert(`Printed Operational Summary for ${item.id}`)
            }
            onResetFilters={handleResetFilters}
            canStartConsultation={can("CONSULTATION_START")}
            canPrint={can("CONSULTATION_PRINT")}
            totalConsultations={consultations.length}
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
    </div>
  );
}

export const OpdConsultationCenterScreen: React.FC<OPDConsultationPageProps> =
  OPDConsultationPage;
export const OpdConsultationMonitoringCenterScreen: React.FC<OPDConsultationPageProps> =
  OPDConsultationPage;

export default OPDConsultationPage;
