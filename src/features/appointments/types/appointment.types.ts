export type UserRole =
  | "Receptionist"
  | "Admin"
  | "Hospital Admin"
  | "Super Admin"
  | "Doctor"
  | "Nurse"
  | "Patient";

export type AppointmentStatusEnum =
  | "BOOKED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "WAITING_FOR_VITALS"
  | "WAITING_FOR_DOCTOR_CALL"
  | "CALLED"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type AppointmentStatus =
  | AppointmentStatusEnum
  | "Scheduled"
  | "Checked-In"
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | string;

export type QueueStatusEnum =
  | "WAITING"
  | "CALLED"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "SKIPPED";

export type AppointmentTypeEnum =
  | "CONSULTATION"
  | "WALK_IN"
  | "FOLLOW_UP"
  | "EMERGENCY"
  | "ROUTINE";

export type FamilyRelationshipEnum =
  | "SELF"
  | "FATHER"
  | "MOTHER"
  | "SPOUSE"
  | "SON"
  | "DAUGHTER"
  | "CHILD"
  | "SIBLING"
  | "OTHER";

export interface DoctorSummary {
  id: number | string;
  name: string;
  departmentId?: number | string;
  departmentName?: string;
  department?: string;
  specialty?: string;
  qualification?: string;
  consultationFee?: number | string;
  opdRoom?: string;
  status?: string;
  active?: boolean;
}

export interface PatientSummary {
  id: number | string;
  patientId?: string;
  fullName?: string;
  name: string;
  gender?: string;
  age?: number;
  mobile?: string;
  phone: string;
  mrn?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  assignedDoctor?: string;
}

export interface LinkedPatient {
  id: number | string;
  patientId: string;
  fullName: string;
  relationship: FamilyRelationshipEnum | string;
  gender?: string;
  dob?: string;
  mobile?: string;
  isSelf?: boolean;
}

export interface AppointmentRecord {
  date?: string;
  id: number | string;
  appointmentNumber?: string;
  queueToken?: string;
  patientId: number | string;
  patientName: string;
  patientMrn?: string;
  doctorId: number | string;
  doctorName: string;
  appointmentDate: string;
  startTime?: string;
  endTime?: string;
  status: AppointmentStatus;
  queueStatus?: QueueStatusEnum | string;
  appointmentType?: AppointmentTypeEnum | string;
  reason?: string;
  symptoms?: string;
  departmentId?: number;
  departmentName?: string;
  patient?: PatientSummary;
  doctor?: DoctorSummary;
  cancellationReason?: string;
  rescheduleReason?: string;
  vitalsRecorded?: boolean;
  paymentStatus?: "PAID" | "UNPAID" | "PARTIAL" | "PENDING";
  priority?: string;
  arrivalStatus?: string;
  opdRoom?: string;
  waitingTimeMinutes?: number;
  isWalkIn?: boolean;
  createdDate?: string;
  department?:
  | string
  | {
      departmentName?: string;
      name?: string;
      departmentCode?: string;
    };

  // Legacy / Backward Compatibility Optional Fields
  mrn?: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  doctorSpecialty?: string;
  tokenNo?: string;
  timeSlot?: string;
  visitType?: string;
  chiefComplaint?: string;
  notes?: string;
  feeAmount?: number;
}

export interface CreateAppointmentRequest {
  mrn: string;
  doctorId: number | string;
  appointmentDate: string;
  startTime: string;
  slotId?: number;
  appointmentType?: string;
  reason?: string;
  symptoms?: string;
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
  startTime?: string;
  slotId?: number;
  reason: string;
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface QueueActionResponse {
  action: string;
  appointmentId: number;
  appointmentNumber: string;
  tokenNumber?: string;
  queueNumber?: number;
  appointmentStatus: AppointmentStatusEnum;
  queueStatus: QueueStatusEnum;
  queueSkipReason?: string;
  doctor?: DoctorSummary;
  patient?: PatientSummary;
  appointmentDate?: string;
  appointmentTime?: string;
  consultationStartTime?: string;
  consultationEndTime?: string;
}

export interface Department {
  id: number | string;
  departmentName: string;
  departmentCode?: string;
}

export interface OnboardingStatusResponse {
  onboardingCompleted: boolean;
  patientCount: number;
  hasLinkedPatients: boolean;
}
