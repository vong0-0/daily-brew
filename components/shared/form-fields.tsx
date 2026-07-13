import * as React from "react";
import { cn } from "@/lib/utils";

// ─── FieldError ───────────────────────────────────────────────────────────────

export type FieldErrorProps = {
  message: string | undefined;
};

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <span className="mt-0.5 text-xs text-status-warning">{message}</span>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────

export type FieldLabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
};

export function FieldLabel({ htmlFor, children, optional = false }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
    >
      {children}
      {optional && (
        <span className="ml-1.5 font-normal normal-case tracking-normal text-text-secondary/50">
          (optional)
        </span>
      )}
    </label>
  );
}

// ─── InputField ───────────────────────────────────────────────────────────────

export type InputFieldProps = {
  id: string;
  hasError: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({ id, hasError, className, ...props }: InputFieldProps) {
  return (
    <input
      id={id}
      aria-invalid={hasError}
      className={cn(
        "h-9 w-full rounded-sm border bg-bg-base px-3 font-mono text-sm text-text-primary outline-none transition placeholder:text-text-secondary/40",
        hasError
          ? "border-status-warning focus:border-status-warning"
          : "border-border focus:border-accent",
        className
      )}
      {...props}
    />
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

export type SelectFieldProps = {
  id: string;
  hasError: boolean;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ id, hasError, children, className, ...props }: SelectFieldProps) {
  return (
    <select
      id={id}
      aria-invalid={hasError}
      className={cn(
        "h-9 w-full cursor-pointer rounded-sm border bg-bg-base px-3 font-mono text-sm text-text-primary outline-none transition",
        hasError
          ? "border-status-warning focus:border-status-warning"
          : "border-border focus:border-accent",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
