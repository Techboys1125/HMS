import React, { useState } from "react";
import { useReceptionQueue } from "../hooks/useReceptionQueue";
import { getReceptionPermissions } from "../permissions/reception.permissions";
import { ReceptionSearchFilters } from "../components/ReceptionSearchFilters";
import { ReceptionWorklistTable } from "../components/ReceptionWorklistTable";
import { PatientCheckInModal } from "../components/PatientCheckInModal";
import { VisitSlipModal } from "../components/VisitSlipModal";
import { WalkInRegistrationModal } from "../components/WalkInRegistrationModal";
import { receptionService } from "../services/reception.service";
import type {
  ReceptionQueueItem,
  ReceptionFilters,
  ArrivalCheckInPayload,
  WalkInRegistrationPayload,
  QueueStatus,
} from "../types/reception.types";
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ReceptionManagementCenterScreenProps {
  userRole?: string;
  onNavigateToPatientDetails?: (patientId: string | number) => void;
}

export const ReceptionManagementCenterScreen: React.FC<
  ReceptionManagementCenterScreenProps
> = ({ userRole = "RECEPTIONIST", onNavigateToPatientDetails }) => {
  const permissions = getReceptionPermissions(userRole);
  const { items = [], loading, refresh } = useReceptionQueue();
  const [filters, setFilters] = useState<ReceptionFilters>({
    searchQuery: "",
    queueStatus: "ALL",
    billingStatus: "ALL",
    departmentId: "ALL",
    doctorId: "ALL",
    date: new Date().toISOString().split("T")[0],
  });

  const filteredQueue = items.filter((item) => {
    if (
      filters.searchQuery &&
      !item.patientName
        ?.toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) &&
      !item.mrn?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false;
    if (
      filters.queueStatus &&
      filters.queueStatus !== "ALL" &&
      item.queueStatus !== filters.queueStatus
    )
      return false;
    if (
      filters.billingStatus &&
      filters.billingStatus !== "ALL" &&
      item.billingStatus !== filters.billingStatus
    )
      return false;
    return true;
  });

  const stats = {
    totalToday: items.length,
    waiting: items.filter((i) => i.queueStatus === "WAITING").length,
    inConsultation: items.filter((i) => i.queueStatus === "IN_CONSULTATION")
      .length,
    completed: items.filter((i) => i.queueStatus === "COMPLETED").length,
    billingPending: items.filter((i) => i.billingStatus === "PENDING").length,
  };

  const loadWorklist = refresh;
  const handleCheckIn = async (data: ArrivalCheckInPayload) => {
    const res = await receptionService.checkInPatient(
      data.appointmentId || data.queueItemId,
    );
    refresh();
    return res;
  };
  const handleRegisterWalkIn = async (data: WalkInRegistrationPayload) => {
    const res = await receptionService.registerWalkIn(data);
    refresh();
    return res;
  };
  const handleUpdateStatus = async (
    id: string | number,
    status: QueueStatus,
  ) => {
    const res = await receptionService.updateStatus(id, status);
    refresh();
    return res;
  };

  // Modals state
  const [checkInItem, setCheckInItem] = useState<ReceptionQueueItem | null>(
    null,
  );
  const [visitSlipItem, setVisitSlipItem] = useState<ReceptionQueueItem | null>(
    null,
  );
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConfirmCheckIn = async (
    itemId: string | number,
    notes?: string,
  ) => {
    await handleCheckIn({
      queueItemId: itemId,
      patientId: checkInItem?.patientId || 0,
      notes,
    });
    triggerToast(
      `Patient ${checkInItem?.patientName} checked in successfully!`,
    );
    setCheckInItem(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-[#009688]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="text-[#0D47A1]" size={24} /> Reception & Queue
            Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            FR-007 SRS Worklist • Arrival Check-In • Walk-in Token Issuance •
            Outpatient Flow Control
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => loadWorklist()}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-[#0D47A1]" : ""}
            />{" "}
            Refresh Queue
          </button>

          {permissions.canRegisterWalkIn && (
            <button
              onClick={() => setIsWalkInOpen(true)}
              className="px-4 py-2.5 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus size={15} /> Walk-In Patient Token
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">
              Total Today
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats.totalToday}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-700 font-semibold">
              Waiting Queue
            </div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {stats.waiting}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-700 font-semibold">
              In Consultation
            </div>
            <div className="text-2xl font-extrabold text-[#0D47A1] mt-1">
              {stats.inConsultation}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-700 font-semibold">
              Completed
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.completed}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <div className="text-xs text-rose-700 font-semibold">
              Billing Pending
            </div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">
              {stats.billingPending}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <ReceptionSearchFilters filters={filters} onFilterChange={setFilters} />

      {/* Reception Queue Worklist Table */}
      <ReceptionWorklistTable
        queue={filteredQueue}
        permissions={permissions}
        onCheckIn={(item) => setCheckInItem(item)}
        onPrintVisitSlip={(item) => setVisitSlipItem(item)}
        onUpdateStatus={handleUpdateStatus}
        onViewPatientDetails={(pId) =>
          onNavigateToPatientDetails ? onNavigateToPatientDetails(pId) : null
        }
      />

      {/* Check-In Modal */}
      <PatientCheckInModal
        item={checkInItem}
        onClose={() => setCheckInItem(null)}
        onConfirmCheckIn={handleConfirmCheckIn}
      />

      {/* Visit Slip Modal */}
      <VisitSlipModal
        item={visitSlipItem}
        onClose={() => setVisitSlipItem(null)}
      />

      {/* Walk-In Registration Modal */}
      <WalkInRegistrationModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        onRegister={async (payload) => {
          const item = await handleRegisterWalkIn(payload);
          triggerToast(
            `Walk-In token ${item.tokenNumber} issued for ${item.patientName}!`,
          );
        }}
      />
    </div>
  );
};

export default ReceptionManagementCenterScreen;
