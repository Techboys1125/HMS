import { useState, useEffect } from "react";
import { ChevronRight, UserPlus, RefreshCw, CheckCircle2 } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PermissionGuard } from "../../../permissions";
import { PP, RB } from "../constants/doctors.constants";
import { useDoctors } from "../hooks/useDoctors";
import { useDoctorFilters } from "../hooks/useDoctorFilters";
import { useToast } from "../hooks/useToast";
import { KpiCards } from "../components/KpiCards";
import { DoctorFilterBar } from "../components/DoctorFilterBar";
import { DoctorTable } from "../components/DoctorTable";
import { QuickDetailsDrawer } from "../components/QuickDetailsDrawer";
import { ScheduleModal } from "../components/ScheduleModal";
import { DeactivateDoctorDialog } from "../components/DeactivateDoctorDialog";
import { ActivateDoctorDialog } from "../components/ActivateDoctorDialog";
import { ResetPasswordDialog } from "../components/ResetPasswordDialog";
import { AddDoctorDrawer } from "../components/AddDoctorDrawer";
import { DoctorProfileScreen } from "../components/DoctorProfileScreen";
import { EditStaffUserDrawer } from "../../users/components/EditStaffUserDrawer";
import { doctorToEditUser } from "../utils/doctorToEditUser";

import { usersApi } from "../../users/api/users.api";
import { departmentsApi } from "../../users/api/departments.api";

