import { createFileRoute } from "@tanstack/react-router";
import { WebsitesPage } from "@/features/websites/components/WebsitesPage";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(websiteQueries.list()),
  component: WebsitesPage,
});
