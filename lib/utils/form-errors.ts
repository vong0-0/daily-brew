import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

type IssueLike = {
  path: PropertyKey[];
  message: string;
};

type FieldErrorMap = Record<string, string[] | undefined>;

export function applyZodIssuesToForm<TFieldValues extends FieldValues>(
  issues: IssueLike[],
  setError: UseFormSetError<TFieldValues>
) {
  for (const issue of issues) {
    const [fieldName] = issue.path;

    if (typeof fieldName !== "string") {
      setError("root" as FieldPath<TFieldValues>, {
        type: "manual",
        message: issue.message,
      });
      continue;
    }

    setError(fieldName as FieldPath<TFieldValues>, {
      type: "manual",
      message: issue.message,
    });
  }
}

export function applyActionErrorsToForm<TFieldValues extends FieldValues>(
  error: string | FieldErrorMap | undefined,
  setError: UseFormSetError<TFieldValues>
) {
  if (!error) {
    return;
  }

  if (typeof error === "string") {
    setError("root" as FieldPath<TFieldValues>, {
      type: "manual",
      message: error,
    });
    return;
  }

  for (const [fieldName, messages] of Object.entries(error)) {
    const message = messages?.[0];

    if (!message) {
      continue;
    }

    if (fieldName === "root") {
      setError("root" as FieldPath<TFieldValues>, {
        type: "manual",
        message,
      });
      continue;
    }

    setError(fieldName as FieldPath<TFieldValues>, {
      type: "manual",
      message,
    });
  }
}
