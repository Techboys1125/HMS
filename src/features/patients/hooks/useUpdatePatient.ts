import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "./usePatients";
import { patientService } from "../services/patient.service";
import type { UpdatePatientRequest } from "../types/patient.types";

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      mrn: string;
      payload: UpdatePatientRequest;
      version: number;
    }) => patientService.updatePatient(args.mrn, args.payload, args.version),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.setQueryData(["patients", "detail", patient.mrn], patient);
    },
  });
}
