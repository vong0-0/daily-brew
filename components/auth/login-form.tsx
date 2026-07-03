"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations/auth.schema";

export function LoginForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "onTouched",
  });

  const onSubmit = (values: z.input<typeof loginSchema>) => {
    clearErrors();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[0];

        if (fieldName === "email" || fieldName === "password" || fieldName === "rememberMe") {
          setError(fieldName, {
            type: "manual",
            message: issue.message,
          });
        }
      }

      return;
    }

    setSubmittedEmail(parsed.data.email);
  };

  return (
    <div className="rounded-sm border border-border bg-bg-surface p-6 shadow-lg shadow-black/20">
      <div className="mb-6 hidden flex-col gap-2 sm:flex">
        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Staff access</p>
        <h1 className="text-2xl font-semibold text-text-primary">Sign in to Daily Brew</h1>
        <p className="text-sm leading-6 text-text-secondary">
          Use your warehouse credentials to access stock movement, product history, and admin tools.
        </p>
      </div>

      {submittedEmail ? (
        <div className="mb-5 rounded-sm border border-status-ok/40 bg-status-ok/10 px-3 py-2 text-sm text-text-primary">
          Validation passed for <span className="font-medium">{submittedEmail}</span>. Connect this form to NextAuth
          credentials next.
        </div>
      ) : null}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-text-primary">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={cn(
              "h-10 rounded-sm border bg-bg-base px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70",
              errors.email
                ? "border-status-warning focus:border-status-warning"
                : "border-border focus:border-accent"
            )}
            placeholder="name@coffeehouse.com"
            {...register("email")}
          />
          {errors.email ? <p className="text-sm text-status-warning">{errors.email.message}</p> : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-text-primary">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className={cn(
                "h-10 w-full rounded-sm border bg-bg-base px-3 pr-10 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70",
                errors.password
                  ? "border-status-warning focus:border-status-warning"
                  : "border-border focus:border-accent"
              )}
              placeholder="Enter your password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:text-text-primary"
            >
              <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={18} />
            </button>
          </div>
          {errors.password ? <p className="text-sm text-status-warning">{errors.password.message}</p> : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            className="size-4 rounded border-border bg-bg-base text-accent focus:ring-0"
            {...register("rememberMe")}
          />
          Remember me on this device
        </label>

        <Button className="mt-1 w-full py-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
