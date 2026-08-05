// Pages
export * from "./pages/EditPatientScreen";
export * from "./pages/PatientAppointmentsScreen";
export * from "./pages/PatientMedicalRecordsScreen";
export * from "./pages/PatientPrescriptionsScreen";
export * from "./pages/PatientProfileCenterScreen";
export * from "./pages/PatientProfileScreen";
export * from "./pages/PatientSearchScreen";
export * from "./pages/RegisterPatientScreen";
export * from "./pages/FamilyMembersManagement";
export * from "./pages/PatientDoctorSearchScreen";
export * from "./pages/PatientQueueStatusScreen";
export * from "./pages/PatientNotificationsScreen";
export * from "./pages/PatientBillingScreen";

// Patient Module Pages
export { PatientListPage } from "./pages/PatientListPage";
export { PatientProfilePage } from "./pages/PatientProfilePage";
export { DoctorAssignedPatientsPage } from "./pages/DoctorAssignedPatientsPage";
export { NurseVitalsWorklistPage } from "./pages/NurseVitalsWorklistPage";
export { MyProfilePage as PatientMyProfilePage } from "./pages/MyProfilePage";
export { AccountantPatientBillingPage } from "./pages/AccountantPatientBillingPage";

// Route Wrappers
export { PatientListPageRoute } from "./routes/PatientListPageRoute";
export { PatientProfileRoute } from "./routes/PatientProfileRoute";
export { PatientMyProfileRoute } from "./routes/PatientMyProfileRoute";
export { DoctorAssignedPatientsRoute } from "./routes/DoctorAssignedPatientsRoute";

// Tab Components
export { PatientProfileTab } from "./components/tabs/ProfileTab";
export { FamilyMembersTab } from "./components/tabs/FamilyMembersTab";
export { PatientAppointmentsTab } from "./components/tabs/AppointmentsTab";
export { PatientQueueTab } from "./components/tabs/QueueTab";
export { PatientPrescriptionsTab } from "./components/tabs/PrescriptionsTab";
export { PatientBillingTab } from "./components/tabs/BillingTab";
export { PatientMedicalRecordsTab } from "./components/tabs/MedicalRecordsTab";
export { PatientReportsTab } from "./components/tabs/ReportsTab";

// Reusable Components
export { PatientProfileHeader } from "./components/PatientProfileHeader";
export { SwitchAccountDialog } from "./components/SwitchAccountDialog";
export { PatientStatusBadge } from "./components/PatientStatusBadge";
export { PatientSummaryCard } from "./components/PatientSummaryCard";
export { PatientActionMenu } from "./components/PatientActionMenu";
export { PatientSearchBar } from "./components/PatientSearchBar";
export { PatientTable } from "./components/PatientTable";
export { PatientFilters } from "./components/PatientFilters";
export { PatientInfoCard } from "./components/PatientInfoCard";
export { PatientEmergencyCard } from "./components/PatientEmergencyCard";
export { PatientInsuranceCard } from "./components/PatientInsuranceCard";

// Hooks
export {
  usePatients,
  usePatient,
  usePatientSearch,
  useRegisterPatient,
  useUpdatePatient,
  usePatientAudit,
} from "./hooks/usePatients";
export { useCreatePatient } from "./hooks/useCreatePatient";
export { usePatientProfile } from "./hooks/usePatientProfile";
export {
  useFamilyMembers,
  useAddFamilyMember,
  useDeleteFamilyMember,
} from "./hooks/useFamilyMembers";
export {
  usePatientAppointments,
  useUpcomingAppointments,
  useAppointmentHistory,
} from "./hooks/useAppointments";
export { usePrescriptions } from "./hooks/usePrescriptions";
export { usePatientBilling } from "./hooks/useBilling";
export { useMedicalRecords } from "./hooks/useMedicalRecords";
export { useSwitchAccount } from "./hooks/useSwitchAccount";
export { usePatientQueue } from "./hooks/usePatientQueue";

// Services
export { patientService } from "./services/patient.service";
export { familyService } from "./services/family.service";
export { appointmentService } from "./services/appointment.service";
export { medicalRecordService } from "./services/medicalRecord.service";
export { billingService } from "./services/billing.service";

// Utils
export { can, ROLE_LABELS } from "./utils/patientPermissions";
export type { Role, PatientAction } from "./utils/patientPermissions";

// API
export { patientsApi } from "./api/patient.api";

// Types
export type {
  Patient,
  CreatePatientRequest,
  PatientStatistics,
  PatientSearchResult,
  BloodGroup,
  MaritalStatus,
  PatientCategory,
  RegistrationType,
  Address,
  PatientFormMode,
  RoleFieldPermissions,
  SwitchAccountContext,
} from "./types/patient.types";
export type {
  FamilyMember,
  FamilyMemberRelationship,
  AddFamilyMemberRequest,
} from "./types/family.types";
export type {
  ConsultationRecord,
  VitalsRecord,
  DiagnosisRecord,
  MedicalHistoryEntry,
  PatientMedicalSummary,
} from "./types/medicalRecord.types";
