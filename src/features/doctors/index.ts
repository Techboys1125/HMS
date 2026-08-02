export type {
  DoctorRecord, DoctorAvailability, DoctorStatus, RxStatus,
  DoctorAppointment, DoctorPatient, WeeklySchedule, DoctorTimeline,
  PrescriptionRecord, EditableMedicine, VitalSign, Medication, MedicineDetail,
  DoctorApiResponse, PaginatedResponse,
} from "./types/doctors.types";

export {
  PP,
  RB,
  FREQUENCY_OPTIONS,
  ROUTE_OPTIONS,
  COMMON_MEDICINES,
} from "./constants/doctors.constants";

export {
  INITIAL_DOCTORS,
  MOCK_DOCTOR_APPOINTMENTS,
  MOCK_DOCTOR_PATIENTS,
  MOCK_WEEKLY_SCHEDULE,
  MOCK_DOCTOR_TIMELINE,
  DEPARTMENTS,
  SPECIALTIES,
  VITALS_DATA,
  MEDICATIONS,
  WEEKLY_CONSULTATIONS,
  TIMELINE,
  MY_PRESCRIPTIONS_DATA,
} from "./constants/doctors.constants";

export { useDoctors, useDoctorFilters, useToast } from "./hooks";
export { Avatar, Card, SectionHeader, StatusBadge } from "./components";
export { DeactivateDoctorDialog, AddDoctorDrawer, EditDoctorDrawer, KpiCards, DoctorFilterBar, DoctorTable, QuickDetailsDrawer, ScheduleModal, AppointmentDetailModal, DoctorProfileScreen } from "./components";
export { DoctorAppointmentsScreen, DoctorConsultationScreen, DoctorPrescriptionsScreen, DoctorPrescriptionDetailsScreen, DoctorEditPrescriptionScreen, DoctorPrescriptionPrintPreviewScreen, DoctorPrescriptionHistoryScreen, DoctorReportsScreen } from "./components";
export { DoctorManagementCenterScreen } from "./pages/DoctorManagementCenterScreen";
