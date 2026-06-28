import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@transora/shared";
import { Button } from "@transora/ui/components/button";
import { Input } from "@transora/ui/components/input";
import { Label } from "@transora/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@transora/ui/components/card";
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to get started with Transora
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={registerMutation.isPending}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 8 characters)"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              disabled={registerMutation.isPending}
              {...register("password")}
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Your company name"
              autoComplete="organization"
              aria-invalid={!!errors.companyName}
              aria-describedby={
                errors.companyName ? "company-error" : undefined
              }
              disabled={registerMutation.isPending}
              {...register("companyName")}
            />
            {errors.companyName && (
              <p
                id="company-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.companyName.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
            aria-busy={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
