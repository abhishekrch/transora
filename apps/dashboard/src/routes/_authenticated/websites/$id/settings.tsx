import { createFileRoute } from "@tanstack/react-router";
import { WebsiteSettingsPage } from "@/features/websites/components/WebsiteSettingsPage";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/$id/settings")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(websiteQueries.detail(params.id)),
  component: WebsiteSettingsRouteComponent,
});

function WebsiteSettingsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteSettingsPage id={id} />;
}
