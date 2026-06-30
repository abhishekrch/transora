import { createFileRoute } from "@tanstack/react-router";
import { WebsiteSettingsPage } from "@/features/websites/components/WebsiteSettingsPage";

export const Route = createFileRoute("/_authenticated/websites/$id/settings")({
  component: WebsiteSettingsRouteComponent,
});

function WebsiteSettingsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteSettingsPage id={id} />;
}
