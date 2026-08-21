/**
 * Medical Record Service
 * Uses REAL backend endpoints:
 *   - GET /api/v1/patients/{mrn}/prescriptions  → Prescription history
 *   - GET /api/v1/billing/patient/{mrn}          → Billing history
 *
 * Does NOT call non-existent endpoints like /api/v1/opd/consultations,
 * /api/v1/vitals, /api/v1/diagnoses, etc.
 */
import { apiClient } from "../../../lib/axios";
import type {
  PrescriptionSummary,
  PatientBillingHistory,
  BillingSummaryRecord,
  MedicalHistoryEntry,
  PatientMedicalSummary,
} from "../types/medicalRecord.types";

type RawRecord = Record<string, unknown>;

function extractList(data: unknown): RawRecord[] {
  if (Array.isArray(data)) return data as RawRecord[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as RawRecord[];
    if (Array.isArray(obj.data)) {
      const inner = obj.data;
      if (Array.isArray(inner)) return inner as RawRecord[];
      if (typeof inner === "object" && inner !== null) {
        const d = inner as Record<string, unknown>;
        if (Array.isArray(d.content)) return d.content as RawRecord[];
        if (Array.isArray(d.items)) return d.items as RawRecord[];
      }
    }
    if (Array.isArray(obj.items)) return obj.items as RawRecord[];
  }
  return [];
}

function mapPrescriptionSummary(r: RawRecord): PrescriptionSummary {
  const doctor = r.doctor as RawRecord | undefined;
  const dept = r.department as RawRecord | undefined;
  const diag = r.diagnosis as RawRecord | undefined;
  const meds = r.medications as RawRecord | undefined;
  const followUp = r.followUp as RawRecord | undefined;
  const billing = r.billing as RawRecord | undefined;
  const docs = r.documents as RawRecord | undefined;

  return {
    prescriptionId: String(r.prescriptionId || r.id || ""),
    appointmentId: r.appointmentId as string | undefined,
    encounterId: r.encounterId as string | undefined,
    visitDateTime: (r.visitDateTime || r.visitDate || r.createdAt) as string | undefined,
    doctor: doctor
      ? {
          doctorId: doctor.doctorId as string | undefined,
          doctorName: String(doctor.doctorName || doctor.fullName || doctor.name || ""),
          doctorSpecialization: doctor.doctorSpecialization as string | undefined,
        }
      : typeof r.doctorName === "string"
        ? { doctorName: r.doctorName }
        : undefined,
    department: dept
      ? {
          departmentId: dept.departmentId as string | undefined,
          departmentName: String(dept.departmentName || dept.name || ""),
        }
      : typeof r.departmentName === "string"
        ? { departmentName: r.departmentName }
        : undefined,
    diagnosis: diag
      ? {
          primaryDiagnosis: diag.primaryDiagnosis as string | undefined,
          icd10Code: diag.icd10Code as string | undefined,
        }
      : typeof r.diagnosis === "string"
        ? { primaryDiagnosis: r.diagnosis }
        : undefined,
    medications: meds
      ? {
          totalMedicines: meds.totalMedicines as number | undefined,
          highRiskMedicine: meds.highRiskMedicine as boolean | undefined,
          sampleMedicines: Array.isArray(meds.sampleMedicines)
            ? (meds.sampleMedicines as string[])
            : undefined,
          containsControlledMedicine: meds.containsControlledMedicine as boolean | undefined,
        }
      : undefined,
    prescriptionStatus: (r.prescriptionStatus || r.status) as string | undefined,
    followUp: followUp
      ? {
          required: followUp.required as boolean | undefined,
          followUpDate: followUp.followUpDate as string | undefined,
        }
      : undefined,
    billing: billing
      ? {
          invoiceNumber: billing.invoiceNumber as string | undefined,
          billingStatus: billing.billingStatus as string | undefined,
        }
      : undefined,
    documents: docs
      ? {
          prescriptionDocumentId: docs.prescriptionDocumentId as string | undefined,
          pdfAvailable: docs.pdfAvailable as boolean | undefined,
          digitalSignature: docs.digitalSignature as boolean | undefined,
          downloadable: docs.downloadable as boolean | undefined,
        }
      : undefined,
    createdAt: (r.createdAt || r.visitDateTime) as string | undefined,
  };
}

