export { SettingsPage } from "./pages/SettingsPage";
export { HospitalInformationPage } from "./pages/HospitalInformationPage";
export { UserRolesPermissionsPage } from "./pages/UserRolesPermissionsPage";
export { AppointmentConfigurationPage } from "./pages/AppointmentConfigurationPage";
export { SecuritySettingsPage } from "./pages/SecuritySettingsPage";
export { BackupMaintenancePage } from "./pages/BackupMaintenancePage";
export type {
  HospitalConfiguration,
  HospitalInformationForm,
  PrintHeaderPreview,
  OpdBreak,
  OpdHoliday,
  OpdHolidayPayload,
  OpdWeeklySchedule,
  OpdWeeklyScheduleDay,
} from "./types/settings.types";
export { EMPTY_HOSPITAL_INFORMATION_FORM } from "./types/settings.types";
export { useHospitalConfiguration } from "./hooks/useHospitalConfiguration";
export { useOpdConfiguration } from "./hooks/useOpdConfiguration";
export {
  fetchHospitalConfiguration,
  createHospitalConfiguration,
  saveHospitalConfiguration,
  uploadHospitalLogo,
  uploadHospitalHeaderBanner,
  uploadFile,
  getUploadedFileUrl,
  fetchPrintHeaderPreview,
  resetHospitalConfiguration,
  updateOpdBreaks,
  fetchOpdHolidays,
  createOpdHoliday,
  updateOpdHoliday,
  updateOpdHolidayStatus,
  fetchOpdWeeklySchedule,
  saveOpdWeeklySchedule,
  mapConfigurationToForm,
  mapFormToConfiguration,
} from "./services/settings.service";
export {
  canAccessSettings,
  canManageSettings,
  getSettingsPermission,
} from "./permissions/settings.permissions";
