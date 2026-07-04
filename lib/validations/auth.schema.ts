import { z } from "zod/v4";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .superRefine((value, ctx) => {
    if (value.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must be at least 4 characters long",
      });
      return;
    }

    if (value.length > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must not exceed 20 characters",
      });
      return;
    }

    if (!/^[a-z][a-z0-9_]*$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must start with a letter and may contain only a-z, 0-9, and _",
      });
      return;
    }
  });

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
