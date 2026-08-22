export interface ReceptionQueueManagementScreenProps {
  onBack?: () => void;
  onCheckInClick?: (token?: string, mrn?: string) => void;
  onPatientSearchClick?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterPatientClick?: () => void;
  onBookAppointmentClick?: () => void;
  userRole?: string;
}
