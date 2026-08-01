import * as React from "react";
import { Languages, Zap, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { Skeleton } from "@transora/ui/components/skeleton";
import { useGlobalStats } from "@/features/dashboard/hooks/use-global-stats";

const CARD_SCRIPTS = ["हिं", "ॐ", "বাং", "भो"] as const;

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
        script={CARD_SCRIPTS[0]!}
      />
      <StatCard
        icon={Zap}
        label="Cache Hit Rate"
        value={isLoading ? "—" : `${cacheHitRate}%`}
        description="Requests served from cache"
        loading={isLoading}
        script={CARD_SCRIPTS[1]!}
      />
      <StatCard
        icon={BarChart3}
        label="Characters Translated"
        value={isLoading ? "—" : charsTranslated.toLocaleString()}
        description="This month"
        loading={isLoading}
        script={CARD_SCRIPTS[2]!}
      />
      <StatCard
        icon={Globe}
        label="Active Websites"
        value={isLoading ? "—" : activeWebsitesCount.toString()}
        description="Currently translating"
        loading={isLoading}
        script={CARD_SCRIPTS[3]!}
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
  script,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
  loading?: boolean;
  script: string;
}) {
  return (
    <Card className="group relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 top-2 select-none font-display text-6xl font-bold text-muted/50 transition-colors group-hover:text-primary/10"
      >
        {script}
      </span>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20 mb-1" />
        ) : (
          <div className="font-display text-2xl font-semibold tracking-tight">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
