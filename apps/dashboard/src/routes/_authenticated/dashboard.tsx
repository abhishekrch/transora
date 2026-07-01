import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { queryClient } from "@/lib/query-client";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: () => queryClient.ensureQueryData(websiteQueries.list()),
  component: DashboardPage,
});
