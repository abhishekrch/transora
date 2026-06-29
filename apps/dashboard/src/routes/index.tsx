import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { Navigation } from "@/features/landing/components/Navigation";
import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CTA } from "@/features/landing/components/CTA";
import { Footer } from "@/features/landing/components/Footer";
import { GridBackground } from "@transora/ui/components/grid-background";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: IndexPage,
});

function IndexPage() {
  return <LandingPage />;
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
