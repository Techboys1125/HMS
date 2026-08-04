/**
 * useFamilyMembers – React Query hooks for family member CRUD
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { familyService } from "../services/family.service";
import type { AddFamilyMemberRequest } from "../types/family.types";
import { patientKeys } from "./usePatients";

export const familyKeys = {
  all: ["familyMembers"] as const,
  list: (mrn: string) => [...familyKeys.all, "list", mrn] as const,
};

export function useFamilyMembers(mrn: string) {
  return useQuery({
    queryKey: familyKeys.list(mrn),
    queryFn: () => familyService.getFamilyMembers(mrn),
    enabled: !!mrn,
  });
}

export function useAddFamilyMember(mrn: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddFamilyMemberRequest) =>
      familyService.addFamilyMember(mrn, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.list(mrn) });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useUpdateFamilyMember(mrn: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: Partial<AddFamilyMemberRequest>;
    }) => familyService.updateFamilyMember(mrn, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.list(mrn) });
    },
  });
}

export function useDeleteFamilyMember(mrn: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      familyService.deleteFamilyMember(mrn, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.list(mrn) });
    },
  });
}
