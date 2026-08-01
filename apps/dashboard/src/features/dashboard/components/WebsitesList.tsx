import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Globe, Plus, ArrowRight, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Button } from "@transora/ui/components/button";
import { Badge } from "@transora/ui/components/badge";
import { websiteQueries } from "@/features/websites/api/website-queries";

export function RecentWebsites() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-base">Your Websites</CardTitle>
        <Button size="sm" asChild>
          <Link to="/websites/add">
            <Plus className="h-3.5 w-3.5" />
            Add website
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <WebsitesList />
      </CardContent>
    </Card>
  );
}

function WebsitesList() {
  const { data: websites } = useSuspenseQuery(websiteQueries.list());

  if (!websites || websites.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed py-14 text-center">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 right-3 select-none font-display text-6xl font-bold text-muted/60"
        >
          भाषा
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Languages className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No websites yet
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Add your first website to start translating it into 100+ languages.
        </p>
        <Button size="sm" className="mt-5" asChild>
          <Link to="/websites/add">
            Add your first website
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {websites.slice(0, 5).map((website) => (
        <Link
          key={website.id}
          to="/websites/$id"
          params={{ id: website.id }}
          className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{website.domain}</p>
              <p className="text-xs text-muted-foreground">
                {website.allowedLanguages.length} languages · {website.defaultLanguage}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={website.isActive ? "default" : "secondary"}>
              {website.isActive ? "Active" : "Inactive"}
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}

      {websites.length > 5 && (
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link to="/websites">
            View all {websites.length} websites
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
