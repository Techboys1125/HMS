export interface ApiSpecialtyItem {
  id?: number | string;
  name?: string;
  code?: string;
  description?: string;
  active?: boolean;
  updatedAt?: string;
}

export interface ApiDepartmentSpecialtiesItem {
  departmentId?: number | string;
  departmentName?: string;
  departmentCode?: string;
  description?: string;
  active?: boolean;
  doctorCount?: number;
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
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: ApiDepartmentSpecialtiesItem[];
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DepartmentListParams {
  search?: string;
  activeOnly?: boolean;
  page?: number;
  size?: number;
}
