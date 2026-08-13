import { appointmentsApi } from "../../appointments/api/appointments.api";
import { vitalsApi } from "../api/vitals.api";
import type {
  NurseVitalsPayload,
  NurseWaitingPatient,
  RecordedVitalsData,
} from "../types/vitals.types";

export const vitalsService = {
  async getWaitingPatients(): Promise<NurseWaitingPatient[]> {
    return vitalsApi.getWaitingPatients();
  },

  async getVitals(
    appointmentId: string | number,
  ): Promise<RecordedVitalsData | null> {
    try {
      const res = await vitalsApi.getVitals(appointmentId);
      if (!res?.success || !res.data) return null;
      const d = res.data;

      // Map backend response fields to RecordedVitalsData UI model
      const recordedByName = d.recordedBy?.name || "";
      const recordedAtStr = d.recordedAt
        ? new Date(d.recordedAt).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "";

      // Parse blood pressure - handle both string and separate fields
      let systolic = "";
      let diastolic = "";
      if (d.bloodPressure && typeof d.bloodPressure === "string" && d.bloodPressure.includes("/")) {
        const parts = d.bloodPressure.split("/");
        systolic = parts[0]?.trim() || "";
        diastolic = parts[1]?.trim() || "";
      } else {
        systolic = d.bloodPressureSystolic != null ? String(d.bloodPressureSystolic) : "";
        diastolic = d.bloodPressureDiastolic != null ? String(d.bloodPressureDiastolic) : "";
      }

      // Handle pulse/heartRate - backend may use either field name
      const pulseVal = d.pulse ?? d.heartRate;
      // Handle spo2/oxygenSaturation - backend may use either field name
      const spo2Val = d.spo2 ?? d.oxygenSaturation;
      // Handle resp/respiratoryRate
      const respVal = d.respRate ?? d.respiratoryRate;
      // Handle sugar/bloodSugar
      const sugarVal = d.sugar ?? d.bloodSugar;

      return {
        height: d.height != null ? String(d.height) : "",
        weight: d.weight != null ? String(d.weight) : "",
        bmi:
          d.height && d.weight
            ? ((d.weight as number) / ((d.height as number) / 100) ** 2).toFixed(1)
            : "",
        temp: d.temperature != null ? String(d.temperature) : "",
        systolic,
        diastolic,
        pulse: pulseVal != null ? String(pulseVal) : "",
        resp: respVal != null ? String(respVal) : "",
        spo2: spo2Val != null ? String(spo2Val) : "",
        sugar: sugarVal != null ? String(sugarVal) : "",
        appearance: "Normal / Healthy",
        consciousness: "Alert & Oriented",
        observation: d.notes || "Vitals recorded by nurse.",
        recordedBy: recordedByName,
        recordedAt: recordedAtStr,
      };
    } catch {
      return null;
    }
  },

  async submitVitals(
    appointmentId: string | number,
    formData:
      | NurseVitalsPayload
      | (RecordedVitalsData & {
          chiefComplaint?: string;
          symptoms?: string;
          diagnosis?: string;
          clinicalNotes?: string;
          notes?: string;
        }),
  ): Promise<boolean> {
    let payload: NurseVitalsPayload;

    if (
      "bloodPressure" in formData &&
      typeof (formData as NurseVitalsPayload).temperature === "number"
    ) {
      payload = formData as NurseVitalsPayload;
    } else {
      interface RelaxedVitalsData {
        chiefComplaint?: string;
        notes?: string;
        symptoms?: string;
        diagnosis?: string;
        clinicalNotes?: string;
        observation?: string;
        temperature?: number | string;
        temp?: number | string;
        weight?: number | string;
        height?: number | string;
        bloodPressure?: string;
        systolic?: string;
        bpSystolic?: string;
        diastolic?: string;
        bpDiastolic?: string;
        pulse?: number | string;
        pulseRate?: number | string;
        spo2?: number | string;
      }
      const f = formData as RelaxedVitalsData;
      payload = {
        chiefComplaint:
          f.chiefComplaint ||
          f.notes ||
          "Pre-consultation routine vitals check",
        symptoms: f.symptoms || "None reported",
        diagnosis: f.diagnosis || "Under evaluation",
        clinicalNotes:
          f.clinicalNotes ||
          f.notes ||
          f.observation ||
          "Vitals recorded by Nurse",
        temperature:
          typeof f.temperature === "number"
            ? f.temperature
            : parseFloat(String(f.temp || f.temperature || "98.6")) || 98.6,
        weight:
          typeof f.weight === "number"
            ? f.weight
            : parseFloat(String(f.weight || "70")) || 70,
        height:
          typeof f.height === "number"
            ? f.height
            : parseFloat(String(f.height || "170")) || 170,
        bloodPressure:
          f.bloodPressure ||
          `${f.systolic || f.bpSystolic || "120"}/${f.diastolic || f.bpDiastolic || "80"}`,
        pulse:
          typeof f.pulse === "number"
            ? f.pulse
            : parseInt(String(f.pulse || f.pulseRate || "72"), 10) || 72,
        spo2:
          typeof f.spo2 === "number"
            ? f.spo2
            : parseInt(String(f.spo2 || "98"), 10) || 98,
      };
    }

    const res = await vitalsApi.recordVitals(appointmentId, payload);
    if (res?.success !== false) {
      try {
        await appointmentsApi.updateAppointmentStatus(
          appointmentId,
          "WAITING_FOR_DOCTOR_CALL",
        );
      } catch {
        // Status updated by backend or fallback
      }
      return true;
    }
    return false;
  },
};
