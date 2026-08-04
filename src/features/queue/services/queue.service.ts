import { queueApi } from "../api/queue.api";
import type { BaseQueueItem, QueueStatus } from "../types/queue.types";

/**
 * Queue State Machine Helper
 *
 * Mirrors the OPD appointment lifecycle:
 * BOOKED -> (CONFIRMED optional) -> CHECKED_IN -> WAITING_FOR_VITALS
 *   -> WAITING_FOR_DOCTOR_CALL -> CALLED -> IN_CONSULTATION -> COMPLETED
 * Terminal states: COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED.
 */
export const QUEUE_STATUS_TRANSITIONS: Record<QueueStatus, QueueStatus[]> = {
  BOOKED: ["CONFIRMED", "CHECKED_IN", "CANCELLED", "RESCHEDULED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "RESCHEDULED"],
  CHECKED_IN: ["WAITING_FOR_VITALS", "CANCELLED"],
  WAITING: ["CHECKED_IN", "WAITING_FOR_VITALS", "CANCELLED"],
  WAITING_FOR_VITALS: ["WAITING_FOR_DOCTOR_CALL", "CANCELLED"],
  IN_VITALS: ["WAITING_FOR_DOCTOR_CALL"],
  WAITING_FOR_DOCTOR: ["CALLED"],
  WAITING_FOR_DOCTOR_CALL: ["CALLED"],
  CALLED: ["IN_CONSULTATION", "NO_SHOW"],
  IN_CONSULTATION: ["COMPLETED"],
  CONSULTATION_COMPLETED: ["BILLING_PENDING", "COMPLETED"],
  BILLING_PENDING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
  RESCHEDULED: [],
};

export const queueService = {
  /**
   * Validates if status transition is allowed
   */
  canTransition(currentStatus: QueueStatus, nextStatus: QueueStatus): boolean {
    const allowed = QUEUE_STATUS_TRANSITIONS[currentStatus];
    return allowed ? allowed.includes(nextStatus) : true;
  },

  /**
   * Fetch active queue worklist
   */
  async getActiveQueue(params?: {
    date?: string;
    departmentId?: string | number;
    doctorId?: string | number;
    status?: string;
  }): Promise<BaseQueueItem[]> {
    return queueApi.getQueue(params);
  },
};
