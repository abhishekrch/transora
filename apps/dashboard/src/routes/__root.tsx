import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@transora/ui/components/sonner";
import { Button } from "@transora/ui/components/button";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => {
    const router = useRouter();

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
          <Button onClick={() => router.invalidate()}>
            Try again
          </Button>
        </div>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
      <Toaster />
    </QueryProvider>
  );
}
