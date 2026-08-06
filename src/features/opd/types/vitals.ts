export interface PatientVitals {
  height?: string;
  weight?: string;
  bmi?: string;
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  respiratoryRate?: string;
  bloodSugar?: string;
}
export interface EncounterVitalsPayload {
  height?: number;
  weight?: number;
  temperature?: number;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  respiratoryRate?: number;
  spo2?: number;
  bloodSugar?: number;
  clinicalNotes?: string;
}
