import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@transora/ui/components/button";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AuthenticatedLayout,
  errorComponent: ({ error }) => {
    const router = useRouter();
    const isAuthError = error?.message?.includes("401") || error?.message?.includes("Unauthorized");

    if (isAuthError) {
      useAuthStore.getState().clearAuth();
      throw redirect({ to: "/login" });
    }

    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
          <Button onClick={() => router.invalidate()} className="mt-4">
            Try again
          </Button>
        </div>
      </DashboardLayout>
    );
  },
});

function AuthenticatedLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
