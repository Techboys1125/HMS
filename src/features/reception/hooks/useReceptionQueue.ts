import { useState, useEffect, useCallback, useMemo } from "react";
import { receptionApi } from "../api/reception.api";
import type {
  ReceptionQueueItem,
  ReceptionFilters,
  ArrivalCheckInPayload,
  WalkInRegistrationPayload,
  QueueStatus,
  BillingStatus,
} from "../types/reception.types";

const INITIAL_MOCK_WORKLIST: ReceptionQueueItem[] = [
  {
    id: "q-101",
    tokenNumber: "TK-101",
    patientId: "p-501",
    patientName: "Rajesh Kumar",
    mrn: "MRN-2026-0891",
    mobile: "+91 9876543210",
    gender: "MALE",
    age: 45,
    dateOfBirth: "1979-05-12",
    appointmentTime: "09:00 AM",
    arrivalTime: "08:52 AM",
    checkInTimestamp: "2026-07-29T08:52:00Z",
    departmentId: 1,
    departmentName: "Cardiology",
    doctorId: 1,
    doctorName: "Dr. Alexander Fleming",
    queueStatus: "WAITING",
    billingStatus: "PAID",
    consultationFee: 500,
    visitType: "APPOINTMENT",
  },
  {
    id: "q-102",
    tokenNumber: "TK-102",
    patientId: "p-502",
    patientName: "Priya Sharma",
    mrn: "MRN-2026-0892",
    mobile: "+91 9812345678",
    gender: "FEMALE",
    age: 32,
    dateOfBirth: "1992-09-24",
    appointmentTime: "09:30 AM",
    arrivalTime: "09:25 AM",
    checkInTimestamp: "2026-07-29T09:25:00Z",
    departmentId: 1,
    departmentName: "Cardiology",
    doctorId: 1,
    doctorName: "Dr. Alexander Fleming",
    queueStatus: "IN_CONSULTATION",
    billingStatus: "PAID",
    consultationFee: 500,
    visitType: "WALK_IN",
  },
  {
    id: "q-103",
    tokenNumber: "TK-103",
    patientId: "p-503",
    patientName: "Anil Kapoor",
    mrn: "MRN-2026-0893",
    mobile: "+91 9988776655",
    gender: "MALE",
    age: 58,
    dateOfBirth: "1966-03-15",
    appointmentTime: "10:00 AM",
    arrivalTime: undefined,
    departmentId: 2,
    departmentName: "General Medicine",
    doctorId: 2,
    doctorName: "Dr. Sarah Jenkins",
    queueStatus: "WAITING",
    billingStatus: "PENDING",
    consultationFee: 400,
    visitType: "APPOINTMENT",
  },
  {
    id: "q-104",
    tokenNumber: "TK-104",
    patientId: "p-504",
    patientName: "Sunita Verma",
    mrn: "MRN-2026-0894",
    mobile: "+91 9765432109",
    gender: "FEMALE",
    age: 28,
    appointmentTime: "10:30 AM",
    arrivalTime: "10:20 AM",
    checkInTimestamp: "2026-07-29T10:20:00Z",
    departmentId: 3,
    departmentName: "Pediatrics",
    doctorId: 3,
    doctorName: "Dr. Michael Chen",
    queueStatus: "COMPLETED",
    billingStatus: "PAID",
    consultationFee: 450,
    visitType: "FOLLOW_UP",
  },
  {
    id: "q-105",
    tokenNumber: "TK-105",
    patientId: "p-505",
    patientName: "Vikram Malhotra",
    mrn: "MRN-2026-0895",
    mobile: "+91 9543210987",
    gender: "MALE",
    age: 50,
    appointmentTime: "11:00 AM",
    arrivalTime: undefined,
    departmentId: 1,
    departmentName: "Cardiology",
    doctorId: 1,
    doctorName: "Dr. Alexander Fleming",
    queueStatus: "CANCELLED",
    billingStatus: "REFUNDED",
    consultationFee: 500,
    visitType: "EMERGENCY",
  },
];

