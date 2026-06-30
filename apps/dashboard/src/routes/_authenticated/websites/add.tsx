import { createFileRoute } from "@tanstack/react-router";
import { AddWebsitePage } from "@/features/websites/components/AddWebsitePage";

export const Route = createFileRoute("/_authenticated/websites/add")({
  component: AddWebsitePage,
});
