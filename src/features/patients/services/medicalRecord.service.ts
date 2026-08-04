/**
 * Medical Record Service – Fetches from existing OPD/Vitals endpoints
 * No duplicate modules — just aggregates data for the Medical Records tab
 */
import { apiClient } from "../../../lib/axios";
import type {
  ConsultationRecord,
  VitalsRecord,
  DiagnosisRecord,
  MedicalHistoryEntry,
  PatientMedicalSummary,
} from "../types/medicalRecord.types";

export const medicalRecordService = {
  /**
   * Fetch consultation records from existing OPD endpoints
   */
  async getConsultations(mrn: string): Promise<ConsultationRecord[]> {
    try {
      const response = await apiClient.get<any>(
        `/api/v1/opd/consultations?mrn=${encodeURIComponent(mrn)}`,
      );
      const data =
        response.data?.data || response.data?.content || response.data || [];
      const list = Array.isArray(data) ? data : [];
      return list.map((c: any) => ({
        id: c.id || c.consultationId || "",
        consultationDate: c.consultationDate || c.date || "",
        doctorName: c.doctorName || c.doctor || "",
        department: c.department || c.departmentName || "",
        chiefComplaint: c.chiefComplaint || "",
        diagnosis: c.diagnosis || c.diagnosisSummary || "",
        clinicalNotes: c.clinicalNotes || c.notes || "",
        followUpDate: c.followUpDate || "",
        status: c.status || "Completed",
        prescriptionIssued: c.prescriptionIssued ?? false,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch vitals history from existing endpoints
   */
  async getVitals(mrn: string): Promise<VitalsRecord[]> {
    try {
      const response = await apiClient.get<any>(
        `/api/v1/vitals?mrn=${encodeURIComponent(mrn)}`,
      );
      const data =
        response.data?.data || response.data?.content || response.data || [];
      const list = Array.isArray(data) ? data : [];
      return list.map((v: any) => ({
        id: v.id || v.vitalId || "",
        recordedAt: v.recordedAt || v.date || v.timestamp || "",
        recordedBy: v.recordedBy || v.nurseName || "",
        bloodPressure: v.bloodPressure || v.bp || "",
        heartRate: v.heartRate || v.hr || v.pulse || "",
        temperature: v.temperature || v.temp || "",
        spo2: v.spo2 || v.oxygenSaturation || "",
        weight: v.weight || "",
        height: v.height || "",
        bmi: v.bmi || "",
        respiratoryRate: v.respiratoryRate || "",
        notes: v.notes || "",
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch diagnosis records
   */
  async getDiagnoses(mrn: string): Promise<DiagnosisRecord[]> {
    try {
      const response = await apiClient.get<any>(
        `/api/v1/patients/${encodeURIComponent(mrn)}/diagnoses`,
      );
      const data = response.data?.data || response.data || [];
      const list = Array.isArray(data) ? data : [];
      return list.map((d: any) => ({
        id: d.id || "",
        date: d.date || d.diagnosisDate || "",
        doctorName: d.doctorName || d.doctor || "",
        diagnosisCode: d.diagnosisCode || d.icdCode || "",
        diagnosisName: d.diagnosisName || d.name || d.diagnosis || "",
        severity: d.severity || "Moderate",
        notes: d.notes || "",
        status: d.status || "Active",
      }));
    } catch {
      return [];
    }
  },

  /**
   * Get full medical summary combining consultations, vitals, diagnoses
   */
  async getMedicalSummary(mrn: string): Promise<PatientMedicalSummary> {
    const [consultations, vitals, diagnoses] = await Promise.all([
      medicalRecordService.getConsultations(mrn),
      medicalRecordService.getVitals(mrn),
      medicalRecordService.getDiagnoses(mrn),
    ]);

    // Build timeline from all records
    const timeline: MedicalHistoryEntry[] = [
      ...consultations.map((c) => ({
        id: c.id,
        type: "consultation" as const,
        date: c.consultationDate,
        title: `Consultation – ${c.department}`,
        description: c.diagnosis || c.chiefComplaint || "Consultation visit",
        doctorName: c.doctorName,
        department: c.department,
        status: c.status,
      })),
      ...vitals.map((v) => ({
        id: v.id,
        type: "vitals" as const,
        date: v.recordedAt,
        title: "Vitals Recorded",
        description:
          [
            v.bloodPressure && `BP: ${v.bloodPressure}`,
            v.heartRate && `HR: ${v.heartRate}`,
            v.temperature && `Temp: ${v.temperature}`,
            v.spo2 && `SpO2: ${v.spo2}`,
          ]
            .filter(Boolean)
            .join(" · ") || "Vitals taken",
        doctorName: v.recordedBy,
        status: "Completed",
      })),
      ...diagnoses.map((d) => ({
        id: d.id,
        type: "diagnosis" as const,
        date: d.date,
        title: d.diagnosisName,
        description: d.notes || `Diagnosis: ${d.diagnosisName}`,
        doctorName: d.doctorName,
        status: d.status,
      })),
    ].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return {
      consultations,
      vitals,
      diagnoses,
      timeline,
      totalVisits: consultations.length,
      lastVisitDate: consultations[0]?.consultationDate,
    };
  },
};
