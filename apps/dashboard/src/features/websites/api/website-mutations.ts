import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { UpdateWebsiteInput } from "@transora/shared";
import { websiteApi } from "./website-api";
import { websiteKeys } from "./website-queries";

export function useCreateWebsite() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: websiteApi.create,
    onSuccess: (website) => {
      queryClient.invalidateQueries({ queryKey: websiteKeys.all() });
      toast.success("Website created successfully");
      navigate({ to: "/websites/$id", params: { id: website.id } });
    },
    onError: () => {
      toast.error("Failed to create website");
    },
  });
}

export function useUpdateWebsite(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWebsiteInput) =>
      websiteApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: websiteKeys.all() });
      queryClient.invalidateQueries({ queryKey: websiteKeys.detail(id) });
      toast.success("Website updated");
    },
    onError: () => {
      toast.error("Failed to update website");
    },
  });
}

export function useDeleteWebsite() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: websiteApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: websiteKeys.all() });
      toast.success("Website deleted");
      navigate({ to: "/websites" });
    },
    onError: () => {
      toast.error("Failed to delete website");
    },
  });
}

export function useRegenerateKey(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => websiteApi.regenerateKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: websiteKeys.detail(id) });
      toast.success("API key regenerated");
    },
    onError: () => {
      toast.error("Failed to regenerate API key");
    },
  });
}
