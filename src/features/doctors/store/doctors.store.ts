import { useState, useEffect } from "react";
import type { DoctorRecord } from "../types/doctors.types";
import { INITIAL_DOCTORS } from "../constants/doctors.constants";

let currentDoctors = [...INITIAL_DOCTORS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const doctorsStore = {
  getDoctors: (): DoctorRecord[] => currentDoctors,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setDoctors: (doctors: DoctorRecord[]) => {
    currentDoctors = doctors;
    notify();
  },

  addDoctor: (doctor: DoctorRecord) => {
    currentDoctors = [doctor, ...currentDoctors];
    notify();
  },

  updateDoctor: (id: string, updates: Partial<DoctorRecord>) => {
    currentDoctors = currentDoctors.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    notify();
  },

  deactivateDoctor: (id: string) => {
    currentDoctors = currentDoctors.map((d) =>
      d.id === id
        ? { ...d, status: "Inactive", availability: "Out of Office" }
        : d
    );
    notify();
  },

  deleteDoctor: (id: string) => {
    currentDoctors = currentDoctors.filter((d) => d.id !== id);
    notify();
  },
};

export function useDoctorsStore(): DoctorRecord[] {
  const [doctors, setDoctors] = useState<DoctorRecord[]>(currentDoctors);

  useEffect(() => {
    const unsub = doctorsStore.subscribe(() => setDoctors([...currentDoctors]));
    return () => {
      unsub();
    };
  }, []);

  return doctors;
}
