import * as React from "react";
import { BarChart3, TrendingUp, Globe, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@transora/ui/components/card";
import { useSuspenseGlobalStats } from "@/features/dashboard/hooks/use-global-stats";

export function AnalyticsPage() {
  const {
    totalTranslations,
    cacheHitRate,
    uniqueLanguagesCount,
    azureCalls,
  } = useSuspenseGlobalStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed translation analytics across all your websites.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Translations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTranslations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cacheHitRate}%
            </div>
            <p className="text-xs text-muted-foreground">Requests served from cache</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Used</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueLanguagesCount}
            </div>
            <p className="text-xs text-muted-foreground">Unique target languages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Azure API Calls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {azureCalls.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Translations via Azure</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Translation Activity</CardTitle>
          <CardDescription>
            Translation volume over time. Charts will be available once data accumulates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Charts will appear here once translation data is available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
