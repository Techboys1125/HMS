import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../../auth";
import { usePatientPortal } from "../../patients/context/PatientPortalContext";
import { usePermissions } from "../../../permissions";
import { usePrescription, usePrescriptionDetails, usePrescriptionFilters, usePrescriptionActions } from "../hooks/usePrescription";
import type { UnifiedPrescription } from "../types/prescription.types";

// Extracted Subcomponents
import { PrescriptionHeader } from "../components/PrescriptionHeader";
import { PrescriptionSummaryCard } from "../components/PrescriptionSummaryCard";
import { PrescriptionFilters } from "../components/PrescriptionFilters";
import { PrescriptionTable } from "../components/PrescriptionTable";
import { PrescriptionLoader } from "../components/PrescriptionLoader";
import { PrescriptionEmptyState } from "../components/PrescriptionEmptyState";
import { PrescriptionDrawer, PrescriptionDetailsModal, PrescriptionPrintModal } from "../components/PrescriptionPreview";

const RB = "'Roboto', system-ui, sans-serif";

export const PrescriptionManagementPage: React.FC<{
  onNewPrescription?: () => void;
  onViewConsultation?: (consultId: string) => void;
}> = ({
  onNewPrescription,
  onViewConsultation,
}) => {
  const user = useAuthStore((s) => s.user);
  const roleRaw = String(user?.role ?? "").toUpperCase();
  
  const role: "patient" | "doctor" | "admin" =
    roleRaw === "PATIENT"
      ? "patient"
      : roleRaw === "DOCTOR"
        ? "doctor"
        : "admin";

  const portal = usePatientPortal();
  const activePatient = portal?.activePatient || undefined;
  const patientName = activePatient?.patientName || user?.fullName || "Patient";
  const activeMrn = role === "patient" ? (activePatient?.mrn || user?.patientId || "") : undefined;

  // Filter doctor prescriptions by name if in doctor role
  const doctorNameFilter = role === "doctor" ? user?.fullName : undefined;

  const {
    prescriptions,
    loading,
    toastMsg,
    showToast,
    triggerRefresh,
  } = usePrescription(activeMrn, doctorNameFilter);

  const {
    selectedPrescription,
    loadDetails,
    closeDetails,
  } = usePrescriptionDetails();

  const {
    filters,
    setFilterValue,
    resetFilters,
  } = usePrescriptionFilters();

  const {
    handlePrint,
    handleDownload,
    handleDuplicate,
  } = usePrescriptionActions(showToast);

  // Modal view states
  const [activeDrawerRx, setActiveDrawerRx] = useState<UnifiedPrescription | null>(null);
  const [fullViewRx, setFullViewRx] = useState<UnifiedPrescription | null>(null);
  const [printPreviewRx, setPrintPreviewRx] = useState<UnifiedPrescription | null>(null);

  const handleResetAll = () => {
    resetFilters();
  };

  const handleApply = () => {
    triggerRefresh();
  };

  return (
    <div
      className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header component */}
      <PrescriptionHeader
        role={role}
        patientName={patientName}
        onNewPrescription={onNewPrescription}
      />

      <div className={`${role === "patient" ? "p-6 space-y-6" : "px-6 space-y-6"}`}>
        {/* KPI Cards */}
        <PrescriptionSummaryCard role={role} prescriptions={prescriptions} />

        {/* Filter Toolbar */}
        <PrescriptionFilters
          role={role}
          searchTerm={filters.searchTerm}
          setSearchTerm={(val) => setFilterValue("searchTerm", val)}
          selectedStatus={filters.status}
          setSelectedStatus={(val) => setFilterValue("status", val)}
          selectedDept={filters.dept}
          setSelectedDept={(val) => setFilterValue("dept", val)}
          dateRange={filters.dateRange}
          setDateRange={(val) => setFilterValue("dateRange", val)}
          onReset={handleResetAll}
          onApply={handleApply}
        />

        {/* Data list / table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <PrescriptionLoader />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <PrescriptionEmptyState onReset={handleResetAll} />
          </div>
        ) : (
          <PrescriptionTable
            role={role}
            prescriptions={prescriptions}
            onView={(rx) => {
              setActiveDrawerRx(rx);
              loadDetails(rx.id);
            }}
            onEdit={onNewPrescription}
            onPrint={(rx) => setPrintPreviewRx(rx)}
            onDownload={handleDownload}
            onDuplicate={handleDuplicate}
            onViewConsultation={onViewConsultation}
          />
        )}
      </div>

      {/* Slide-over Drawer Preview */}
      {activeDrawerRx && (
        <PrescriptionDrawer
          role={role}
          prescription={selectedPrescription || activeDrawerRx}
          onClose={() => {
            setActiveDrawerRx(null);
            closeDetails();
          }}
          onViewFull={() => {
            setFullViewRx(selectedPrescription || activeDrawerRx);
            setActiveDrawerRx(null);
          }}
          onDownload={() => handleDownload(activeDrawerRx.id)}
          onPrint={() => {
            setPrintPreviewRx(selectedPrescription || activeDrawerRx);
            setActiveDrawerRx(null);
          }}
        />
      )}

      {/* Detailed Modal view */}
      {fullViewRx && (
        <PrescriptionDetailsModal
          prescription={fullViewRx}
          onClose={() => setFullViewRx(null)}
          onDownload={() => handleDownload(fullViewRx.id)}
        />
      )}

      {/* Print Preview Modal */}
      {printPreviewRx && (
        <PrescriptionPrintModal
          prescription={printPreviewRx}
          onClose={() => setPrintPreviewRx(null)}
          onPrint={() => {
            handlePrint(printPreviewRx.id);
            setPrintPreviewRx(null);
          }}
        />
      )}
    </div>
  );
};

export default PrescriptionManagementPage;
