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
    return res?.success !== false;
  },
};
