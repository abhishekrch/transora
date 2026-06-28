import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@transora/shared";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardHeader } from "@transora/ui/components/card";
import { useLogin } from "../api/auth-mutations";
import { getAuthErrorMessage } from "../utils/auth-errors";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginForm() {
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    login.mutate(data, {
      onError: (error) => {
        setServerError(getAuthErrorMessage(error));
      },
    });
  };

  return (
    <Card className="w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-white p-8 md:p-10 shadow-xs relative flex flex-col gap-0 py-8 md:py-10 px-8 md:px-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono text-[9px] font-bold tracking-widest text-primary uppercase">
            SECURE_AUTH // LOG_IN
          </span>
        </div>
        <span className="font-mono text-[9px] text-secondary/40 select-none">v1.0.0</span>
      </div>

      <CardHeader className="p-0 mb-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Sign in
        </h2>
        <p className="text-xs text-secondary/70">
          Enter your credentials to access your localization panel.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-xs font-mono text-destructive"
            >
              ERROR: {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-mono text-[9px] font-bold tracking-widest uppercase text-secondary">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={login.isPending}
              className="rounded-[10px] border-border/60 bg-transparent px-3 py-2.5 text-sm text-foreground focus-visible:ring-primary focus-visible:border-primary placeholder:text-secondary/40"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs font-mono text-destructive">
                * {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-mono text-[9px] font-bold tracking-widest uppercase text-secondary">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={login.isPending}
              className="rounded-[10px] border-border/60 bg-transparent px-3 py-2.5 text-sm text-foreground focus-visible:ring-primary focus-visible:border-primary placeholder:text-secondary/40"
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs font-mono text-destructive">
                * {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full font-semibold h-10 mt-2 bg-primary hover:bg-primary/95 text-white"
            disabled={login.isPending}
            aria-busy={login.isPending}
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-xs text-secondary/70 pt-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
