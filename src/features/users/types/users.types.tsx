// Admin user management types

export interface AdminCreateStaffData {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  departmentId: number;
  designation: string;
}

export interface AdminCreateStaffResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    employeeId: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    mustChangePassword: boolean;
  };
}

export interface AdminUpdateStaffData {
  fullName?: string;
  email?: string;
  mobile?: string;
  departmentId?: number;
  status?: string;
}

export interface SlotRequest {
  startTime: string;
  endTime: string;
}

export interface DoctorAvailability {
  day: string;
  available: boolean;
  slots: SlotRequest[];
}

export interface DoctorProfile {
  registrationNumber: string;
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  consultationFee: number;
  followUpFee?: number;
  slotDurationMinutes: number;
  consultationTypes: string[];
  availability: DoctorAvailability[];
}

export interface AdminCreateDoctorStaffData extends AdminCreateStaffData {
  doctorProfile: DoctorProfile;
}
