import { createFileRoute } from "@tanstack/react-router";
import { WebsiteDetailsPage } from "@/features/websites/components/WebsiteDetailsPage";

export const Route = createFileRoute("/_authenticated/websites/$id")({
  component: WebsiteDetailsRouteComponent,
});

function WebsiteDetailsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteDetailsPage id={id} />;
}
