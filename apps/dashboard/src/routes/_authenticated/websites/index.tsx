import { createFileRoute } from "@tanstack/react-router";
import { WebsitesPage } from "@/features/websites/components/WebsitesPage";
import { queryClient } from "@/lib/query-client";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/")({
  loader: () => queryClient.ensureQueryData(websiteQueries.list()),
  component: WebsitesPage,
});