export const useReceptionQueue = () => {
  const [worklist, setWorklist] = useState<ReceptionQueueItem[]>(INITIAL_MOCK_WORKLIST);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReceptionFilters>({
    searchQuery: "",
    queueStatus: "ALL",
    billingStatus: "ALL",
    departmentId: "ALL",
    doctorId: "ALL",
    date: new Date().toISOString().split("T")[0],
  });

  const loadWorklist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await receptionApi.getWorklist({
        date: filters.date,
        departmentId: filters.departmentId !== "ALL" ? filters.departmentId : undefined,
        doctorId: filters.doctorId !== "ALL" ? filters.doctorId : undefined,
        status: filters.queueStatus !== "ALL" ? filters.queueStatus : undefined,
        search: filters.searchQuery || undefined,
      });

      if (data && data.length > 0) {
        setWorklist(data);
      }
    } catch (error) {
      console.warn("[useReceptionQueue] Error loading queue, keeping local state:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadWorklist();
  }, [loadWorklist]);

  const filteredQueue = useMemo(() => {
    return worklist.filter((item) => {
      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchMrn = item.mrn.toLowerCase().includes(q);
        const matchPhone = item.mobile.toLowerCase().includes(q);
        const matchToken = item.tokenNumber.toLowerCase().includes(q);
        const matchDoctor = item.doctorName.toLowerCase().includes(q);
        if (!matchName && !matchMrn && !matchPhone && !matchToken && !matchDoctor) {
          return false;
        }
      }

      // Queue Status Filter
      if (filters.queueStatus !== "ALL" && item.queueStatus !== filters.queueStatus) {
        return false;
      }

      // Billing Status Filter
      if (filters.billingStatus !== "ALL" && item.billingStatus !== filters.billingStatus) {
        return false;
      }

      // Department Filter
      if (filters.departmentId !== "ALL" && String(item.departmentId) !== String(filters.departmentId)) {
        return false;
      }

      // Doctor Filter
      if (filters.doctorId !== "ALL" && String(item.doctorId) !== String(filters.doctorId)) {
        return false;
      }

      return true;
    });
  }, [worklist, filters]);

  const handleCheckIn = async (payload: ArrivalCheckInPayload) => {
    const res = await receptionApi.checkInPatient(payload);
    setWorklist((prev) =>
      prev.map((item) =>
        item.id === payload.queueItemId
          ? {
              ...item,
              arrivalTime: res.checkInTime,
              checkInTimestamp: new Date().toISOString(),
              queueStatus: "WAITING" as QueueStatus,
              tokenNumber: res.tokenNumber || item.tokenNumber,
            }
          : item
      )
    );
    return res;
  };

  const handleRegisterWalkIn = async (payload: WalkInRegistrationPayload) => {
    const newItem = await receptionApi.registerWalkIn(payload);
    setWorklist((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleUpdateStatus = async (itemId: string | number, newStatus: QueueStatus) => {
    await receptionApi.updateQueueStatus(itemId, newStatus);
    setWorklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, queueStatus: newStatus } : item))
    );
  };

  const handleUpdateBilling = async (itemId: string | number, newBilling: BillingStatus) => {
    setWorklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, billingStatus: newBilling } : item))
    );
  };

  const stats = useMemo(() => {
    return {
      totalToday: worklist.length,
      waiting: worklist.filter((w) => w.queueStatus === "WAITING").length,
      inConsultation: worklist.filter((w) => w.queueStatus === "IN_CONSULTATION").length,
      completed: worklist.filter((w) => w.queueStatus === "COMPLETED").length,
      cancelled: worklist.filter((w) => w.queueStatus === "CANCELLED").length,
      billingPending: worklist.filter((w) => w.billingStatus === "PENDING").length,
    };
  }, [worklist]);

  return {
    worklist,
    filteredQueue,
    loading,
    filters,
    setFilters,
    stats,
    loadWorklist,
    handleCheckIn,
    handleRegisterWalkIn,
    handleUpdateStatus,
    handleUpdateBilling,
  };
};
