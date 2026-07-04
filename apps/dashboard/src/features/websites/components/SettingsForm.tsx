import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateWebsiteSchema, type UpdateWebsiteInput, SUPPORTED_LANGUAGES, type Website } from "@transora/shared";
import { Settings } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@transora/ui/components/select";
import { Switch } from "@transora/ui/components/switch";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
} from "@transora/ui/components/combobox";
import { useUpdateWebsite } from "@/features/websites/api/website-mutations";

interface SettingsFormProps {
  website: Website;
}

export function SettingsForm({ website }: SettingsFormProps) {
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
                <Combobox
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput placeholder="Select language" id="defaultLanguage">
                    <ComboboxValue>
                      {(value) => SUPPORTED_LANGUAGES.find((lang) => lang.code === value)?.name}
                    </ComboboxValue>
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxList>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <ComboboxItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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
