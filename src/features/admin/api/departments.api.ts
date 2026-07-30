import { apiClient, axios } from "../../../lib/axios";

export interface ApiSpecialtyItem {
  id?: number | string;
  name?: string;
  code?: string;
  description?: string;
  active?: boolean;
}

export interface ApiDepartmentSpecialtiesItem {
  departmentId?: number | string;
  departmentName?: string;
  departmentCode?: string;
  description?: string;
  active?: boolean;
  specialties?: ApiSpecialtyItem[];
  // Legacy / fallback field compatibility
  id?: number | string;
  name?: string;
  code?: string;
  status?: string;
  headOfDepartment?: string;
  head?: string;
  doctorsCount?: number;
  consultationRooms?: number;
  workingHours?: string;
  createdDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ApiDepartment = ApiDepartmentSpecialtiesItem;

export interface ApiDepartmentLookupItem {
  departmentId: number | string;
  departmentName: string;
  active: boolean;
  specialties: Array<{
    id: number | string;
    name: string;
    active: boolean;
  }>;
}

export interface ApiSpecialty {
  id?: number | string;
  code?: string;
  specialtyName?: string;
  name?: string;
  departmentId?: number | string;
  departmentName?: string;
  description?: string;
  status?: string;
  active?: boolean;
}

export interface DepartmentSpecialtiesPageResponse {
  totalElements?: number;
  totalPages?: number;
  size?: number;
  content?: ApiDepartmentSpecialtiesItem[];
}

const unwrapList = <T>(resData: any): T[] => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.data?.content)) return resData.data.content;
  if (Array.isArray(resData.content)) return resData.content;
  return [];
};

const sanitizeCode = (code?: string, fallbackPrefix = "CODE"): string => {
  if (!code || !code.trim()) {
    return `${fallbackPrefix}_${Date.now().toString(36).toUpperCase()}`;
  }
  return code.replace(/[^a-zA-Z0-9_]/g, "_").toUpperCase();
};

