import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateWebsiteSchema, type UpdateWebsiteInput, SUPPORTED_LANGUAGES } from "@transora/shared";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@transora/ui/components/select";
import { Switch } from "@transora/ui/components/switch";
import { websiteQueries } from "../api/website-queries";
import { useUpdateWebsite, useDeleteWebsite } from "../api/website-mutations";

interface WebsiteSettingsPageProps {
  id: string;
}

export function WebsiteSettingsPage({ id }: WebsiteSettingsPageProps) {
  const { data: website, isLoading } = useSuspenseQuery(websiteQueries.detail(id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!website) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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

function SettingsForm({ website }: { website: { id: string; domain: string; defaultLanguage: string; allowedLanguages: string[]; switcherPosition: string; switcherStyle: string; seoHreflang: boolean; seoMetaTranslate: boolean; isActive: boolean; rateLimitPerMin: number; dailyCharLimit: number } }) {
  const updateWebsite = useUpdateWebsite(website.id);

  const form = useForm<UpdateWebsiteInput>({
    resolver: zodResolver(UpdateWebsiteSchema),
    defaultValues: {
      defaultLanguage: website.defaultLanguage,
      allowedLanguages: website.allowedLanguages,
      switcherPosition: website.switcherPosition as UpdateWebsiteInput["switcherPosition"],
      switcherStyle: website.switcherStyle as UpdateWebsiteInput["switcherStyle"],
      seoHreflang: website.seoHreflang,
      seoMetaTranslate: website.seoMetaTranslate,
      isActive: website.isActive,
    },
  });

  const onSubmit = (data: UpdateWebsiteInput) => {
    updateWebsite.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration
        </CardTitle>
        <CardDescription>
          Update your website&apos;s translation settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Domain</Label>
            <Input value={website.domain} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Controller
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full" id="defaultLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="switcherPosition">Switcher Position</Label>
              <Controller
                control={form.control}
                name="switcherPosition"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" id="switcherPosition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="switcherStyle">Switcher Style</Label>
              <Controller
                control={form.control}
                name="switcherStyle"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" id="switcherStyle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="flags">Flags</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>SEO Hreflang Tags</Label>
                <p className="text-xs text-muted-foreground">Add hreflang meta tags for translated pages</p>
              </div>
              <Controller
                control={form.control}
                name="seoHreflang"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SEO Meta Translation</Label>
                <p className="text-xs text-muted-foreground">Translate meta descriptions and titles</p>
              </div>
              <Controller
                control={form.control}
                name="seoMetaTranslate"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-xs text-muted-foreground">Enable or disable translations for this website</p>
              </div>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Rate Limit</p>
                <p className="font-medium">{website.rateLimitPerMin} req/min</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily Char Limit</p>
                <p className="font-medium">{website.dailyCharLimit.toLocaleString()} chars</p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={updateWebsite.isPending}>
            {updateWebsite.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerZone({ websiteId, domain }: { websiteId: string; domain: string }) {
  const deleteWebsite = useDeleteWebsite();

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions. Proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Website</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete {domain} and all associated translations and glossary entries.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${domain}? This cannot be undone.`)) {
                deleteWebsite.mutate(websiteId);
              }
            }}
            disabled={deleteWebsite.isPending}
          >
            Delete Website
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
