import { Button } from "@transora/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
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
import { useDeleteWebsite } from "@/features/websites/api/website-mutations";

interface DangerZoneProps {
  websiteId: string;
  domain: string;
}

export function DangerZone({ websiteId, domain }: DangerZoneProps) {
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteWebsite.isPending}
              >
                Delete Website
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete <strong>{domain}</strong> and all associated translations and glossary entries.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteWebsite.mutate(websiteId)}
                  disabled={deleteWebsite.isPending}
                >
                  Delete Website
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
