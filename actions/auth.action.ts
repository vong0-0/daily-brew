"use server";

import { comparePassword } from "@/lib/password";
import { createSession, deleteCurrentSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth.schema";
import { z } from "zod";
import { redirect } from "next/navigation";

export async function signin(
  data: z.input<typeof loginSchema>
): Promise<{ success: boolean; error?: string | Record<string, string[]>; message?: string }> {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const username = validatedFields.data.username.trim();
    const password = validatedFields.data.password;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

    await createSession(user.id);

    return {
      success: true,
      message: "Login successful",
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong try again later",
    };
  }
}

export async function signout(): Promise<void> {
  await deleteCurrentSession();
  redirect("/login");
}
