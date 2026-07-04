import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Skeleton } from "@transora/ui/components/skeleton";
import { GlossaryTable } from "./GlossaryTable";
import { AddEntryDialog } from "./AddEntryDialog";

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

      <Suspense fallback={
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      }>
        <GlossaryTable websiteId={id} />
      </Suspense>
    </div>
  );
}

