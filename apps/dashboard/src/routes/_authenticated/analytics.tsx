import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";
import { statsQueries } from "@/features/dashboard/api/stats-queries";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/analytics")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(websiteQueries.list()),
      context.queryClient.ensureQueryData(statsQueries.byWebsite()),
    ]);
  },
  component: AnalyticsPage,
});
