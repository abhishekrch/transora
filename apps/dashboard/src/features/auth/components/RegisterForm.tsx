import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@transora/shared";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import { Card, CardContent, CardHeader } from "@transora/ui/components/card";
import { useRegister } from "../api/auth-mutations";
import { getAuthErrorMessage } from "../utils/auth-errors";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function RegisterForm() {
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);
    registerMutation.mutate(data, {
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
            USER_REGISTRATION // SIGN_UP
          </span>
        </div>
        <span className="font-mono text-[9px] text-secondary/40 select-none">v1.0.0</span>
      </div>

      <CardHeader className="p-0 mb-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Create account
        </h2>
        <p className="text-xs text-secondary/70">
          Enter your details to register your localization dashboard.
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
              disabled={registerMutation.isPending}
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
              placeholder="Create password (min. 8 chars)"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={registerMutation.isPending}
              className="rounded-[10px] border-border/60 bg-transparent px-3 py-2.5 text-sm text-foreground focus-visible:ring-primary focus-visible:border-primary placeholder:text-secondary/40"
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs font-mono text-destructive">
                * {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="font-mono text-[9px] font-bold tracking-widest uppercase text-secondary">
              Company Name <span className="text-[8px] text-secondary/45 font-semibold">(Optional)</span>
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Your organization"
              autoComplete="organization"
              aria-invalid={!!errors.companyName}
              aria-describedby={errors.companyName ? "company-error" : undefined}
              disabled={registerMutation.isPending}
              className="rounded-[10px] border-border/60 bg-transparent px-3 py-2.5 text-sm text-foreground focus-visible:ring-primary focus-visible:border-primary placeholder:text-secondary/40"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p id="company-error" role="alert" className="text-xs font-mono text-destructive">
                * {errors.companyName.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full font-semibold h-10 mt-2 bg-primary hover:bg-primary/95 text-white"
            disabled={registerMutation.isPending}
            aria-busy={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-xs text-secondary/70 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
