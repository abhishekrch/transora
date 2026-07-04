import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGlossarySchema, type CreateGlossaryInput, SUPPORTED_LANGUAGES } from "@transora/shared";
import { Plus } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@transora/ui/components/dialog";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
} from "@transora/ui/components/combobox";
import { useCreateGlossaryEntry } from "@/features/glossary/api/glossary-mutations";

interface AddEntryDialogProps {
  websiteId: string;
}

export function AddEntryDialog({ websiteId }: AddEntryDialogProps) {
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
            <Controller
              control={form.control}
              name="targetLang"
              render={({ field }) => (
                <Combobox
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput placeholder="Select language" id="targetLang">
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
