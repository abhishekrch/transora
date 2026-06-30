import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWebsiteSchema, SUPPORTED_LANGUAGES } from "@transora/shared";
import { z } from "zod";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
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
    <div className="mx-auto max-w-2xl space-y-6">
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
              <select
                id="defaultLanguage"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...form.register("defaultLanguage")}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Target Languages</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the languages you want to translate your website into.
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto rounded-md border p-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <label
                    key={lang.code}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={lang.code}
                      className="rounded border-input"
                      {...form.register("allowedLanguages")}
                    />
                    {lang.name}
                  </label>
                ))}
              </div>
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
