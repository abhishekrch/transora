import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { StatsCards } from "./StatsCards";
import { RecentWebsites } from "./WebsitesList";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{user?.companyName ? `, ${user.companyName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of your translation activity.
        </p>
      </div>

      <StatsCards />
      <RecentWebsites />
    </div>
  );
}
