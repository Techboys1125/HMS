import { useState, useEffect } from "react";
import type { AppointmentRecord } from "../types/appointment.types";

let currentAppointments: AppointmentRecord[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const appointmentStore = {
  getAppointments: (): AppointmentRecord[] => currentAppointments,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setAppointments: (appointments: AppointmentRecord[]) => {
    currentAppointments = appointments;
    notify();
  },

  addAppointment: (appointment: AppointmentRecord) => {
    currentAppointments = [appointment, ...currentAppointments];
    notify();
  },

  updateAppointment: (
    id: string | number,
    updates: Partial<AppointmentRecord>,
  ) => {
    currentAppointments = currentAppointments.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    notify();
  },

  removeAppointment: (id: string | number) => {
    currentAppointments = currentAppointments.filter((a) => a.id !== id);
    notify();
  },
};

export function useAppointmentStore(): AppointmentRecord[] {
  const [appointments, setAppointments] =
    useState<AppointmentRecord[]>(currentAppointments);

  useEffect(() => {
    const unsub = appointmentStore.subscribe(() =>
      setAppointments([...currentAppointments]),
    );
    return () => {
      unsub();
    };
  }, []);

  return appointments;
}
