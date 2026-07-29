import { patientsApi } from "../api/patient.api";
import type {
  CreatePatientRequest,
  DuplicateCheckRequest,
  DuplicateOverrideRequest,
  MergePatientsRequest,
  Patient,
  PatientStatistics,
  UpdatePatientRequest,
} from "../types/patient.types";

export const patientService = {
  async getPatients(params?: {
    query?: string;
    page?: number;
    size?: number;
    status?: string;
  }): Promise<Patient[]> {
    return patientsApi.getAll(params);
  },

  async searchPatients(query: string): Promise<Patient[]> {
    return patientsApi.search(query);
  },

  async getPatient(mrn: string): Promise<Patient> {
    return patientsApi.getById(mrn);
  },

  async createPatient(
    payload: CreatePatientRequest,
  ): Promise<{ MRNId: string; message: string }> {
    return patientsApi.create(payload);
  },

  async createPatientWithOverride(
    payload: CreatePatientRequest,
    reason: string,
  ): Promise<Patient> {
    return patientsApi.createWithOverride(payload, reason);
  },

  async updatePatient(
    mrn: string,
    payload: UpdatePatientRequest,
    version: number,
  ): Promise<Patient> {
    return patientsApi.update(mrn, payload, version);
  },

  async checkDuplicates(payload: DuplicateCheckRequest): Promise<Patient[]> {
    return patientsApi.checkDuplicates(payload);
  },

  async overrideDuplicate(
    payload: DuplicateOverrideRequest & { mrn?: string },
  ): Promise<Patient> {
    return patientsApi.overrideDuplicate(payload);
  },

  async mergePatients(payload: MergePatientsRequest): Promise<Patient> {
    return patientsApi.merge(payload);
  },

  async getStatistics(): Promise<PatientStatistics> {
    return patientsApi.getStatistics();
  },
};
