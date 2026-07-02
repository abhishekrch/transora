import * as React from "react";
import { Languages, Zap, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import { useGlobalStats } from "@/features/dashboard/hooks/use-global-stats";

export function StatsCards() {
  const {
    totalTranslations,
    cacheHitRate,
    charsTranslated,
    activeWebsitesCount,
    isLoading,
  } = useGlobalStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Languages}
        label="Total Translations"
        value={isLoading ? "—" : totalTranslations.toLocaleString()}
        description="Across all websites"
        loading={isLoading}
      />
      <StatCard
        icon={Zap}
        label="Cache Hit Rate"
        value={isLoading ? "—" : `${cacheHitRate}%`}
        description="Requests served from cache"
        loading={isLoading}
      />
      <StatCard
        icon={BarChart3}
        label="Characters Translated"
        value={isLoading ? "—" : charsTranslated.toLocaleString()}
        description="This month"
        loading={isLoading}
      />
      <StatCard
        icon={Globe}
        label="Active Websites"
        value={isLoading ? "—" : activeWebsitesCount.toString()}
        description="Currently translating"
        loading={isLoading}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20 mb-1" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
