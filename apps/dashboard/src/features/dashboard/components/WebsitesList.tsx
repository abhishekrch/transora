import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Globe, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Button } from "@transora/ui/components/button";
import { Badge } from "@transora/ui/components/badge";
import { websiteQueries } from "@/features/websites/api/website-queries";

export function RecentWebsites() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Your Websites</CardTitle>
        <Button size="sm" asChild>
          <Link to="/websites/add">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Globe className="h-10 w-10 text-muted-foreground/50 mb-4" />
        <p className="text-sm font-medium text-muted-foreground">
          No websites yet
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1 mb-4">
          Add your first website to start translating
        </p>
        <Button size="sm" asChild>
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
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Globe className="h-4 w-4 text-muted-foreground" />
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
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
