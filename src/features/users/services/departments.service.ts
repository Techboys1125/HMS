import { departmentsApi } from "../api/departments.api";
import type {
  ApiDepartmentSpecialtiesItem,
  ApiDepartmentLookupItem,
  ApiSpecialty,
  DepartmentSpecialtiesPageResponse,
  DepartmentListParams,
} from "../types/departments.types";

export const departmentsService = {
  async getDepartments(
    params?: DepartmentListParams,
  ): Promise<DepartmentSpecialtiesPageResponse> {
    return departmentsApi.getDepartments(params);
  },

  async getDepartmentLookup(
    activeOnly = true,
  ): Promise<ApiDepartmentLookupItem[]> {
    return departmentsApi.getDepartmentLookup(activeOnly);
  },

  async getDepartmentDetails(
    departmentId: number | string,
  ): Promise<ApiDepartmentSpecialtiesItem | null> {
    return departmentsApi.getDepartmentDetails(departmentId);
  },

  async createDepartment(
    payload: Partial<ApiDepartmentSpecialtiesItem>,
  ): Promise<ApiDepartmentSpecialtiesItem> {
    return departmentsApi.createDepartment(payload);
  },

  async updateDepartment(
    departmentId: number | string,
    payload: Partial<ApiDepartmentSpecialtiesItem>,
  ): Promise<ApiDepartmentSpecialtiesItem> {
    return departmentsApi.updateDepartment(departmentId, payload);
  },

  async deleteDepartment(
    departmentId: number | string,
  ): Promise<{ success: boolean; message?: string }> {
    return departmentsApi.deleteDepartment(departmentId);
  },

  async getSpecialties(): Promise<ApiSpecialty[]> {
    return departmentsApi.getSpecialties();
  },

  async createSpecialty(payload: Partial<ApiSpecialty>): Promise<ApiSpecialty> {
    return departmentsApi.createSpecialty(payload);
  },
};
