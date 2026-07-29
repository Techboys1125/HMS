import React, { useState } from "react";
import { ChevronRight, UserPlus, RefreshCw, CheckCircle2 } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
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
import { AddDoctorDrawer } from "../components/AddDoctorDrawer";
import { EditDoctorDrawer } from "../components/EditDoctorDrawer";
import { DoctorProfileScreen } from "../components/DoctorProfileScreen";

export function DoctorManagementCenterScreen() {
  const { doctors, totalDoctorsCount, availableTodayCount, onLeaveCount, departmentsCoveredCount, addDoctor, replaceDoctor, deactivateDoctor } = useDoctors();
  const { toastMsg, showToast } = useToast();
  const { searchDoctorQuery, setSearchDoctorQuery, searchEmpIdQuery, setSearchEmpIdQuery, searchRegNoQuery, setSearchRegNoQuery, deptFilter, setDeptFilter, specialtyFilter, setSpecialtyFilter, availabilityFilter, setAvailabilityFilter, statusFilter, setStatusFilter, experienceFilter, setExperienceFilter, sortColumn, sortDirection, filteredDoctors, handleSort, resetFilters } = useDoctorFilters(doctors);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);
  const [quickDetailsDoctor, setQuickDetailsDoctor] = useState<DoctorRecord | null>(null);
  const [scheduleDoctor, setScheduleDoctor] = useState<DoctorRecord | null>(null);
  const [fullProfileDoctor, setFullProfileDoctor] = useState<DoctorRecord | null>(null);
  const [deactivateDialogDoctor, setDeactivateDialogDoctor] = useState<DoctorRecord | null>(null);

  const handleAddDoctorSubmit = (newDoctor: DoctorRecord) => {
    addDoctor(newDoctor);
    showToast(`Doctor ${newDoctor.name} created successfully.`);
    setShowAddDrawer(false);
  };

  const handleSaveEditDoctor = (updatedDoc: DoctorRecord) => {
    replaceDoctor(updatedDoc);
    showToast("Doctor information updated successfully.");
    setEditingDoctor(null);
  };

  const handleConfirmDeactivate = () => {
    if (!deactivateDialogDoctor) return;
    deactivateDoctor(deactivateDialogDoctor.id);
    showToast(`Doctor ${deactivateDialogDoctor.name} has been deactivated.`);
    setDeactivateDialogDoctor(null);
    setEditingDoctor(null);
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
        onEdit={(updatedDoc) => { replaceDoctor(updatedDoc); }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Doctor Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Hospital Admin</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Doctor Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => { setIsLoading(prev => !prev); showToast(isLoading ? "Loading completed." : "Simulating loading skeletons..."); }}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin text-[#0D47A1]" : ""} />
            <span>{isLoading ? "Loading Active" : "Simulate Loading"}</span>
          </button>
          <button
            onClick={() => setShowAddDrawer(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm shrink-0"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={15} /> Add Doctor
          </button>
        </div>
      </div>

      <KpiCards totalDoctorsCount={totalDoctorsCount} availableTodayCount={availableTodayCount} onLeaveCount={onLeaveCount} departmentsCoveredCount={departmentsCoveredCount} isLoading={isLoading} />

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
        onAddDoctor={() => setShowAddDrawer(true)}
        onResetFilters={handleResetAllFilters}
      />

      <QuickDetailsDrawer isOpen={Boolean(quickDetailsDoctor)} doctor={quickDetailsDoctor} onClose={() => setQuickDetailsDoctor(null)} onViewFullProfile={(doc) => { setQuickDetailsDoctor(null); setFullProfileDoctor(doc); }} />

      <AddDoctorDrawer isOpen={showAddDrawer} onClose={() => setShowAddDrawer(false)} onSubmit={handleAddDoctorSubmit} totalDoctorCount={doctors.length} />

      <EditDoctorDrawer isOpen={Boolean(editingDoctor)} doctor={editingDoctor} onClose={() => setEditingDoctor(null)} onSave={handleSaveEditDoctor} onDeactivateClick={(doc) => setDeactivateDialogDoctor(doc)} onTriggerToast={showToast} />

      <ScheduleModal isOpen={Boolean(scheduleDoctor)} doctor={scheduleDoctor} onClose={() => setScheduleDoctor(null)} />

      <DeactivateDoctorDialog isOpen={Boolean(deactivateDialogDoctor)} doctor={deactivateDialogDoctor} onClose={() => setDeactivateDialogDoctor(null)} onConfirm={handleConfirmDeactivate} />
    </div>
  );
}
