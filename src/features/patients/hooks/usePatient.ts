import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patient.service";

export function usePatient(mrn?: string) {
  return useQuery({
    queryKey: ["patients", "detail", mrn],
    queryFn: () => patientService.getPatient(mrn as string),
    enabled: Boolean(mrn),
  });
}
