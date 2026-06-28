import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuthStore } from "@/features/auth/hooks/use-auth";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Transora</h1>
          <p className="mt-2 text-muted-foreground">
            Translate your website into 100+ languages
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
