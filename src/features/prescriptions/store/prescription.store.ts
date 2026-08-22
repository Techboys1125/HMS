import { useSyncExternalStore } from "react";
import type { UnifiedPrescription } from "../types/prescription.types";

export interface PrescriptionFiltersState {
  searchTerm: string;
  status: string;
  dept: string;
  dateRange: string;
}

export interface PrescriptionState {
  prescriptions: UnifiedPrescription[];
  selectedPrescription: UnifiedPrescription | null;
  loading: boolean;
  error: string | null;
  filters: PrescriptionFiltersState;
}

const initialFiltersState: PrescriptionFiltersState = {
  searchTerm: "",
  status: "All",
  dept: "All",
  dateRange: "All",
};

const initialStoreState: PrescriptionState = {
  prescriptions: [],
  selectedPrescription: null,
  loading: false,
  error: null,
  filters: { ...initialFiltersState },
};

let currentState: PrescriptionState = { ...initialStoreState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const prescriptionStoreActions = {
  getState: (): PrescriptionState => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setPrescriptions: (prescriptions: UnifiedPrescription[]) => {
    currentState = {
      ...currentState,
      prescriptions,
      error: null,
    };
    notify();
  },

  setSelectedPrescription: (prescription: UnifiedPrescription | null) => {
    currentState = {
      ...currentState,
      selectedPrescription: prescription,
      error: null,
    };
    notify();
  },

  setLoading: (loading: boolean) => {
    currentState = {
      ...currentState,
      loading,
    };
    notify();
  },

  setError: (error: string | null) => {
    currentState = {
      ...currentState,
      error,
      loading: false,
    };
    notify();
  },

  setFilters: (filters: Partial<PrescriptionFiltersState>) => {
    currentState = {
      ...currentState,
      filters: {
        ...currentState.filters,
        ...filters,
      },
    };
    notify();
  },

  resetFilters: () => {
    currentState = {
      ...currentState,
      filters: { ...initialFiltersState },
    };
    notify();
  },

  reset: () => {
    currentState = { ...initialStoreState };
    notify();
  },
};

export function usePrescriptionStore<T = PrescriptionState>(
  selector?: (state: PrescriptionState) => T,
): T {
  const snapshot = useSyncExternalStore(
    prescriptionStoreActions.subscribe,
    prescriptionStoreActions.getState,
    prescriptionStoreActions.getState,
  );

  if (selector) {
    return selector(snapshot);
  }
  return snapshot as unknown as T;
}

usePrescriptionStore.getState = prescriptionStoreActions.getState;
usePrescriptionStore.subscribe = prescriptionStoreActions.subscribe;
usePrescriptionStore.setPrescriptions =
  prescriptionStoreActions.setPrescriptions;
usePrescriptionStore.setSelectedPrescription =
  prescriptionStoreActions.setSelectedPrescription;
usePrescriptionStore.setLoading = prescriptionStoreActions.setLoading;
usePrescriptionStore.setError = prescriptionStoreActions.setError;
usePrescriptionStore.setFilters = prescriptionStoreActions.setFilters;
usePrescriptionStore.resetFilters = prescriptionStoreActions.resetFilters;
usePrescriptionStore.reset = prescriptionStoreActions.reset;
