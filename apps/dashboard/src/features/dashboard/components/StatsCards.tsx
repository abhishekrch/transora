import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Languages, Zap, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import { statsQueries } from "../api/stats-queries";
import { websiteQueries } from "@/features/websites/api/website-queries";

export function StatsCards() {
  const { data: stats, isLoading: statsLoading } = useQuery(statsQueries.overview("30d"));
  const { data: websites, isLoading: websitesLoading } = useQuery(websiteQueries.list());

  const activeWebsitesCount = websites?.filter((w) => w.isActive).length ?? 0;
  const isLoading = statsLoading || websitesLoading;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Languages}
        label="Total Translations"
        value={isLoading ? "—" : (stats?.totalTranslations?.toLocaleString() ?? "0")}
        description="Across all websites"
        loading={isLoading}
      />
      <StatCard
        icon={Zap}
        label="Cache Hit Rate"
        value={isLoading ? "—" : (stats?.cacheHitRate !== undefined ? `${Math.round(stats.cacheHitRate * 100)}%` : "0%")}
        description="Requests served from cache"
        loading={isLoading}
      />
      <StatCard
        icon={BarChart3}
        label="Characters Translated"
        value={isLoading ? "—" : (stats?.charsTranslated?.toLocaleString() ?? "0")}
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
