import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { GridBackground } from "@transora/ui/components/grid-background";
import { Copyright } from "@transora/ui/components/copyright";
import { Logo } from "@transora/ui/components/logo";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative min-h-[100dvh] bg-background flex flex-col justify-between overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Logo />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 relative w-full flex-grow flex flex-col pt-16">
        <GridBackground />

        <main className="relative z-10 flex-grow flex items-center justify-center py-12">
          <LoginForm />
        </main>

        <footer className="relative z-10 flex h-16 items-center justify-between text-[10px] font-mono text-secondary/50">
          <Copyright />
        </footer>
      </div>
    </div>
  );
}
