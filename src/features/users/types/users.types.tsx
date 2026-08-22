export interface BackendAvailabilityItem {
  id?: number | string;
  _id?: string;
  key?: string;
  value?: string | number | boolean;
  code?: string;
  name?: string;
  title?: string;
  label?: string;
  availabilityId?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface AdminCreateStaffData {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  gender?: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  medicalRegistrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  doctorCode?: string;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  consultationFee?: number;
  followUpFee?: number;
  slotDurationMinutes?: number;
  availability?: BackendAvailabilityItem[] | DoctorAvailability[];
  scheduleExceptions?: ScheduleException[];
  sendCredentials?: boolean;
  departmentId?: number;
  designation?: string;
}

export interface AdminCreateStaffResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    employeeId?: string;
    fullName: string;
    email: string;
    mobile?: string;
    role: string;
    doctorId?: number;
    status?: string;
    mustChangePassword?: boolean;
    credentialsSent?: boolean;
  };
}

export interface AdminUpdateStaffData {
  fullName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  medicalRegistrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  primaryDepartmentId?: number;
  secondaryDepartmentIds?: number[];
  primarySpecialtyId?: number;
  secondarySpecialtyIds?: number[];
  consultationFee?: number;
  followUpFee?: number;
  slotDurationMinutes?: number;
  availability?: BackendAvailabilityItem[];
  scheduleExceptions?: ScheduleException[];
  version?: number;
  changeReason?: string;
  departmentId?: number;
  status?: string;
}

export interface DepartmentInfo {
  departmentId: number;
  departmentName: string;
}

export interface SpecialtyInfo {
  specialtyId: number;
  specialtyName: string;
}

export interface DoctorProfileDetail {
  doctorId: number;
  medicalRegistrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  primaryDepartment?: DepartmentInfo;
  secondaryDepartments?: DepartmentInfo[];
  primarySpecialty?: SpecialtyInfo;
  secondarySpecialties?: SpecialtyInfo[];
  consultationFee?: number;
  followUpFee?: number;
  slotDurationMinutes?: number;
  availability?: BackendAvailabilityItem[];
  scheduleExceptions?: ScheduleException[];
}

export interface UserDetailData {
  lastSuccessfulLogin: string | null;
  userId: number;
  employeeId?: string;
  fullName: string;
  email: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  photo?: string;
  photoUrl?: string;
  residentialAddress?: string;
  professionalBio?: string;
  role: string;
  status: string;
  doctorProfile?: DoctorProfileDetail | null;
}

export interface SlotRequest {
  startTime: string;
  endTime: string;
}

export interface DoctorAvailability {
  endTime: string;
  startTime: string;
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
  doctorProfile?: DoctorProfile;
}

export interface OpdWorkingInterval {
  startTime: string;
  endTime: string;
}

export interface OpdWeeklyScheduleDay {
  dayOfWeek: string;
  workingIntervals: OpdWorkingInterval[];
  breaks: { startTime: string; endTime: string; label?: string }[];
  isOpen: boolean;
}

export interface OpdWeeklySchedule {
  weeklySchedule: OpdWeeklyScheduleDay[];
}
