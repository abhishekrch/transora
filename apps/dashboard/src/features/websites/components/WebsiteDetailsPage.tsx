import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Settings, BookOpen, Globe, Key } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Badge } from "@transora/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import { websiteQueries } from "../api/website-queries";
import { useRegenerateKey } from "../api/website-mutations";
import { toast } from "sonner";

interface WebsiteDetailsPageProps {
  id: string;
}

export function WebsiteDetailsPage({ id }: WebsiteDetailsPageProps) {
  const { data: website, isLoading } = useSuspenseQuery(websiteQueries.detail(id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Globe className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">Website not found</h3>
        <Button variant="ghost" asChild className="mt-4">
          <Link to="/websites">Back to websites</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/websites">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{website.domain}</h1>
            <Badge variant={website.isActive ? "default" : "secondary"}>
              {website.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {website.allowedLanguages.length} languages · Default: {website.defaultLanguage}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/websites/$id/glossary" params={{ id }}>
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Glossary
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/websites/$id/settings" params={{ id }}>
              <Settings className="mr-1.5 h-3.5 w-3.5" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <ApiKeyCard websiteId={id} apiKey={website.apiKey} />
      <SnippetCard apiKey={website.apiKey} domain={website.domain} />
    </div>
  );
}

function ApiKeyCard({ websiteId, apiKey }: { websiteId: string; apiKey: string }) {
  const regenerateKey = useRegenerateKey(websiteId);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Key
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => regenerateKey.mutate()}
          disabled={regenerateKey.isPending}
        >
          Regenerate
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono break-all">
            {apiKey}
          </code>
          <Button variant="outline" size="icon" onClick={copyKey}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use this key in your widget script tag. Keep it secret — do not expose in client-side code.
        </p>
      </CardContent>
    </Card>
  );
}

function SnippetCard({ apiKey, domain }: { apiKey: string; domain: string }) {
  const snippet = `<script src="https://cdn.transora.io/v1/widget.js" data-key="${apiKey}"></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    toast.success("Snippet copied");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Widget Snippet
        </CardTitle>
        <Button variant="outline" size="sm" onClick={copySnippet}>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Add this snippet to your website&apos;s <code className="text-xs bg-muted px-1 rounded">&lt;head&gt;</code> to enable translations on <strong>{domain}</strong>.
        </p>
        <pre className="rounded-md bg-muted p-4 text-xs font-mono overflow-x-auto">
          {snippet}
        </pre>
      </CardContent>
    </Card>
  );
}
