import { createFileRoute } from "@tanstack/react-router";
import { WebsiteDetailsPage } from "@/features/websites/components/WebsiteDetailsPage";
import { queryClient } from "@/lib/query-client";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/$id")({
  loader: ({ params }) => queryClient.ensureQueryData(websiteQueries.detail(params.id)),
  component: WebsiteDetailsRouteComponent,
});

function WebsiteDetailsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteDetailsPage id={id} />;
}