export const departmentsApi = {
  /**
   * GET /api/v1/admin/department-specialties
   * List Departments and Specialties
   */
  async getDepartments(params?: {
    search?: string;
    activeOnly?: boolean;
    page?: number;
    size?: number;
  }): Promise<ApiDepartmentSpecialtiesItem[]> {
    try {
      let res;
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.activeOnly !== undefined) queryParams.append("activeOnly", String(params.activeOnly));
      if (params?.page !== undefined) queryParams.append("page", String(params.page));
      if (params?.size !== undefined) queryParams.append("size", String(params.size));
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      try {
        res = await apiClient.get<any>(`/api/v1/admin/department-specialties${queryString}`);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          try {
            res = await apiClient.get<any>(`/api/v1/admin/departments${queryString}`);
          } catch {
            res = await apiClient.get<any>(`/api/v1/departments${queryString}`);
          }
        } else {
          throw err;
        }
      }
      const rawList = unwrapList<ApiDepartmentSpecialtiesItem>(res.data);
      return rawList.map((item: any) => ({
        ...item,
        id: item.id ?? item.departmentId,
        departmentId: item.departmentId ?? item.id,
        departmentName: item.departmentName ?? item.name ?? "",
        name: item.name ?? item.departmentName ?? "",
        departmentCode: item.departmentCode ?? item.code ?? "",
        code: item.code ?? item.departmentCode ?? "",
        specialties: (item.specialties || []).map((s: any) => ({
          ...s,
          id: s.id,
        })),
      }));
    } catch (error) {
      console.warn("[departmentsApi] Failed to fetch department specialties:", error);
      return [];
    }
  },

  /**
   * GET /api/v1/admin/department-specialties/lookup
   * Get Department and Specialties Lookup List
   */
  async getDepartmentLookup(activeOnly = true): Promise<ApiDepartmentLookupItem[]> {
    try {
      let res;
      try {
        res = await apiClient.get<any>(`/api/v1/admin/department-specialties/lookup?activeOnly=${activeOnly}`);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.get<any>(`/api/v1/departments`);
        } else {
          throw err;
        }
      }
      const rawList = unwrapList<ApiDepartmentLookupItem>(res.data);
      return rawList.map((item: any) => ({
        ...item,
        id: item.id ?? item.departmentId,
        departmentId: item.departmentId ?? item.id,
        departmentName: item.departmentName ?? item.name ?? "",
        active: item.active !== undefined ? item.active : true,
        specialties: (item.specialties || []).map((s: any) => ({
          ...s,
          id: s.id,
          name: s.name || s.specialtyName || "",
          active: s.active !== undefined ? s.active : true,
        })),
      }));
    } catch (error) {
      console.warn("[departmentsApi] Failed to fetch department lookup:", error);
      return [];
    }
  },

  /**
   * GET /api/v1/admin/department-specialties/{departmentId}
   * Get Department Details
   */
  async getDepartmentDetails(departmentId: number | string): Promise<ApiDepartmentSpecialtiesItem | null> {
    try {
      let res;
      try {
        res = await apiClient.get<any>(`/api/v1/admin/department-specialties/${departmentId}`);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.get<any>(`/api/v1/admin/departments/${departmentId}`);
        } else {
          throw err;
        }
      }
      return res.data?.data ?? res.data ?? null;
    } catch (error) {
      console.warn(`[departmentsApi] Failed to fetch department details for ${departmentId}:`, error);
      return null;
    }
  },

  /**
   * POST /api/v1/admin/department-specialties
   * Create Department and Specialties
   */
  async createDepartment(payload: Partial<ApiDepartmentSpecialtiesItem>): Promise<ApiDepartmentSpecialtiesItem> {
    try {
      let res;
      const deptName = payload.departmentName || payload.name || "DEPARTMENT";
      const formattedPayload = {
        departmentName: deptName,
        departmentCode: sanitizeCode(payload.departmentCode || payload.code || deptName, "DEP"),
        description: payload.description,
        active: payload.active !== undefined ? payload.active : true,
        specialties: (payload.specialties || []).map((s, idx) => ({
          ...s,
          code: sanitizeCode(s.code || `${deptName}_${s.name || idx + 1}`, "SPEC"),
        })),
        headOfDepartment: payload.headOfDepartment || payload.head,
      };

      try {
        res = await apiClient.post<any>("/api/v1/admin/department-specialties", formattedPayload);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          try {
            res = await apiClient.post<any>("/api/v1/admin/departments", formattedPayload);
          } catch {
            res = await apiClient.post<any>("/api/v1/departments", formattedPayload);
          }
        } else {
          throw err;
        }
      }
      return res.data?.data ?? res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message);
        }
      }
      throw error;
    }
  },

  /**
   * PUT /api/v1/admin/department-specialties/{departmentId}
   * Update Department and Specialties
   */
  async updateDepartment(departmentId: number | string, payload: Partial<ApiDepartmentSpecialtiesItem>): Promise<ApiDepartmentSpecialtiesItem> {
    try {
      let res;
      const deptName = payload.departmentName || payload.name || "DEPARTMENT";
      const formattedPayload = {
        departmentName: deptName,
        departmentCode: sanitizeCode(payload.departmentCode || payload.code || deptName, "DEP"),
        description: payload.description,
        active: payload.active !== undefined ? payload.active : true,
        specialties: (payload.specialties || []).map((s, idx) => ({
          ...s,
          code: sanitizeCode(s.code || `${deptName}_${s.name || idx + 1}`, "SPEC"),
        })),
        headOfDepartment: payload.headOfDepartment || payload.head,
      };

      try {
        res = await apiClient.put<any>(`/api/v1/admin/department-specialties/${departmentId}`, formattedPayload);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          try {
            res = await apiClient.put<any>(`/api/v1/admin/departments/${departmentId}`, formattedPayload);
          } catch {
            res = await apiClient.put<any>(`/api/v1/departments/${departmentId}`, formattedPayload);
          }
        } else {
          throw err;
        }
      }
      return res.data?.data ?? res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message);
        }
      }
      throw error;
    }
  },

  /**
   * DELETE /api/v1/admin/department-specialties/{departmentId}
   * Delete Department
   */
  async deleteDepartment(departmentId: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      let res;
      try {
        res = await apiClient.delete<any>(`/api/v1/admin/department-specialties/${departmentId}`);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.delete<any>(`/api/v1/admin/departments/${departmentId}`);
        } else {
          throw err;
        }
      }
      return res.data ?? { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message);
        }
      }
      throw error;
    }
  },

  async getSpecialties(): Promise<ApiSpecialty[]> {
    try {
      let res;
      try {
        res = await apiClient.get<any>("/api/v1/admin/specialties");
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.get<any>("/api/v1/specialties");
        } else {
          throw err;
        }
      }
      return unwrapList<ApiSpecialty>(res.data);
    } catch (error) {
      console.warn("[departmentsApi] Failed to fetch specialties:", error);
      return [];
    }
  },

  async createSpecialty(payload: Partial<ApiSpecialty>): Promise<ApiSpecialty> {
    try {
      let res;
      try {
        res = await apiClient.post<any>("/api/v1/admin/specialties", payload);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
          res = await apiClient.post<any>("/api/v1/specialties", payload);
        } else {
          throw err;
        }
      }
      return res.data?.data ?? res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message);
        }
      }
      throw error;
    }
  },
};
