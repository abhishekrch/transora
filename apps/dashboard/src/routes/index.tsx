import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { Button } from "@transora/ui/components/button";
import { useLogout } from "@/features/auth/api/auth-mutations";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email ?? "User"}
        </p>
        <Button onClick={logout} variant="outline">
          Sign out
        </Button>
      </div>
    </div>
  );
}
