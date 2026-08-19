import { useEffect, useMemo, useState } from "react";
import { usePrescriptionStore, prescriptionStoreActions } from "../store/prescription.store";
import { prescriptionService } from "../services/prescription.service";
import { useAuthStore } from "../../auth";

export function usePrescription(mrn?: string, doctorNameFilter?: string) {
  const { prescriptions, loading, error, filters } = usePrescriptionStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);
  const roleRaw = String(user?.role ?? "").toUpperCase();
  const isPatient = roleRaw === "PATIENT";

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    if (isPatient || mrn) {
      prescriptionService.loadPrescriptions(mrn, doctorNameFilter).catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load prescriptions";
        showToast(message);
      });
    } else {
      prescriptionStoreActions.setPrescriptions([]);
      prescriptionStoreActions.setLoading(false);
    }
  }, [mrn, doctorNameFilter, isPatient]);

  useEffect(() => {
    if (error) {
      showToast(error);
      prescriptionStoreActions.setError(null);
    }
  }, [error]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((rx) => {
      const query = filters.searchTerm.toLowerCase();
      const matchesSearch =
        rx.id.toLowerCase().includes(query) ||
        rx.doctorName.toLowerCase().includes(query) ||
        rx.patientName.toLowerCase().includes(query) ||
        rx.department.toLowerCase().includes(query) ||
        rx.diagnosis.toLowerCase().includes(query) ||
        rx.medicines.some((m) => m.name.toLowerCase().includes(query));

      const matchesStatus =
        filters.status === "All" || rx.status.toLowerCase() === filters.status.toLowerCase();

      const matchesDept =
        filters.dept === "All" || rx.department.toLowerCase() === filters.dept.toLowerCase();

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [prescriptions, filters]);

  const triggerRefresh = () => {
    if (isPatient || mrn) {
      prescriptionService.loadPrescriptions(mrn, doctorNameFilter).catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to refresh prescriptions";
        showToast(message);
      });
    }
  };

  return {
    prescriptions: filteredPrescriptions,
    allPrescriptions: prescriptions,
    loading,
    error,
    toastMsg,
    showToast,
    triggerRefresh,
  };
}

export function usePrescriptionDetails() {
  const { selectedPrescription, loading } = usePrescriptionStore();

  const loadDetails = async (id: string | number) => {
    try {
      return await prescriptionService.getPrescriptionDetails(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load prescription details";
      prescriptionStoreActions.setError(message);
      return null;
    }
  };

  const closeDetails = () => {
    prescriptionStoreActions.setSelectedPrescription(null);
  };

  return {
    selectedPrescription,
    loading,
    loadDetails,
    closeDetails,
  };
}

export function usePrescriptionFilters() {
  const { filters } = usePrescriptionStore();

  const setFilterValue = (key: string, val: string) => {
    prescriptionStoreActions.setFilters({ [key]: val });
  };

  const resetFilters = () => {
    prescriptionStoreActions.resetFilters();
  };

  return {
    filters,
    setFilterValue,
    resetFilters,
  };
}

export function usePrescriptionActions(showToast: (msg: string) => void) {
  const handlePrint = async (rxId: string | number) => {
    try {
      const printData = await prescriptionService.getPrintOutput(rxId);
      if (printData) {
        showToast(`Prescription ${rxId} sent to printer`);
      } else {
        showToast(`Failed to load print layout for ${rxId}`);
      }
    } catch {
      showToast(`Failed to print prescription ${rxId}`);
    }
  };

  const handleDownload = (rxId: string | number) => {
    showToast(`Downloaded PDF for ${rxId}`);
  };

  const handleFinalize = async (rxId: string | number) => {
    try {
      const success = await prescriptionService.finalizePrescription(rxId);
      if (success) {
        showToast(`Prescription ${rxId} finalized successfully.`);
      } else {
        showToast(`Failed to finalize prescription ${rxId}.`);
      }
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to finalize prescription ${rxId}`;
      showToast(message);
      return false;
    }
  };

  const handleDuplicate = async (rxId: string | number) => {
    try {
      await prescriptionService.createAmendment(rxId, { reason: "Patient requested duplicate" });
      showToast(`Duplicated prescription ${rxId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to duplicate prescription ${rxId}`;
      showToast(message);
    }
  };

  const handleReprint = async (rxId: string | number) => {
    try {
      await prescriptionService.reprintPrescription(rxId, { reason: "Reprint request" });
      showToast(`Reprinted prescription ${rxId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to reprint prescription ${rxId}`;
      showToast(message);
    }
  };

  return {
    handlePrint,
    handleDownload,
    handleFinalize,
    handleDuplicate,
    handleReprint,
  };
}
