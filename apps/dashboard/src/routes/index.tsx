import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { Button } from "@transora/ui/components/button";
import { useLogout } from "@/features/auth/api/auth-mutations";
import { Navigation } from "@/features/landing/components/Navigation";
import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CTA } from "@/features/landing/components/CTA";
import { Footer } from "@/features/landing/components/Footer";
import { GridBackground } from "@transora/ui/components/grid-background";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <DashboardPage />;
}

function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] bg-background">
      <div className="mx-auto max-w-7xl px-6 relative min-h-[100dvh]">
        <GridBackground />
        
        <div className="relative z-10">
          <Navigation />
          <Hero />
          <Features />
          <HowItWorks />
          <CTA />
          <Footer />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md space-y-6 text-center p-8 border border-border/60 bg-white rounded-2xl shadow-xs">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-secondary/80">
          Welcome back, <span className="font-semibold text-foreground">{user?.email ?? "User"}</span>
        </p>
        <Button onClick={logout} variant="outline" className="w-full rounded-full font-semibold">
          Sign out
        </Button>
      </div>
    </div>
  );
}
