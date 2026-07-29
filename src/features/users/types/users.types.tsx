// Admin user management types

export interface AdminCreateStaffData {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  departmentId: number;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
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

export interface ScheduleException {
  exceptionDate: string;
  reason: string;
}

export interface DoctorProfile {
  registrationNumber?: string;
  medicalRegistrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  doctorCode?: string;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  consultationFee: number;
  followUpFee?: number;
  slotDurationMinutes: number;
  consultationTypes?: string[];
  availability: DoctorAvailability[];
  residentialAddress?: string;
  professionalBio?: string;
  photoUrl?: string;
  scheduleExceptions?: ScheduleException[];
}

export interface AdminCreateDoctorStaffData extends AdminCreateStaffData {
  doctorProfile: DoctorProfile;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  qualification?: string;
  yearsOfExperience?: number;
  doctorCode?: string;
  medicalRegistrationNumber?: string;
  consultationFee?: number;
  followUpFee?: number;
  slotDurationMinutes?: number;
  scheduleExceptions?: ScheduleException[];
  sendCredentials?: boolean;
}
