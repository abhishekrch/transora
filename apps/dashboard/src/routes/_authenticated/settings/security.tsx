import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/features/settings/components/SecurityPage";

export const Route = createFileRoute("/_authenticated/settings/security")({
  component: SecurityPage,
});
