import type { ReactNode } from "react";

export type DoctorAvailability =
  | "Available Today"
  | "On Duty"
  | "On Call"
  | "On Leave"
  | "Out of Office";

export type DoctorStatus = "Active" | "Inactive" | "On Leave" | "Suspended";

export type RxStatus =
  | "Draft"
  | "Issued"
  | "Completed"
  | "Cancelled"
  | "Archived";

export interface DoctorRecord {
  id: string;
  userId?: number;
  doctorId?: number;
  empId: string;
  regNumber: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  primaryDepartmentId?: number;
  specialty: string;
  primarySpecialtyId?: number;
  qualification: string;
  designation?: string;
  experienceYrs: number;
  consultationFee: number;
  followUpFee?: number;
  slotDuration?: string;
  slotDurationMinutes?: number;
  availability: DoctorAvailability;
  status: DoctorStatus;
  email: string;
  phone: string;
  address?: string;
  dob?: string;
  opdRoom: string;
  joinedDate: string;
  shiftTimings: string;
  workingDays: string[];
  bio?: string;
  scheduleExceptions?: ApiScheduleExceptionItem[];
  rawAvailability?: ApiAvailabilityItem[];
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  gender: string;
  age: number;
  date: string;
  time: string;
  type: string;
  status: string;
  complaint: string;
}

export interface DoctorPatient {
  id: string;
  name: string;
  gender: string;
  age: number;
  lastVisit: string;
  status: string;
  complaint: string;
}

export interface WeeklySchedule {
  day: string;
  available: boolean;
  startTime: string;
  endTime: string;
  slotDuration: string;
}

export interface DoctorTimeline {
  by: ReactNode;
  event: ReactNode;
  time: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  type: string;
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  mrn: string;
  consultationId: string;
  department: string;
  consultationDate: string;
  medicineCount: number;
  followup: boolean;
  followupDate?: string;
  status: RxStatus;
  doctorName: string;
  diagnosis: string;
  medicinesList: Array<{ name: string; dose: string; freq: string }>;
}

export interface EditableMedicine {
  id: string;
  name: string;
  strength: string;
  route: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
}

export interface VitalSign {
  label: string;
  value: string;
  unit: string;
  Icon: React.ElementType;
  status: string;
  color: string;
  normal: string;
}

export interface Medication {
  id: number;
  name: string;
  dose: string;
  freq: string;
  route: string;
  status: string;
  refill: string;
}

export interface MedicineDetail {
  id: string;
  name: string;
  strength: string;
  route: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
}

export interface ApiDepartmentRef {
  departmentId: number;
  departmentName: string;
}

export interface ApiSpecialtyRef {
  specialtyId: number;
  specialtyName: string;
}

export interface ApiAvailabilityItem {
  availabilityId?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ApiScheduleExceptionItem {
  id?: number;
  doctorId?: number;
  exceptionDate?: string;
  reason: string;
  exceptionType?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  action?: string;
  status?: string;
  fullDay?: boolean;
}

export interface ApiDoctorProfile {
  doctorId: number;
  medicalRegistrationNumber: string;
  qualification: string;
  yearsOfExperience: number;
  primaryDepartment?: ApiDepartmentRef;
  secondaryDepartments?: ApiDepartmentRef[];
  primarySpecialty?: ApiSpecialtyRef;
  secondarySpecialties?: ApiSpecialtyRef[];
  consultationFee: number;
  followUpFee: number;
  slotDurationMinutes: number;
  availability: ApiAvailabilityItem[];
  scheduleExceptions: ApiScheduleExceptionItem[];
}

export interface ApiUserDoctorRecord {
  userId: number;
  employeeId: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  role: string;
  status: string;
  doctorProfile?: ApiDoctorProfile;
}

export interface CreateDoctorPayload {
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  role: "DOCTOR";
  medicalRegistrationNumber: string;
  qualification: string;
  yearsOfExperience: number;
  doctorCode?: string;
  primaryDepartmentId: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId: number;
  secondarySpecialtyIds?: number[];
  consultationFee: number;
  followUpFee: number;
  slotDurationMinutes: number;
  availability: ApiAvailabilityItem[];
  scheduleExceptions?: ApiScheduleExceptionItem[];
  sendCredentials?: boolean;
}

export interface UpdateDoctorPayload {
  fullName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  medicalRegistrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  consultationFee?: number;
  followUpFee?: number;
  slotDurationMinutes?: number;
  availability?: ApiAvailabilityItem[];
  scheduleExceptions?: ApiScheduleExceptionItem[];
  version?: number;
  changeReason?: string;
}

export interface DoctorDailySlot {
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
  appointmentId?: number;
  exceptionId?: number;
}

export interface DoctorDailyAvailabilityData {
  doctorId: number;
  date: string;
  scheduleStatus: string;
  slots: DoctorDailySlot[];
}

export interface DoctorCalendarDayItem {
  date: string;
  status: string;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
}

export interface DoctorMonthlyAvailabilityData {
  doctorId: number;
  month: string;
  days: DoctorCalendarDayItem[];
}

export interface DoctorApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  timestamp?: string;
  data?: T;
  errors?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DoctorQueueSummary {
  waitingCount?: number;
  inConsultationCount?: number;
  completedCount?: number;
  [key: string]: unknown;
}

export interface DoctorQueueItem {
  queueId: number;
  appointmentId: number;
  appointmentNumber: string;
  token: string;
  queueNumber: number;
  position: number;
  priority: string;
  status: string;
  checkInTime: string;
  patient: {
    name: string;
    mrn: string;
    age: number;
    gender: string;
    contact?: string;
  };
  doctor?: {
    doctorId: number;
    name: string;
    doctorCode: string;
    department: string;
    specialty: string;
  };
}

export interface DoctorQueueResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    summary?: DoctorQueueSummary;
    content?: DoctorQueueItem[];
    page?: Record<string, unknown>;
  };
  errors: Record<string, unknown>;
}

export interface DoctorCallNextResponse {
  action: string;
  appointmentId: number;
  appointmentNumber: string;
  tokenNumber: string;
  queueNumber: number;
  appointmentStatus: string;
  queueStatus: string;
  queueSkipReason?: string;
  doctor?: {
    doctorId: number;
    doctorCode: string;
    name: string;
  };
  patient?: {
    fullName: string;
    mrn: string;
    gender: string;
    age: string | number;
  };
  appointmentDate?: string;
  appointmentTime?: string;
  consultationStartTime?: string;
  consultationEndTime?: string;
  version?: number;
}

export type CurrentPatient = DoctorQueueItem | null;
export type NextPatient = DoctorQueueItem | null;

export interface FinalizePrescriptionRequest {
  confirmation: boolean;
}

export interface FinalizePrescriptionResponse {
  prescriptionId: string;
  status: string;
  version: number;
  issuedAt: string;
  issuedBy: {
    doctorId: string;
    fullName: string;
    registrationNumber: string;
  };
}


