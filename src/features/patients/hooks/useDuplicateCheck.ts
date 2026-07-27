import { useMutation } from "@tanstack/react-query";
import { patientService } from "../services/patient.service";
import type { DuplicateCheckRequest } from "../types/patient.types";

export function useDuplicateCheck() {
  return useMutation({
    mutationFn: (payload: DuplicateCheckRequest) =>
      patientService.checkDuplicates(payload),
  });
}
