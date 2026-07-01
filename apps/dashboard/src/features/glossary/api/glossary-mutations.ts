import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { glossaryApi } from "./glossary-api";
import { glossaryKeys } from "./glossary-queries";
import type { CreateGlossaryInput, UpdateGlossaryInput } from "@transora/shared";

export function useCreateGlossaryEntry(websiteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGlossaryInput) => glossaryApi.create(websiteId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.all(websiteId) });
      toast.success("Glossary entry added");
    },
    onError: () => {
      toast.error("Failed to add glossary entry");
    },
  });
}

export function useUpdateGlossaryEntry(websiteId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateGlossaryInput) => glossaryApi.update(websiteId, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.all(websiteId) });
      toast.success("Glossary entry updated");
    },
    onError: () => {
      toast.error("Failed to update glossary entry");
    },
  });
}

export function useDeleteGlossaryEntry(websiteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => glossaryApi.delete(websiteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.all(websiteId) });
      toast.success("Glossary entry deleted");
    },
    onError: () => {
      toast.error("Failed to delete glossary entry");
    },
  });
}
