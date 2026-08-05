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

interface ApiResponse {
  data?: unknown;
  content?: unknown;
}

type RawRecord = Record<string, unknown>;

export const medicalRecordService = {
  /**
   * Fetch consultation records from existing OPD endpoints
   */
  async getConsultations(mrn: string): Promise<ConsultationRecord[]> {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/api/v1/opd/consultations?mrn=${encodeURIComponent(mrn)}`,
      );
      const data =
        response.data?.data || response.data?.content || response.data || [];
      const list = (Array.isArray(data) ? data : []) as RawRecord[];
      return list.map((c: RawRecord) => {
        let status: ConsultationRecord["status"] = "Completed";
        const rawStatus = c.status as string;
        if (
          rawStatus === "Completed" ||
          rawStatus === "In-Progress" ||
          rawStatus === "Follow-up Required" ||
          rawStatus === "Cancelled"
        ) {
          status = rawStatus;
        }
        return {
          id: (c.id || c.consultationId || "") as string | number,
          consultationDate: (c.consultationDate || c.date || "") as string,
          doctorName: (c.doctorName || c.doctor || "") as string,
          department: (c.department || c.departmentName || "") as string,
          chiefComplaint: c.chiefComplaint as string | undefined,
          diagnosis: (c.diagnosis || c.diagnosisSummary) as string | undefined,
          clinicalNotes: (c.clinicalNotes || c.notes) as string | undefined,
          followUpDate: c.followUpDate as string | undefined,
          status,
          prescriptionIssued: c.prescriptionIssued as boolean | undefined,
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Fetch vitals history from existing endpoints
   */
  async getVitals(mrn: string): Promise<VitalsRecord[]> {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/api/v1/vitals?mrn=${encodeURIComponent(mrn)}`,
      );
      const data =
        response.data?.data || response.data?.content || response.data || [];
      const list = (Array.isArray(data) ? data : []) as RawRecord[];
      return list.map((v: RawRecord) => ({
        id: (v.id || v.vitalId || "") as string | number,
        recordedAt: (v.recordedAt || v.date || v.timestamp || "") as string,
        recordedBy: (v.recordedBy || v.nurseName) as string | undefined,
        bloodPressure: v.bloodPressure as string | undefined,
        heartRate: v.heartRate as string | undefined,
        temperature: v.temperature as string | undefined,
        spo2: v.spo2 as string | undefined,
        weight: v.weight as string | undefined,
        height: v.height as string | undefined,
        bmi: v.bmi as string | undefined,
        respiratoryRate: v.respiratoryRate as string | undefined,
        notes: v.notes as string | undefined,
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
      const response = await apiClient.get<ApiResponse>(
        `/api/v1/patients/${encodeURIComponent(mrn)}/diagnoses`,
      );
      const data = response.data?.data || response.data || [];
      const list = (Array.isArray(data) ? data : []) as RawRecord[];
      return list.map((d: RawRecord) => {
        let status: DiagnosisRecord["status"] = "Active";
        const rawStatus = d.status as string;
        if (
          rawStatus === "Active" ||
          rawStatus === "Resolved" ||
          rawStatus === "Chronic"
        ) {
          status = rawStatus;
        }

        let severity: DiagnosisRecord["severity"] = "Moderate";
        const rawSeverity = d.severity as string;
        if (
          rawSeverity === "Mild" ||
          rawSeverity === "Moderate" ||
          rawSeverity === "Severe" ||
          rawSeverity === "Critical"
        ) {
          severity = rawSeverity;
        }

        return {
          id: (d.id || "") as string | number,
          date: (d.date || d.diagnosisDate || "") as string,
          doctorName: (d.doctorName || d.doctor || "") as string,
          diagnosisCode: d.diagnosisCode as string | undefined,
          diagnosisName: (d.diagnosisName ||
            d.name ||
            d.diagnosis ||
            "") as string,
          severity,
          notes: d.notes as string | undefined,
          status,
        };
      });
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