function mapBillRecord(r: RawRecord): BillingSummaryRecord {
  return {
    billId: (r.billId || r.id || 0) as number | string,
    billNumber: (r.billNumber || r.invoiceNumber) as string | undefined,
    date: (r.date || r.invoiceDate || r.createdAt) as string | undefined,
    doctor: (r.doctor || r.doctorName) as string | undefined,
    billStatus: (r.billStatus || r.status) as string | undefined,
    paymentStatus: (r.paymentStatus || r.paidStatus) as string | undefined,
    amount: typeof r.amount === "number" ? r.amount : (typeof r.totalAmount === "number" ? r.totalAmount : undefined),
  };
}

export const medicalRecordService = {
  /**
   * GET /api/v1/patients/{mrn}/prescriptions
   * Fetches the patient's prescription history from the confirmed backend endpoint
   */
  async getPrescriptionHistory(mrn: string): Promise<PrescriptionSummary[]> {
    try {
      const response = await apiClient.get<unknown>(
        `/api/v1/patients/${encodeURIComponent(mrn)}/prescriptions`,
      );
      const list = extractList(response.data);
      return list.map(mapPrescriptionSummary);
    } catch (err) {
      console.warn("[medicalRecordService] getPrescriptionHistory failed:", err);
      return [];
    }
  },

  /**
   * GET /api/v1/billing/patient/{mrn}
   * Fetches the patient's billing history from the confirmed backend endpoint
   */
  async getBillingHistory(mrn: string): Promise<PatientBillingHistory> {
    const emptyResult: PatientBillingHistory = { bills: [] };
    try {
      const response = await apiClient.get<unknown>(
        `/api/v1/billing/patient/${encodeURIComponent(mrn)}`,
      );
      const data = response.data as RawRecord | null;
      if (!data) return emptyResult;

      // The response may be wrapped in a { data: ... } envelope
      const inner = (data.data && typeof data.data === "object" ? data.data : data) as RawRecord;

      const summaryObj = inner.summary as RawRecord | undefined;
      const billsRaw = Array.isArray(inner.bills)
        ? (inner.bills as RawRecord[])
        : extractList(inner);

      return {
        mrn: (inner.mrn || mrn) as string,
        patientName: inner.patientName as string | undefined,
        summary: summaryObj
          ? {
              totalBills: summaryObj.totalBills as number | undefined,
              totalPaid: summaryObj.totalPaid as number | undefined,
              totalOutstanding: summaryObj.totalOutstanding as number | undefined,
            }
          : undefined,
        bills: billsRaw.map(mapBillRecord),
      };
    } catch (err) {
      console.warn("[medicalRecordService] getBillingHistory failed:", err);
      return emptyResult;
    }
  },

  /**
   * Aggregates prescription history + billing into a unified medical summary
   */
  async getMedicalSummary(mrn: string): Promise<PatientMedicalSummary> {
    const [prescriptions, billing] = await Promise.all([
      medicalRecordService.getPrescriptionHistory(mrn),
      medicalRecordService.getBillingHistory(mrn),
    ]);

    // Build timeline from prescriptions + billing
    const timeline: MedicalHistoryEntry[] = [
      ...prescriptions.map((rx) => ({
        id: rx.prescriptionId,
        type: "prescription" as const,
        date: rx.visitDateTime || rx.createdAt || "",
        title: `Prescription – ${rx.prescriptionId}`,
        description: [
          rx.diagnosis?.primaryDiagnosis,
          rx.diagnosis?.icd10Code && `(${rx.diagnosis.icd10Code})`,
          rx.medications?.totalMedicines && `${rx.medications.totalMedicines} medication(s)`,
        ]
          .filter(Boolean)
          .join(" · ") || "Prescription issued",
        doctorName: rx.doctor?.doctorName,
        department: rx.department?.departmentName,
        status: rx.prescriptionStatus || "FINALIZED",
      })),
      ...billing.bills.map((bill) => ({
        id: bill.billId,
        type: "billing" as const,
        date: bill.date || "",
        title: `Invoice – ${bill.billNumber || bill.billId}`,
        description: [
          bill.amount != null && `₹${bill.amount.toLocaleString()}`,
          bill.paymentStatus,
        ]
          .filter(Boolean)
          .join(" · ") || "Bill generated",
        doctorName: bill.doctor,
        status: bill.paymentStatus || bill.billStatus || "PENDING",
      })),
    ].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return {
      prescriptions,
      billing,
      timeline,
      totalVisits: prescriptions.length,
      lastVisitDate: prescriptions[0]?.visitDateTime || prescriptions[0]?.createdAt,
    };
  },
};
