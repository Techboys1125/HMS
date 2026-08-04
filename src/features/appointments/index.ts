export type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  QueueActionResponse,
  LinkedPatient,
  OnboardingStatusResponse,
  DoctorSummary,
  AppointmentStatusEnum,
  QueueStatusEnum,
  AppointmentTypeEnum,
  FamilyRelationshipEnum,
} from "./types/appointment.types";
export type {
  AppointmentStatus,
  VisitType,
  PriorityLevel,
  UserRole,
  TimelineActivity,
  AppointmentManagementCenterScreenProps,
  BookAppointmentScreenProps,
  PatientCheckInScreenProps,
  QueueManagementScreenProps,
  QueueManagementScreenProps as ReceptionQueueManagementScreenProps,
} from "./types/appointment-screen.types";
export { appointmentsApi } from "./api/appointments.api";
export { appointmentService } from "./services/appointment.service";
export * from "./hooks/useAppointments";
export * from "./hooks/useAppointment";
export * from "./hooks/useBookAppointment";
export * from "./hooks/useAppointmentSlots";
export * from "./permissions/appointment.permissions";
export {
  PP,
  RB,
  type ChipVariant,
  PATIENT_DATABASE,
  DOCTOR_DATABASE,
  DOCTOR_AVAILABILITY_DATA,
  INITIAL_APPOINTMENTS,
  EMPTY_AVAILABILITY,
  appointmentToPatientSummary,
} from "./constants/appointment.constants";
export {
  appointmentStore,
  useAppointmentStore,
} from "./store/appointment.store";

// Components
export { Chip } from "./components/Chip";
export { StatusBadge } from "./components/StatusBadge";
export { Avatar } from "./components/Avatar";
export { RescheduleAppointmentConfirmationDialog } from "./components/RescheduleAppointmentConfirmationDialog";
export { CancelAppointmentConfirmationDialog } from "./components/CancelAppointmentConfirmationDialog";
export { BookAppointmentDrawer } from "./components/BookAppointmentDrawer";
export { EditAppointmentDrawer } from "./components/EditAppointmentDrawer";
export { AppointmentDetailsDrawer } from "./components/AppointmentDetailsDrawer";
export { DockableQueueWorkspace } from "./components/DockableQueueWorkspace";

// Pages
export {
  AppointmentManagementCenterScreen,
  AppointmentCenterScreen,
} from "./pages/AppointmentManagementCenterScreen";
export { BookAppointmentScreen } from "./pages/BookAppointmentScreen";
export {
  QueueManagementScreen,
  QueueManagementScreen as ReceptionQueueManagementScreen,
} from "./pages/QueueManagementScreen";
export { PatientCheckInScreen } from "./pages/PatientCheckInScreen";

// Reception Feature Integration
export {
  ReceptionManagementCenterScreen,
  ReceptionCenterScreen,
} from "../reception";

// Legacy alias
export { AppointmentManagementCenterScreen as AppointmentManagementScreen } from "./pages/AppointmentManagementCenterScreen";
