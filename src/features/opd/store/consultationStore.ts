import { useSyncExternalStore } from "react";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import type {
  Encounter,
  Prescription,
  Diagnosis,
} from "../../encounters/types/encounter.types";
import type { ConsultationRecord } from "../types/consultation";
import type { PatientVitals } from "../types/vitals";

export interface ConsultationState {
  selectedAppointment: AppointmentRecord | null;
  selectedEncounter: Encounter | null;
  selectedConsultation: ConsultationRecord | null;
  selectedPrescription: Prescription | null;
  selectedVitals: PatientVitals | null;
  selectedDiagnoses: Diagnosis[];
  consultationStatus:
    | "BOOKED"
    | "WAITING_FOR_VITALS"
    | "WAITING_FOR_DOCTOR_CALL"
    | "CALLED"
    | "IN_CONSULTATION"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW"
    | "FOLLOW_UP_SCHEDULED"
    | string;
  loading: boolean;
  error: string | null;
}

const initialStoreState: ConsultationState = {
  selectedAppointment: null,
  selectedEncounter: null,
  selectedConsultation: null,
  selectedPrescription: null,
  selectedVitals: null,
  selectedDiagnoses: [],
  consultationStatus: "BOOKED",
  loading: false,
  error: null,
};

let currentState: ConsultationState = { ...initialStoreState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const consultationStoreActions = {
  getState: (): ConsultationState => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setAppointment: (appointment: AppointmentRecord | null) => {
    currentState = {
      ...currentState,
      selectedAppointment: appointment,
      error: null,
    };
    notify();
  },

  setEncounter: (encounter: Encounter | null) => {
    currentState = {
      ...currentState,
      selectedEncounter: encounter,
      error: null,
    };
    notify();
  },

  setConsultation: (consultation: ConsultationRecord | null) => {
    currentState = {
      ...currentState,
      selectedConsultation: consultation,
      error: null,
    };
    notify();
  },

  setPrescription: (prescription: Prescription | null) => {
    currentState = {
      ...currentState,
      selectedPrescription: prescription,
      error: null,
    };
    notify();
  },

  setVitals: (vitals: PatientVitals | null) => {
    currentState = {
      ...currentState,
      selectedVitals: vitals,
      error: null,
    };
    notify();
  },

  setDiagnoses: (diagnoses: Diagnosis[]) => {
    currentState = {
      ...currentState,
      selectedDiagnoses: diagnoses,
      error: null,
    };
    notify();
  },

  setStatus: (status: string) => {
    currentState = {
      ...currentState,
      consultationStatus: status,
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

  reset: () => {
    currentState = { ...initialStoreState };
    notify();
  },
};

export function useConsultationStore<T = ConsultationState>(
  selector?: (state: ConsultationState) => T,
): T {
  const snapshot = useSyncExternalStore(
    consultationStoreActions.subscribe,
    consultationStoreActions.getState,
    consultationStoreActions.getState,
  );

  if (selector) {
    return selector(snapshot);
  }
  return snapshot as unknown as T;
}

useConsultationStore.getState = consultationStoreActions.getState;
useConsultationStore.subscribe = consultationStoreActions.subscribe;
useConsultationStore.setAppointment = consultationStoreActions.setAppointment;
useConsultationStore.setEncounter = consultationStoreActions.setEncounter;
useConsultationStore.setConsultation = consultationStoreActions.setConsultation;
useConsultationStore.setPrescription = consultationStoreActions.setPrescription;
useConsultationStore.setVitals = consultationStoreActions.setVitals;
useConsultationStore.setDiagnoses = consultationStoreActions.setDiagnoses;
useConsultationStore.setStatus = consultationStoreActions.setStatus;
useConsultationStore.setLoading = consultationStoreActions.setLoading;
useConsultationStore.setError = consultationStoreActions.setError;
useConsultationStore.reset = consultationStoreActions.reset;
