export interface DiagnosisItem {
  code: string;
  label: string;
}

export interface EncounterDiagnosisPayload {
  diagnosisCode: string;
  diagnosisName: string;
  codingSystem?: string;
  diagnosisType?: string;
  certainty?: string;
  clinicalNotes?: string;
}
