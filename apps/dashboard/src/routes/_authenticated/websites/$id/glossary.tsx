import { createFileRoute } from "@tanstack/react-router";
import { WebsiteGlossaryPage } from "@/features/websites/components/WebsiteGlossaryPage";
import { glossaryQueries } from "@/features/glossary/api/glossary-queries";

export const Route = createFileRoute("/_authenticated/websites/$id/glossary")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(glossaryQueries.list(params.id)),
  component: WebsiteGlossaryRouteComponent,
});

function WebsiteGlossaryRouteComponent() {
  const { id } = Route.useParams();
  return <WebsiteGlossaryPage id={id} />;
}
