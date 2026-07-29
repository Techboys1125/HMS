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
  empId: string;
  regNumber: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  specialty: string;
  qualification: string;
  experienceYrs: number;
  consultationFee: number;
  followUpFee?: number;
  slotDuration?: string;
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

export interface DoctorApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
