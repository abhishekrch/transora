import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(websiteQueries.list()),
  component: DashboardPage,
});
