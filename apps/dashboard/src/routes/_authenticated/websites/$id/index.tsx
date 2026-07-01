import { createFileRoute } from "@tanstack/react-router";
import { WebsiteDetailsPage } from "@/features/websites/components/WebsiteDetailsPage";
import { websiteQueries } from "@/features/websites/api/website-queries";

export const Route = createFileRoute("/_authenticated/websites/$id/")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(websiteQueries.detail(params.id)),
  component: WebsiteDetailsRouteComponent,
});

function WebsiteDetailsRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteDetailsPage id={id} />;
}
