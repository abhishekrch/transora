import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Globe, Plus, ArrowRight, Copy, MoreHorizontal, Settings, Trash2, BookOpen } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Badge } from "@transora/ui/components/badge";
import { Skeleton } from "@transora/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@transora/ui/components/dropdown-menu";
import { websiteQueries } from "../api/website-queries";
import { toast } from "sonner";

export function WebsitesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Websites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your websites and translation settings.
          </p>
        </div>
        <Button asChild>
          <Link to="/websites/add">
            <Plus className="mr-1.5 h-4 w-4" />
            Add website
          </Link>
        </Button>
      </div>

      <WebsitesList />
    </div>
  );
}

function WebsitesList() {
  const { data: websites, isLoading } = useSuspenseQuery(websiteQueries.list());

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!websites || websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg">
        <Globe className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">No websites yet</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
          Add your first website to start translating content into 100+ languages.
        </p>
        <Button asChild>
          <Link to="/websites/add">
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first website
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {websites.map((website) => (
        <WebsiteRow key={website.id} website={website} />
      ))}
    </div>
  );
}

function WebsiteRow({ website }: { website: { id: string; domain: string; apiKey: string; isActive: boolean; defaultLanguage: string; allowedLanguages: string[] } }) {
  const maskedKey = website.apiKey.slice(0, 12) + "..." + website.apiKey.slice(-4);

  const copyApiKey = () => {
    navigator.clipboard.writeText(website.apiKey);
    toast.success("API key copied to clipboard");
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{website.domain}</p>
            <Badge variant={website.isActive ? "default" : "secondary"} className="shrink-0">
              {website.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={copyApiKey}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {maskedKey}
              <Copy className="h-3 w-3" />
            </button>
            <span className="text-xs text-muted-foreground">
              {website.allowedLanguages.length} languages
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/websites/$id" params={{ id: website.id }}>
            View
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/websites/$id/settings" params={{ id: website.id }}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/websites/$id/glossary" params={{ id: website.id }}>
                <BookOpen className="mr-2 h-4 w-4" />
                Glossary
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
