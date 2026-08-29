export interface RecordedVitalsData {
  vitalsId?: number | string;
  bloodPressure?: string;
  bpSystolic?: string;
  bpDiastolic?: string;
  pulseRate?: string;
  respRate?: string;
  temperature?: string;
  tempUnit?: "F" | "C";
  spo2?: string;
  heartRate?: string | number;
  oxygenSaturation?: string | number;
  height?: string;
  weight?: string;
  bmi?: string;
  bmiCategory?: string;
  bloodSugar?: string;
  bloodGroup?: string;
  painScale?: string;
  allergies?: string;
  notes?: string;
  // UI / Form fields
  temp?: string;
  systolic?: string;
  diastolic?: string;
  pulse?: string;
  resp?: string;
  sugar?: string;
  appearance?: string;
  consciousness?: string;
  observation?: string;
  recordedBy?: string | { employeeId?: string; name?: string };
  recordedAt?: string;
  chiefComplaint?: string;
  symptoms?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  status?: string;
  version?: number;
  lastUpdatedBy?: string | { employeeId?: string; name?: string };
  lastUpdatedAt?: string;
  lastReviewedBy?: string | { employeeId?: string; name?: string };
  lastReviewedAt?: string;
}

export interface NurseVitalsPayload {
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  temperature: number;
  weight: number;
  height: number;
  bloodPressure: string;
  pulse: number;
  spo2: number;
  bloodSugar?: number | string;
}

export interface NurseWaitingPatient {
  id?: number | string;
  queueId?: number | string;
  appointmentId: number | string;
  appointmentNumber?: string;
  token?: string;
  tokenNumber?: string;

  patientId?: number | string;
  patientName: string;
  mrn: string;
  age: number | string;
  gender: string;

  doctorId?: number;
  doctorName?: string;
  departmentName?: string;
  checkInTime?: string;
  appointmentTime?: string;
  time?: string;
  timeSlot?: string;
  status?: string;
  vitalsStatus?: string;
  consultationStatus?: string;
  priority?: string;
  checkInDate?: string;
  phone?: string;
  contact?: string;

  patient?: {
    id?: number | string;
    name?: string;
    fullName?: string;
    age?: number | string;
    gender?: string;
    mrn?: string;
    contact?: string;
  };

  doctor?: {
    doctorId?: number;
    name?: string;
    department?: string;
    departmentName?: string;
    specialty?: string;
  };

  department?:
    | {
        departmentName?: string;
        name?: string;
        departmentCode?: string;
      }
    | string;

  specialty?: string;
  visitType?: string;
}

export interface NurseVitalsApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
  errors: Record<string, unknown>;
}
