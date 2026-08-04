export type QueueStatus =
  | "WAITING"
  | "WAITING_FOR_VITALS"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "CHECKED_IN";

export type BillingStatus = "PAID" | "PENDING" | "PARTIAL" | "EXEMPT" | "REFUNDED";

export interface ReceptionQueueItem {
  id: string | number;
  tokenNumber: string;
  patientId: string | number;
  patientName: string;
  mrn: string;
  mobile: string;
  gender: string;
  age?: number | string;
  dateOfBirth?: string;
  appointmentId?: string | number;
  appointmentTime: string;
  arrivalTime?: string;
  checkInTimestamp?: string;
  departmentId: string | number;
  departmentName: string;
  doctorId: string | number;
  doctorName: string;
  queueStatus: QueueStatus;
  billingStatus: BillingStatus;
  consultationFee: number;
  visitType: "WALK_IN" | "APPOINTMENT" | "FOLLOW_UP" | "EMERGENCY";
  notes?: string;
}

export interface ReceptionFilters {
  searchQuery: string;
  queueStatus: string;
  billingStatus: string;
  departmentId: string;
  doctorId: string;
  date: string;
}

export interface ArrivalCheckInPayload {
  queueItemId: string | number;
  patientId: string | number;
  appointmentId?: string | number;
  checkInTime?: string;
  vitalsCaptured?: boolean;
  notes?: string;
}

export interface WalkInRegistrationPayload {
  fullName: string;
  mobile: string;
  gender: string;
  dateOfBirth?: string;
  age?: number;
  address?: string;
  departmentId: string | number;
  doctorId: string | number;
  consultationFee: number;
  visitType: "WALK_IN" | "EMERGENCY";
  paymentMode: "CASH" | "CARD" | "UPI" | "INSURANCE" | "PENDING";
}

export interface VisitSlipData {
  tokenNumber: string;
  patientName: string;
  mrn: string;
  mobile: string;
  gender: string;
  age?: number | string;
  departmentName: string;
  doctorName: string;
  consultationFee: number;
  billingStatus: BillingStatus;
  checkInTime: string;
  visitType: string;
  hospitalName?: string;
  barcodeValue?: string;
}

export interface ReceptionPermissions {
  canViewWorklist: boolean;
  canCheckInPatient: boolean;
  canGenerateToken: boolean;
  canRegisterWalkIn: boolean;
  canPrintVisitSlip: boolean;
  canUpdateBillingStatus: boolean;
  canCancelQueueItem: boolean;
  canViewClinicalNotes: boolean;
}

export interface ReceptionCheckInResponse {
  tokenNumber?: string;
  status?: string;
  success?: boolean;

  additionalProp1?: Record<string, unknown>;
  additionalProp2?: Record<string, unknown>;
  additionalProp3?: Record<string, unknown>;
}

export interface ReceptionTokenResponse {
  additionalProp1?: Record<string, unknown>;
  additionalProp2?: Record<string, unknown>;
  additionalProp3?: Record<string, unknown>;
  tokenNumber?: string;
  token?: string;
  [key: string]: unknown;
}

export type ReceptionQueueResponse = Array<{
  additionalProp1?: Record<string, unknown>;
  additionalProp2?: Record<string, unknown>;
  additionalProp3?: Record<string, unknown>;
  [key: string]: unknown;
}>;