export function DoctorManagementCenterScreen() {
  const {
    doctors,
    totalDoctorsCount,
    availableTodayCount,
    onLeaveCount,
    departmentsCoveredCount,
    addDoctor,
    replaceDoctor,
    fetchDoctors,
    deactivateDoctor,
    reactivateDoctor,
    loading: isLoading,
  } = useDoctors();
  const { toastMsg, showToast } = useToast();
  const {
    searchDoctorQuery,
    setSearchDoctorQuery,
    searchEmpIdQuery,
    setSearchEmpIdQuery,
    searchRegNoQuery,
    setSearchRegNoQuery,
    deptFilter,
    setDeptFilter,
    specialtyFilter,
    setSpecialtyFilter,
    availabilityFilter,
    setAvailabilityFilter,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    sortColumn,
    sortDirection,
    filteredDoctors,
    handleSort,
    resetFilters,
  } = useDoctorFilters(doctors);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);
  const [quickDetailsDoctor, setQuickDetailsDoctor] =
    useState<DoctorRecord | null>(null);
  const [scheduleDoctor, setScheduleDoctor] = useState<DoctorRecord | null>(
    null,
  );
  const [fullProfileDoctor, setFullProfileDoctor] =
    useState<DoctorRecord | null>(null);
  const [deactivateDialogDoctor, setDeactivateDialogDoctor] =
    useState<DoctorRecord | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [activateDialogDoctor, setActivateDialogDoctor] =
    useState<DoctorRecord | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [resetPassDoctor, setResetPassDoctor] = useState<DoctorRecord | null>(
    null,
  );
  const [isResetting, setIsResetting] = useState(false);

  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchDoctors();
    departmentsApi
      .getDepartmentLookup(true)
      .then((list) => {
        setDepartments(list.map((d) => d.departmentName));
      })
      .catch(() => {});
  }, []);

  const handleAddDoctorSubmit = (newDoctor: DoctorRecord) => {
    addDoctor(newDoctor);
    setShowAddDrawer(false);
    fetchDoctors().catch(() => {});
    showToast(`Doctor ${newDoctor.name} created successfully.`);
  };

  const handleSaveEditDoctor = () => {
    setEditingDoctor(null);
    fetchDoctors().catch(() => {});
    showToast("Doctor information updated successfully.");
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateDialogDoctor) return;
    setIsDeactivating(true);
    try {
      await deactivateDoctor(deactivateDialogDoctor.id);
      setDeactivateDialogDoctor(null);
      setEditingDoctor(null);
      showToast(`Doctor ${deactivateDialogDoctor.name} has been deactivated.`);
    } catch (err) {
      console.warn("Failed to deactivate doctor:", err);
      showToast("Failed to deactivate doctor. Please try again.");
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleConfirmActivate = async () => {
    if (!activateDialogDoctor) return;
    setIsActivating(true);
    try {
      await reactivateDoctor(activateDialogDoctor.id);
      setActivateDialogDoctor(null);
      showToast(`Doctor ${activateDialogDoctor.name} has been activated.`);
    } catch (err) {
      console.warn("Failed to activate doctor:", err);
      showToast("Failed to activate doctor. Please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!resetPassDoctor) return;
    setIsResetting(true);
    try {
      const userId =
        resetPassDoctor.userId ||
        String(resetPassDoctor.id || "").replace("DOC-", "");
      await usersApi.adminResetPassword(userId);
      setResetPassDoctor(null);
      showToast(
        `Password reset triggered for ${resetPassDoctor.name}. Temporary instructions sent to ${resetPassDoctor.email}.`,
      );
    } catch (err) {
      console.warn("Failed to reset doctor password:", err);
      showToast("Failed to reset password. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetAllFilters = () => {
    resetFilters();
    showToast("All search criteria and filters reset.");
  };

  if (fullProfileDoctor) {
    return (
      <DoctorProfileScreen
        doctor={fullProfileDoctor}
        onBack={() => setFullProfileDoctor(null)}
        onEdit={(updatedDoc) => {
          replaceDoctor(updatedDoc);
        }}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Doctor Management
          </h1>
          <div
            className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
            style={{ fontFamily: RB }}
          >
            <span>Doctors</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">
              Doctor Management
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              fetchDoctors();
              showToast("Refreshing doctor records from backend...");
            }}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw
              size={13}
              className={isLoading ? "animate-spin text-[#0D47A1]" : ""}
            />
            <span>{isLoading ? "Refreshing..." : "Refresh List"}</span>
          </button>
          <PermissionGuard requiredPermission="DOCTOR_CREATE">
            <button
              onClick={() => setShowAddDrawer(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm shrink-0"
              style={{ fontFamily: PP }}
            >
              <UserPlus size={15} /> Add Doctor
            </button>
          </PermissionGuard>
        </div>
      </div>

      <KpiCards
        totalDoctorsCount={totalDoctorsCount}
        availableTodayCount={availableTodayCount}
        onLeaveCount={onLeaveCount}
        departmentsCoveredCount={departmentsCoveredCount}
        isLoading={isLoading}
      />

      <DoctorFilterBar
        searchDoctorQuery={searchDoctorQuery}
        setSearchDoctorQuery={setSearchDoctorQuery}
        searchEmpIdQuery={searchEmpIdQuery}
        setSearchEmpIdQuery={setSearchEmpIdQuery}
        searchRegNoQuery={searchRegNoQuery}
        setSearchRegNoQuery={setSearchRegNoQuery}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        specialtyFilter={specialtyFilter}
        setSpecialtyFilter={setSpecialtyFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        onResetFilters={handleResetAllFilters}
        departments={departments}
      />

      <DoctorTable
        doctors={doctors}
        filteredDoctors={filteredDoctors}
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onViewProfile={(doc) => setFullProfileDoctor(doc)}
        onQuickView={(doc) => setQuickDetailsDoctor(doc)}
        onEdit={(doc) => setEditingDoctor(doc)}
        onViewSchedule={(doc) => setScheduleDoctor(doc)}
        onDeactivate={(doc) => setDeactivateDialogDoctor(doc)}
        onActivate={(doc) => setActivateDialogDoctor(doc)}
        onResetPassword={(doc) => setResetPassDoctor(doc)}
        onAddDoctor={() => setShowAddDrawer(true)}
        onResetFilters={handleResetAllFilters}
      />

      <QuickDetailsDrawer
        isOpen={Boolean(quickDetailsDoctor)}
        doctor={quickDetailsDoctor}
        onClose={() => setQuickDetailsDoctor(null)}
        onViewFullProfile={(doc) => {
          setQuickDetailsDoctor(null);
          setFullProfileDoctor(doc);
        }}
      />

      <AddDoctorDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSubmit={handleAddDoctorSubmit}
        totalDoctorCount={doctors.length}
      />

      <EditStaffUserDrawer
        user={editingDoctor ? doctorToEditUser(editingDoctor) : null}
        onClose={() => setEditingDoctor(null)}
        onSaved={handleSaveEditDoctor}
      />

      <ScheduleModal
        isOpen={Boolean(scheduleDoctor)}
        doctor={scheduleDoctor}
        onClose={() => setScheduleDoctor(null)}
      />

      <DeactivateDoctorDialog
        isOpen={Boolean(deactivateDialogDoctor)}
        doctor={deactivateDialogDoctor}
        onClose={() => setDeactivateDialogDoctor(null)}
        onConfirm={handleConfirmDeactivate}
        isDeactivating={isDeactivating}
      />

      <ActivateDoctorDialog
        isOpen={Boolean(activateDialogDoctor)}
        doctor={activateDialogDoctor}
        onClose={() => setActivateDialogDoctor(null)}
        onConfirm={handleConfirmActivate}
        isActivating={isActivating}
      />

      <ResetPasswordDialog
        isOpen={Boolean(resetPassDoctor)}
        doctor={resetPassDoctor}
        onClose={() => setResetPassDoctor(null)}
        onConfirm={handleConfirmResetPassword}
        isResetting={isResetting}
      />
    </div>
  );
}
