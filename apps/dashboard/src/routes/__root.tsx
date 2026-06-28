import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@transora/ui/components/sonner";

export const Route = createRootRoute({
  component: RootComponent,
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
