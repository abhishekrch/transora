import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { websiteQueries } from "../api/website-queries";
import { SettingsForm } from "./SettingsForm";
import { DangerZone } from "./DangerZone";

interface WebsiteSettingsPageProps {
  id: string;
}

export function WebsiteSettingsPage({ id }: WebsiteSettingsPageProps) {
  const { data: website } = useSuspenseQuery(websiteQueries.detail(id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/websites/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Website Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure {website.domain}
          </p>
        </div>
      </div>

      <SettingsForm website={website} />
      <DangerZone websiteId={id} domain={website.domain} />
    </div>
  );
}

