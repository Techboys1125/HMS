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

import type { AppointmentRecord } from "./appointment.types";

export interface AppointmentManagementCenterScreenProps {
  onPatientSelect?: (id: number | string) => void;
  onStartConsultation?: (
    apt?: AppointmentRecord | null | string | number,
  ) => void;
  onBookAppointmentClick?: () => void;
  onReceptionQueueClick?: () => void;
  userRole?: UserRole;
  onBack?: () => void;
  onConfirmSuccess?: (uhid: string | number) => void;
  onRegisterNewPatientClick?: () => void;
  onViewPatientProfileClick?: (uhid: string | number) => void;
  initialUhid?: string;
  initialAptId?: string;
  onCheckInSuccess?: (uhid: string | number) => void;
  onViewQueueClick?: (uhid?: string | number) => void;
  onCheckInClick?: (token?: string | number, uhid?: string | number) => void;
  onPatientSearchClick?: () => void;
  onRegisterPatientClick?: () => void;
}
type Role =
  | "super-admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "accountant"
  | "patient";

export interface BookAppointmentScreenProps {
  role?: Role;
  onBack?: () => void;
  onConfirmSuccess?: (appointmentId: string) => void;
  onRegisterNewPatientClick?: () => void;
  onViewPatientProfileClick?: (mrn: string) => void;

  onPatientSelect?: (mrn: string) => void;
  onBookSuccess?: (appointment: AppointmentRecord) => void;
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

export interface QueueManagementScreenProps {
  onBack?: () => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  onPatientSearchClick?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterPatientClick?: () => void;
  onBookAppointmentClick?: () => void;
}
