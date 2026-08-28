export type AppointmentStatus =
  | "Scheduled"
  | "Checked-In"
  | "Waiting"
  | "Waiting for Vitals"
  | "Waiting for Doctor"
  | "Called"
  | "In Progress"
  | "In Consultation"
  | "Completed"
  | "Cancelled"
  | "No Show"
  | "Booked"
  | string;

export type VisitType = "First Visit" | "Follow-up" | "Walk-In";

export type UserRole =
  | "Receptionist"
  | "Admin"
  | "Hospital Admin"
  | "Super Admin"
  | "Doctor"
  | "Nurse"
  | "Patient";

import type { AppointmentRecord } from "./appointment.types";

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
  onBookSuccess?: (
    appointment: AppointmentRecord,
    openDetailsDrawer?: boolean,
  ) => void;
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
