import { useState, useMemo } from "react";
import type { DoctorRecord, DoctorAvailability, DoctorStatus } from "../types/doctors.types";

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  
  const totalDoctorsCount = doctors.length;
  const availableTodayCount = doctors.filter(
    (d) => d.availability === "Available Today" || d.availability === "On Duty",
  ).length;
  const onLeaveCount = doctors.filter(
    (d) => d.availability === "On Leave" || d.status === "On Leave",
  ).length;
  const departmentsCoveredCount = useMemo(() => {
    const depts = new Set(doctors.map((d) => d.department));
    return depts.size;
  }, [doctors]);

  const addDoctor = (doctor: DoctorRecord) => setDoctors(prev => [doctor, ...prev]);
  const updateDoctor = (id: string, updates: Partial<DoctorRecord>) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  const replaceDoctor = (updated: DoctorRecord) => setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
  const deactivateDoctor = (id: string) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: "Inactive" as DoctorStatus, availability: "Out of Office" as DoctorAvailability } : d));

  return {
    doctors, setDoctors,
    totalDoctorsCount, availableTodayCount, onLeaveCount, departmentsCoveredCount,
    addDoctor, updateDoctor, replaceDoctor, deactivateDoctor,
  };
}
