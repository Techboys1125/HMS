import { useState, useEffect } from "react";
import type { Patient } from "../types/patient.types";

let currentPatients: Patient[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const patientStore = {
  getPatients: (): Patient[] => currentPatients,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setPatients: (patients: Patient[]) => {
    currentPatients = patients;
    notify();
  },

  addPatient: (patient: Patient) => {
    currentPatients = [patient, ...currentPatients];
    notify();
  },

  updatePatient: (mrn: string, updates: Partial<Patient>) => {
    currentPatients = currentPatients.map((p) =>
      p.mrn === mrn ? { ...p, ...updates } : p,
    );
    notify();
  },

  removePatient: (mrn: string) => {
    currentPatients = currentPatients.filter((p) => p.mrn !== mrn);
    notify();
  },
};

export function usePatientStore(): Patient[] {
  const [patients, setPatients] = useState<Patient[]>(currentPatients);

  useEffect(() => {
    const unsub = patientStore.subscribe(() => setPatients([...currentPatients]));
    return () => {
      unsub();
    };
  }, []);

  return patients;
}
