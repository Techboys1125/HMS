export interface RecordedVitalsData {
  bpSystolic?: string;
  bpDiastolic?: string;
  pulseRate?: string;
  respRate?: string;
  temperature?: string;
  tempUnit?: "F" | "C";
  spo2?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  bmiCategory?: string;
  bloodSugar?: string;
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
  pain?: number | string;
  appearance?: string;
  consciousness?: string;
  observation?: string;
  recordedBy?: string;
  recordedAt?: string;
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
  status?: string;
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
  };

  department?: {
    departmentName?: string;
    name?: string;
    departmentCode?: string;
  } | string;
}

export interface NurseVitalsApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
  errors: Record<string, unknown>;
}
