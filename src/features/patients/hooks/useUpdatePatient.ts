import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "./usePatients";
import { patientService } from "../services/patient.service";
import type { UpdatePatientRequest } from "../types/patient.types";

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      idOrMrn: string | number;
      payload: Record<string, unknown>;
    }) => patientService.updatePatient(args.idOrMrn, args.payload),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      if (patient?.mrn) {
        queryClient.setQueryData(["patients", "detail", patient.mrn], patient);
      }
    },
  });
}
