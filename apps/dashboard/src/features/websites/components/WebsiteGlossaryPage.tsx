import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGlossarySchema, type CreateGlossaryInput, SUPPORTED_LANGUAGES } from "@transora/shared";
import { ArrowLeft, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@transora/ui/components/dialog";
import { glossaryQueries } from "@/features/glossary/api/glossary-queries";
import { useCreateGlossaryEntry, useDeleteGlossaryEntry } from "@/features/glossary/api/glossary-mutations";

interface WebsiteGlossaryPageProps {
  id: string;
}

export function WebsiteGlossaryPage({ id }: WebsiteGlossaryPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/websites/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Glossary</h1>
          <p className="text-sm text-muted-foreground">
            Override automatic translations with your preferred terms.
          </p>
        </div>
        <AddEntryDialog websiteId={id} />
      </div>

      <GlossaryTable websiteId={id} />
    </div>
  );
}

function GlossaryTable({ websiteId }: { websiteId: string }) {
  const { data: entries, isLoading } = useSuspenseQuery(glossaryQueries.list(websiteId));
  const deleteEntry = useDeleteGlossaryEntry(websiteId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">No glossary entries</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Add entries to override automatic translations with your preferred terms.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="p-4 font-medium">Source Text</th>
              <th className="p-4 font-medium">Language</th>
              <th className="p-4 font-medium">Translation</th>
              <th className="p-4 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b last:border-0">
                <td className="p-4 text-sm">{entry.sourceText}</td>
                <td className="p-4 text-sm text-muted-foreground uppercase">{entry.targetLang}</td>
                <td className="p-4 text-sm font-medium">{entry.translatedText}</td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Delete this glossary entry?")) {
                        deleteEntry.mutate(entry.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function AddEntryDialog({ websiteId }: { websiteId: string }) {
  const [open, setOpen] = useState(false);
  const createEntry = useCreateGlossaryEntry(websiteId);

  const form = useForm<CreateGlossaryInput>({
    resolver: zodResolver(CreateGlossarySchema),
    defaultValues: {
      sourceText: "",
      targetLang: "fr",
      translatedText: "",
    },
  });

  const onSubmit = (data: CreateGlossaryInput) => {
    createEntry.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Glossary Entry</DialogTitle>
          <DialogDescription>
            Define a custom translation that overrides the automatic one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sourceText">Source Text</Label>
            <Input
              id="sourceText"
              placeholder="e.g. Sign Up"
              {...form.register("sourceText")}
            />
            {form.formState.errors.sourceText && (
              <p className="text-sm text-destructive">{form.formState.errors.sourceText.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetLang">Target Language</Label>
            <select
              id="targetLang"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              {...form.register("targetLang")}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="translatedText">Translation</Label>
            <Input
              id="translatedText"
              placeholder="e.g. S'inscrire"
              {...form.register("translatedText")}
            />
            {form.formState.errors.translatedText && (
              <p className="text-sm text-destructive">{form.formState.errors.translatedText.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEntry.isPending}>
              {createEntry.isPending ? "Adding..." : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
