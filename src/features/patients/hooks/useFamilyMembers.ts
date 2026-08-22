/**
 * useFamilyMembers – React Query hooks for family member CRUD
 */
import { useQuery } from "@tanstack/react-query";
import { familyService } from "../services/family.service";

export const familyKeys = {
  all: ["familyMembers"] as const,
  list: (mrn: string) => [...familyKeys.all, "list", mrn] as const,
};

export function useFamilyMembers(mrn: string, enabled = true) {
  return useQuery({
    queryKey: familyKeys.list(mrn),
    queryFn: () => familyService.getFamilyMembers(mrn),
    enabled: Boolean(mrn && enabled),
  });
}
