import { useState, useEffect, useCallback } from "react";
import { appointmentService } from "../services/appointment.service";
import type { AppointmentRecord, UserRole } from "../types/appointment.types";

export function useAppointments(
  userRole: UserRole = "Receptionist",
  date?: string,
  params?: {
    doctorId?: string | number;
    patientId?: string | number;
    mrn?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
    sort?: string;
  },
) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let items: AppointmentRecord[] = [];
        const roleUpper = String(userRole || "").toUpperCase();

        if (roleUpper === "DOCTOR") {
          items = await appointmentService.listDoctorAppointments(
            params?.doctorId,
            date,
            params?.status,
          );
        } else if (
          roleUpper === "PATIENT" &&
          (params?.patientId || params?.mrn)
        ) {
          items = await appointmentService.listPatientAppointments(
            params.patientId || params.mrn || "",
          );
        } else {
          items = await appointmentService.listAppointments({
            doctorId: params?.doctorId,
            patientId: params?.patientId,
            mrn: params?.mrn,
            date: date,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            status: params?.status,
            page: params?.page,
            size: params?.size,
            sort: params?.sort,
          });
        }
        if (active) {
          setAppointments(items);
        }
      } catch (err: unknown) {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load appointments from server.";
          setError(msg);
          setAppointments([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [userRole, date, params]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let items: AppointmentRecord[] = [];
      const roleUpper = String(userRole || "").toUpperCase();
      if (roleUpper === "DOCTOR") {
        items = await appointmentService.listDoctorAppointments(
          params?.doctorId,
          date,
          params?.status,
        );
      } else if (
        roleUpper === "PATIENT" &&
        (params?.patientId || params?.mrn)
      ) {
        items = await appointmentService.listPatientAppointments(
          params.patientId || params.mrn || "",
        );
      } else {
        items = await appointmentService.listAppointments({
          doctorId: params?.doctorId,
          patientId: params?.patientId,
          mrn: params?.mrn,
          date: date,
          fromDate: params?.fromDate,
          toDate: params?.toDate,
          status: params?.status,
          page: params?.page,
          size: params?.size,
          sort: params?.sort,
        });
      }
      setAppointments(items);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load appointments from server.";
      setError(msg);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [userRole, date, params]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    refetch,
  };
}
