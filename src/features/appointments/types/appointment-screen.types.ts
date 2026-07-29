import type { AppointmentRecord } from "./appointment.types";

export type AppointmentStatus =
  | "Scheduled"
  | "Checked-In"
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type VisitType = "First Visit" | "Follow-up" | "Walk-In";

export type PriorityLevel = "Normal" | "Urgent" | "High" | string;

export type UserRole =
  | "Receptionist"
  | "Admin"
  | "Hospital Admin"
  | "Super Admin"
  | "Doctor"
  | "Nurse";

export interface TimelineActivity {
  id: string;
  title: string;
  timestamp: string;
  performedBy: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppointmentManagementCenterScreenProps {
  onPatientSelect?: (id: number | string) => void;
  onStartConsultation?: (apt?: any) => void;
  onBookAppointmentClick?: () => void;
  onReceptionQueueClick?: () => void;
  userRole?: UserRole;
  onBack?: () => void;
  onConfirmSuccess?: (uhid: any) => void;
  onRegisterNewPatientClick?: () => void;
  onViewPatientProfileClick?: (uhid: any) => void;
  initialUhid?: string;
  initialAptId?: string;
  onCheckInSuccess?: (uhid: any) => void;
  onViewQueueClick?: (uhid?: any) => void;
  onCheckInClick?: (token?: any, uhid?: any) => void;
  onPatientSearchClick?: () => void;
  onRegisterPatientClick?: () => void;
}

export interface ReceptionBookAppointmentScreenProps {
  onBack?: () => void;
  onConfirmSuccess?: (appointmentId: string) => void;
  onRegisterNewPatientClick?: () => void;
  onViewPatientProfileClick?: (mrn: string) => void;
  initialMrn?: string;
}

export interface PatientCheckInScreenProps {
  onBack?: () => void;
  onCheckInSuccess?: (tokenNo: string) => void;
  onViewQueueClick?: () => void;
  onViewPatientProfileClick?: (mrn: string) => void;
  initialMrn?: string;
  initialAptId?: string;
}

export interface ReceptionQueueManagementScreenProps {
  onBack?: () => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  onPatientSearchClick?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterPatientClick?: () => void;
  onBookAppointmentClick?: () => void;
}
