import { useParams } from "react-router";
import { DoctorAssignedPatientsPage } from "../pages/DoctorAssignedPatientsPage";

export function DoctorAssignedPatientsRoute() {
  const { doctorId } = useParams<{ doctorId: string }>();
  if (!doctorId) return null;
  return <DoctorAssignedPatientsPage doctorId={doctorId} />;
}