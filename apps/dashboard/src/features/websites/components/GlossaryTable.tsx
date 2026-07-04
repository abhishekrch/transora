import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Card, CardContent } from "@transora/ui/components/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@transora/ui/components/alert-dialog";
import { glossaryQueries } from "@/features/glossary/api/glossary-queries";
import { useDeleteGlossaryEntry } from "@/features/glossary/api/glossary-mutations";

interface GlossaryTableProps {
  websiteId: string;
}

export function GlossaryTable({ websiteId }: GlossaryTableProps) {
  const { data: entries } = useSuspenseQuery(glossaryQueries.list(websiteId));
  const deleteEntry = useDeleteGlossaryEntry(websiteId);

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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={deleteEntry.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete glossary entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this custom translation rule? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => deleteEntry.mutate(entry.id)}
                          disabled={deleteEntry.isPending}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
