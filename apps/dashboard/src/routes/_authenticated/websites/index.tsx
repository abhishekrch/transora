import { createFileRoute } from "@tanstack/react-router";
import { WebsitesPage } from "@/features/websites/components/WebsitesPage";

export const Route = createFileRoute("/_authenticated/websites/")({
  component: WebsitesPage,
});
