export type PatientStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DECEASED"
  | "DUPLICATE_CANDIDATE";

export type AgeBasis = "EXACT" | "APPROXIMATE";

export interface EmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
}

export interface Patient {
  id: number;
  name: string;
  patientId: string;
  mrn: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  assignedDoctor: string;
  registrationDate: string;
}

export interface PatientStatistics {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  duplicateCandidates: number;
  deceasedPatients: number;
  newRegistrationsToday: number;
}

export interface DuplicateCheckRequest {
  fullName: string;
  dob: string | null;
  mobile: string;
  email?: string;
  gender: string;
}

export interface DuplicateOverrideRequest {
  reason: string;
}

export interface MergePatientsRequest {
  sourceMrn: string;
  targetMrn: string;
  reason: string;
}

export interface CreatePatientRequest {
  relationship: string;
  fullName: string;
  gender: string; // MALE, FEMALE, OTHER
  dateOfBirth: string | null;
  bloodGroup: string;
  phone: string;
  email: string;
  address: {
    value?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  } | string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  reason?: string;
}

export interface PatientSearchResult extends Patient {
  fullName: string;
}

export interface PatientFormInput extends CreatePatientRequest {}
export type ScreenPatient = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "Other";
  mobile: string;
  doctor: string;
  department: string;
  visitType: string;
  regDate: string;
  status: "Active" | "Inactive" | "Discharged" | "Admitted";
  photo?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  lastVisit?: {
    date: string;
    doctor: string;
    reason: string;
  };
};
export type VisitRecord = {
  id: string;
  visitDate: string;
  visitTime: string;
  department: string;
  doctor: string;
  chiefComplaint: string;
  diagnosis: string;
  prescriptionIssued: boolean;
  prescriptionCount: number;
  prescriptions: string[];
  status: "Completed" | "Follow-up Required" | "In Progress" | "Cancelled";
  vitals: { bp: string; hr: string; temp: string; spo2: string };
  clinicalNotes: string;
};
export type PatientAppointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  department: string;
  visitType: "In-Person OPD" | "Follow-up OPD";
  status:
    | "Confirmed"
    | "Scheduled"
    | "In-Progress"
    | "Completed"
    | "Cancelled"
    | "Pending";
  roomLocation: string;
  reason: string;
  notes: string;
  consultationStatus: string;
  prescriptionStatus: string;
  billingStatus: string;
  billingAmount: string;
};
export interface BookingDoctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  department: string;
  experience: string;
  consultationFee: string;
  availability: string;
  rating: string;
  reviewCount: number;
  avatar: string;
  availableToday: boolean;
}

export interface PatientCancelAppointmentDialogProps {
  appointment: PatientAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (id: string, reason: string, comments: string) => void;
  onBookNewAppointment?: () => void;
}

export interface PatientRescheduleAppointmentDialogProps {
  appointment: PatientAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReschedule: (
    id: string,
    newDate: string,
    newTime: string,
    reason: string,
    notes: string,
  ) => void;
  onViewDetails?: (appt: PatientAppointment) => void;
}

export type MedicalVisitRecord = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  department: string;
  diagnosis: string;
  prescriptions: string[];
  notes: string;
  status: "Completed" | "Follow-up Required" | "In-Progress";
};
export type PrescriptionRecord = {
  id: string;
  doctor: string;
  department: string;
  issueDate: string;
  status: "Active" | "Expired" | "Refilled";
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  diagnosis: string;
  followUpDate: string;
};
export type PatientInvoice = {
  id: string;
  date: string;
  dueDate: string;
  doctor: string;
  department: string;
  amount: string;
  numericAmount: number;
  status: "Paid" | "Pending" | "Overdue" | "Partial";
  patientPayable: string;
  items: {
    description: string;
    category: string;
    cost: string;
  }[];
  paymentRef?: string;
  paymentDate?: string;
  paymentMethod?: string;
};
export type PaymentHistoryRecord = {
  id: string;
  date: string;
  time: string;
  amount: string;
  method: string;
  referenceNumber: string;
  invoiceId: string;
  status: "Completed" | "Processing";
};
export type ScreenPatientSearchResult = {
  mrn: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  bloodGroup: string;
  regDate: string;
  status:
    | "Active"
    | "Inactive"
    | "Registered"
    | "Scheduled"
    | "Checked-In"
    | "Completed";
  regType: "New Patient" | "Existing Patient Update";
  lastVisit?: {
    date: string;
    doctor: string;
    department: string;
    status: string;
  };
  upcomingAppointment?: {
    date: string;
    time: string;
    doctor: string;
    department: string;
    status: string;
  };
};
export type ChipVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "teal"
  | "default";
export interface ReceptionPatientProfileScreenProps {
  onBack?: () => void;
  onEditPatient?: () => void;
  onBookAppointment?: (mrn?: string) => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  patientMrn?: string;
  userRole?: string;
}

export interface PatientPrescriptionItem {
  id: string;
  consultationId: string;
  consultationDate: string;
  doctorName: string;
  department: string;
  diagnosisSummary: string;
  medicines: Array<{
    name: string;
    strength: string;
    route: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  followupDate: string;
  status: "Issued" | "Completed" | "Archived";
  downloadCount?: number;
}
