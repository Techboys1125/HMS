export type PatientStatus =
  "ACTIVE" | "INACTIVE" | "DECEASED" | "DUPLICATE_CANDIDATE";

export type AgeBasis = "EXACT" | "APPROXIMATE";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "UNKNOWN";

export type MaritalStatus =
  "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED";

export type PatientCategory =
  | "GENERAL"
  | "VIP"
  | "EMPLOYEE"
  | "FAMILY"
  | "INSURANCE"
  | "CORPORATE"
  | "RESEARCH"
  | "CHARITY";

export type RegistrationType = "ONLINE" | "WALK_IN";

export interface EmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

/**
 * Patient record returned from GET /api/v1/patients
 */
export interface Patient {
  userId: number;
  insuranceDetails: {
    provider?: string;
    policyNumber?: string;
    validUntil?: string;
    coverageType?: string;
  } | null;
  id?: number;
  mrn: string;
  fullName: string;
  name?: string;
  patientName?: string;
  relationship?:
    | "SELF"
    | "FATHER"
    | "MOTHER"
    | "SPOUSE"
    | "SON"
    | "DAUGHTER"
    | "BROTHER"
    | "SISTER"
    | "GRANDFATHER"
    | "GRANDMOTHER"
    | "GUARDIAN"
    | "OTHER"
    | string;
  age?: number;
  gender: string;
  phone?: string;
  mobileNumber?: string;
  mobile?: string;
  email?: string;
  dateOfBirth?: string;
  dob?: string;
  bloodGroup?: string;
  blood_type?: string;
  maritalStatus?: string;
  nationalId?: string;
  photoUrl?: string;
  photo?: string;
  address?:
    | string
    | {
        street?: string;
        streetAddress?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        postalCode?: string;
        pincode?: string;
        country?: string;
      };
  emergencyContact?: {
    name?: string;
    contactName?: string;
    relationship?: string;
    phone?: string;
    contactNumber?: string;
    mobile?: string;
    mobileNumber?: string;
    alternativeMobileNumber?: string;
  };
  patientCategory?: string;
  registrationType?: string;
  knownAllergies?: string[];
  allergies?: string[];
  chronicDiseases?: string[];
  medicalHistory?: string[];
  specialNotes?: string;
  status?: string;
  assignedDoctor?: string;
  registrationDate?: string;
  createdAt?: string;
  version?: number;
  updatedAt?: string;
  updatedBy?: {
    userId?: string;
    employeeId?: string;
    fullName?: string;
    role?: string;
  };
  visitCount?: number;
  lastVisitDate?: string;
  nextAppointmentDate?: string | null;
  lastVisit?: string;
  totalVisits?: number;
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

/**
 * Full request body for POST /api/v1/patients
 */
export interface CreatePatientRequest {
  fullName: string;
  gender: string; // MALE, FEMALE, OTHER
  dateOfBirth?: string | null;
  bloodGroup?: string;
  phone?: string;
  mobileNumber?: string;
  email?: string;
  maritalStatus?: string;
  nationalId?: string;
  photoUrl?: string;
  relationship?: string;
  address?:
    | {
        value?: string;
        line1?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        postalCode?: string;
        country?: string;
      }
    | string;
  emergencyContact?: {
    name: string;
    relationship: string;
    mobileNumber: string;
    alternativeMobileNumber?: string;
  };
  patientCategory?: string;
  registrationType?: RegistrationType;
  knownAllergies?: string[];
  chronicDiseases?: string[];
  specialNotes?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  reason?: string;
}

export interface PatientSearchResult extends Patient {
  fullName: string;
}

export type PatientFormInput = CreatePatientRequest;
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
  doctorId?: number | string;
  doctor: string;
  specialty: string;
  department: string;
  visitType: "In-Person OPD" | "Follow-up OPD";
  status:
    | "Confirmed"
    | "Scheduled"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Pending"
    | "Checked-In"
    | "Waiting for Vitals"
    | "Waiting for Doctor";
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
  "success" | "warning" | "error" | "info" | "teal" | "default";
export interface PatientProfileScreenProps {
  onBack?: () => void;
  onEditPatient?: () => void;
  onEdit?: () => void;
  onBookAppointment?: (mrn?: string) => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  onStartConsultation?: () => void;
  onRecordVitals?: () => void;
  onAddFamilyMember?: () => void;
  onSwitchPatient?: () => void;
  patientMrn?: string;
  userRole?: string;
  role?: string;
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

export interface PatientQueueData {
  appointmentId: number;
  appointmentNumber?: string;
  token: string;
  tokenNumber?: string;
  queueNumber?: number;
  position: number;
  patientsAhead: number;
  estimatedWaitMinutes: number;
  appointmentStatus?: string;
  queueStatus?: string;
  status: string;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorName: string;
  departmentName: string;
}

export interface PatientQueueApiResponse {
  success: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data: PatientQueueData;
  errors?: Record<string, unknown>;
}

/**
 * Standard API response envelope returned by backend endpoints
 */
export interface PatientApiResponse<T> {
  success: boolean;
  code?: string;
  message?: string;
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

/**
 * Family member record returned from /api/v1/patients/{mrn}/family-members
 */
export interface ApiPatientFamilyMember {
  id?: string | number;
  mrn?: string;
  name: string;
  relationship?: string;
  mobileNumber?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

/**
 * Appointment record returned from /api/v1/appointments?mrn=
 */
export interface ApiPatientAppointment {
  id: string | number;
  appointmentId?: string | number;
  date?: string;
  time?: string;
  doctorId?: number | string;
  doctor?: string | { name?: string; fullName?: string; id?: number | string };
  doctorName?: string;
  department?: string | { departmentName?: string; name?: string };
  departmentName?: string;
  specialty?: string;
  visitType?: string;
  status?: string;
  appointmentStatus?: string;
  reason?: string;
  notes?: string;
  roomLocation?: string;
  billingStatus?: string;
  paymentStatus?: string;
  billingAmount?: string;
  consultationStatus?: string;
  prescriptionStatus?: string;
  symptoms?: string;
  mrn?: string;
  patientMrn?: string;
  appointmentDate?: string;
  startTime?: string;
  visitDateTime?: string;
}

/**
 * Prescription record returned from /api/v1/patient/prescriptions
 */
export interface ApiPatientPrescription {
  id: string | number;
  date?: string;
  doctorName?: string;
  department?: string;
  diagnosis?: string;
  followUpDate?: string;
  medicines?: Array<{
    dose?: string | number;
    route?: string;
    strength: string;
    medicineName: string;
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  medicineCount?: number;
  status?: string;
}

/**
 * Invoice record returned from /api/v1/billing/patient/{mrn}
 */
export interface ApiPatientInvoice {
  id: string | number;
  invoiceNumber?: string;
  date?: string;
  status?: string;
  amount?: string | number;
}

/**
 * Form mode determines which fields are visible and editable
 * - register: Admin/Receptionist registering a new patient
 * - edit: Editing an existing patient profile
 * - family: Adding a family member (reuses registration form)
 * - self: Patient completing their own registration after auth
 */
export type PatientFormMode = "register" | "edit" | "family" | "self";

/**
 * Maps which fields each role can edit in the PatientRegistrationForm
 */
export interface RoleFieldPermissions {
  /** Fields that are always read-only regardless of role */
  alwaysReadOnly: string[];
  /** Fields editable by this role */
  editableFields: string[];
  /** Fields visible but read-only for this role */
  readOnlyFields: string[];
  /** Fields hidden from this role */
  hiddenFields: string[];
}

/**
 * Role-based field permission configuration
 */
export const ROLE_FIELD_PERMISSIONS: Record<string, RoleFieldPermissions> = {
  ADMIN: {
    alwaysReadOnly: ["mrn"],
    editableFields: [
      "fullName",
      "gender",
      "dateOfBirth",
      "bloodGroup",
      "maritalStatus",
      "mobileNumber",
      "email",
      "photoUrl",
      "nationalId",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "patientCategory",
      "registrationType",
      "knownAllergies",
      "chronicDiseases",
      "specialNotes",
    ],
    readOnlyFields: [],
    hiddenFields: [],
  },
  HOSPITAL_ADMIN: {
    alwaysReadOnly: ["mrn"],
    editableFields: [
      "fullName",
      "gender",
      "dateOfBirth",
      "bloodGroup",
      "maritalStatus",
      "mobileNumber",
      "email",
      "photoUrl",
      "nationalId",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "patientCategory",
      "registrationType",
      "knownAllergies",
      "chronicDiseases",
      "specialNotes",
    ],
    readOnlyFields: [],
    hiddenFields: [],
  },
  RECEPTIONIST: {
    alwaysReadOnly: ["mrn"],
    editableFields: [
      "fullName",
      "gender",
      "dateOfBirth",
      "mobileNumber",
      "email",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "nationalId",
      "patientCategory",
      "registrationType",
    ],
    readOnlyFields: ["bloodGroup", "maritalStatus"],
    hiddenFields: ["knownAllergies", "chronicDiseases", "specialNotes"],
  },
  PATIENT: {
    alwaysReadOnly: ["mrn", "dateOfBirth", "gender"],
    editableFields: [
      "mobileNumber",
      "email",
      "photoUrl",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
    ],
    readOnlyFields: [
      "fullName",
      "bloodGroup",
      "maritalStatus",
      "nationalId",
      "ecName",
      "ecRelationship",
      "ecMobile",
    ],
    hiddenFields: ["patientCategory", "registrationType"],
  },
  DOCTOR: {
    alwaysReadOnly: ["mrn", "dateOfBirth", "gender"],
    editableFields: [],
    readOnlyFields: [
      "fullName",
      "mobileNumber",
      "email",
      "bloodGroup",
      "knownAllergies",
      "chronicDiseases",
    ],
    hiddenFields: [
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "nationalId",
      "patientCategory",
      "registrationType",
      "specialNotes",
    ],
  },
  NURSE: {
    alwaysReadOnly: ["mrn", "dateOfBirth", "gender"],
    editableFields: [],
    readOnlyFields: [
      "fullName",
      "mobileNumber",
      "bloodGroup",
      "knownAllergies",
    ],
    hiddenFields: [
      "email",
      "maritalStatus",
      "nationalId",
      "photoUrl",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "patientCategory",
      "registrationType",
      "chronicDiseases",
      "specialNotes",
    ],
  },
  ACCOUNTANT: {
    alwaysReadOnly: ["mrn", "dateOfBirth", "gender"],
    editableFields: [],
    readOnlyFields: ["fullName", "mobileNumber", "email"],
    hiddenFields: [
      "bloodGroup",
      "maritalStatus",
      "nationalId",
      "photoUrl",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
      "ecName",
      "ecRelationship",
      "ecMobile",
      "ecAltMobile",
      "patientCategory",
      "registrationType",
      "knownAllergies",
      "chronicDiseases",
      "specialNotes",
    ],
  },
};

/**
 * Context for switching between patient and family member accounts
 */
export interface SwitchAccountContext {
  /** Currently active patient MRN */
  activeMrn: string;
  /** Primary patient MRN (the logged-in user's own MRN) */
  primaryMrn: string;
  /** Name of the currently active patient */
  activePatientName: string;
  /** Whether currently viewing a family member's data */
  isFamilyMember: boolean;
}
