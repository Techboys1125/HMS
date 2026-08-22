export interface PatientCheckInScreenProps {
  onBack?: () => void;
  onConfirmSuccess?: (tokenNumber: string) => void;
  onPatientSearchClick?: () => void;
  initialTokenOrMrn?: string;
}
