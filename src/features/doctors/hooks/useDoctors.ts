import { useState, useCallback, useMemo } from "react";
import type {
  DoctorRecord,
  DoctorAvailability,
  DoctorStatus,
} from "../types/doctors.types";
import { doctorApi } from "../api/doctorApi";
import { mapDoctorSummaryToDoctorRecord } from "../api/doctors.api";
import { usersApi } from "../../users/api/users.api";
import type {
  AdminCreateStaffData,
  AdminUpdateStaffData,
} from "../../users/types/users.types";

export interface AuditEntry {
  action: string;
  timestamp: string;
  performedBy: string;
  details: string;
}

const normalizeNumericId = (id: string): string => {
  const cleaned = String(id ?? "")
    .replace(/^DOC-/, "")
    .trim();
  return cleaned || id;
};

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.adminGetUsers();
      const rawList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      const doctorUsers = rawList.filter(
        (u) => String(u.role ?? "").toUpperCase() === "DOCTOR",
      );
      const records = doctorUsers.map(mapDoctorSummaryToDoctorRecord);

      // Apply overrides from localStorage
      const overrides = JSON.parse(
        localStorage.getItem("doctor_status_overrides") || "{}",
      );
      const updatedRecords = records.map((r) => {
        if (overrides[r.id]) {
          return {
            ...r,
            status: overrides[r.id].status,
            availability: overrides[r.id].availability,
          };
        }
        return r;
      });

      setDoctors(updatedRecords);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch doctors";
      setError(msg);
      console.error("[useDoctors] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const addDoctor = useCallback(async (doctor: DoctorRecord) => {
    setLoading(true);
    try {
      const { mapDoctorRecordToCreatePayload } =
        await import("../api/mapApiUserToDoctorRecord");
      const payload = mapDoctorRecordToCreatePayload(
        doctor,
      ) as unknown as AdminCreateStaffData;
      const created = await usersApi.adminCreateStaff(payload);
      const record = mapDoctorSummaryToDoctorRecord(created.data);
      setDoctors((prev) => [record, ...prev]);
      return record;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add doctor";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDoctor = useCallback(
    async (id: string, updates: Partial<DoctorRecord>) => {
      setLoading(true);
      try {
        const existing = doctors.find((d) => d.id === id);
        if (!existing) throw new Error(`Doctor ${id} not found`);
        const userId = existing.userId || Number(normalizeNumericId(id));

        const { mapDoctorToUpdatePayload } =
          await import("../api/mapApiUserToDoctorRecord");
        const payload = mapDoctorToUpdatePayload({
          ...existing,
          ...updates,
        }) as unknown as AdminUpdateStaffData;
        await usersApi.adminUpdateStaff(userId, payload);

        setDoctors((prev) =>
          prev.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        );
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to update doctor";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [doctors],
  );

  const replaceDoctor = useCallback((updated: DoctorRecord) => {
    setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }, []);

  const deactivateDoctor = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const numericId = normalizeNumericId(id);
      await usersApi.adminDeactivateUser(
        numericId,
        "Deactivated from Doctor Management",
      );

      const overrides = JSON.parse(
        localStorage.getItem("doctor_status_overrides") || "{}",
      );
      overrides[id] = { status: "Inactive", availability: "Out of Office" };
      localStorage.setItem(
        "doctor_status_overrides",
        JSON.stringify(overrides),
      );

      setDoctors((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: "Inactive" as DoctorStatus,
                availability: "Out of Office" as DoctorAvailability,
              }
            : d,
        ),
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to deactivate doctor";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reactivateDoctor = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const numericId = normalizeNumericId(id);
      await usersApi.adminActivateUser(numericId);

      const overrides = JSON.parse(
        localStorage.getItem("doctor_status_overrides") || "{}",
      );
      overrides[id] = { status: "Active", availability: "Available Today" };
      localStorage.setItem(
        "doctor_status_overrides",
        JSON.stringify(overrides),
      );

      setDoctors((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: "Active" as DoctorStatus,
                availability: "Available Today" as DoctorAvailability,
              }
            : d,
        ),
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to activate doctor";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDoctorAudit = useCallback(async (doctorId: string) => {
    const numericId = normalizeNumericId(doctorId);
    const entries = await doctorApi.getDoctorAudit(numericId);
    return entries;
  }, []);

  return {
    doctors,
    setDoctors,
    loading,
    error,
    fetchDoctors,
    totalDoctorsCount,
    availableTodayCount,
    onLeaveCount,
    departmentsCoveredCount,
    addDoctor,
    updateDoctor,
    replaceDoctor,
    deactivateDoctor,
    reactivateDoctor,
    getDoctorAudit,
  };
}
