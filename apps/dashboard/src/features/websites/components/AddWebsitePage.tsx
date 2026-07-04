import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWebsiteSchema, SUPPORTED_LANGUAGES } from "@transora/shared";
import { z } from "zod";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxValue,
} from "@transora/ui/components/combobox";
import { ArrowLeft, Globe } from "lucide-react";
import { useCreateWebsite } from "../api/website-mutations";

type FormValues = z.input<typeof CreateWebsiteSchema>;

export function AddWebsitePage() {
  const createWebsite = useCreateWebsite();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateWebsiteSchema),
    defaultValues: {
      domain: "",
      defaultLanguage: "en",
      allowedLanguages: ["en"],
    },
  });

  const onSubmit = (data: FormValues) => {
    createWebsite.mutate({
      ...data,
      defaultLanguage: data.defaultLanguage ?? "en",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/websites">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add Website</h1>
          <p className="text-sm text-muted-foreground">
            Register a new website to start translating.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Details
          </CardTitle>
          <CardDescription>
            Enter your website domain and select the languages you want to translate into.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="example.com"
                {...form.register("domain")}
              />
              {form.formState.errors.domain && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.domain.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter your website domain without https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Combobox
                name="defaultLanguage"
                value={form.watch("defaultLanguage")}
                onValueChange={(value) => form.setValue("defaultLanguage", value ?? undefined)}
              >
                <ComboboxInput placeholder="Select language">
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
            </div>

            <div className="space-y-2">
              <Label>Target Languages</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the languages you want to translate your website into.
              </p>
              <Combobox
                name="allowedLanguages"
                multiple
                defaultValue={form.watch("allowedLanguages")}
                onValueChange={(value) => form.setValue("allowedLanguages", value)}
              >
                <ComboboxChips>
                  {form.watch("allowedLanguages")?.map((langCode) => {
                    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
                    return lang ? (
                      <ComboboxChip key={lang.code}>
                        {lang.name}
                      </ComboboxChip>
                    ) : null;
                  })}
                  <ComboboxChipsInput placeholder="Select languages..." />
                </ComboboxChips>
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
              {form.formState.errors.allowedLanguages && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.allowedLanguages.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link to="/websites">Cancel</Link>
              </Button>
              <Button type="submit" disabled={createWebsite.isPending}>
                {createWebsite.isPending ? "Creating..." : "Create Website"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
