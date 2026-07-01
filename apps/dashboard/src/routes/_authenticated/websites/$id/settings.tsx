import { createFileRoute } from "@tanstack/react-router";
import { WebsiteSettingsPage } from "@/features/websites/components/WebsiteSettingsPage";
import { queryClient } from "@/lib/query-client";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/$id/settings")({
  loader: ({ params }) => queryClient.ensureQueryData(websiteQueries.detail(params.id)),
  component: WebsiteSettingsRouteComponent,
});

function WebsiteSettingsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteSettingsPage id={id} />;
}
