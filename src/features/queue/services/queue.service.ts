import { queueApi } from "../api/queue.api";
import type { BaseQueueItem, QueueStatus } from "../types/queue.types";

/**
 * Queue State Machine Helper
 */
export const QUEUE_STATUS_TRANSITIONS: Record<QueueStatus, QueueStatus[]> = {
  BOOKED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["WAITING_FOR_VITALS", "IN_VITALS", "WAITING_FOR_DOCTOR"],
  WAITING: ["WAITING_FOR_VITALS", "IN_VITALS", "WAITING_FOR_DOCTOR", "CALLED"],
  WAITING_FOR_VITALS: ["IN_VITALS", "WAITING_FOR_DOCTOR"],
  IN_VITALS: ["WAITING_FOR_DOCTOR"],
  WAITING_FOR_DOCTOR: ["CALLED", "IN_CONSULTATION"],
  CALLED: ["IN_CONSULTATION", "NO_SHOW"],
  IN_CONSULTATION: ["CONSULTATION_COMPLETED", "BILLING_PENDING"],
  CONSULTATION_COMPLETED: ["BILLING_PENDING", "COMPLETED"],
  BILLING_PENDING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
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
