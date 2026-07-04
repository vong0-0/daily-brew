"use server";

import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth.schema";
import { z } from "zod";

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
    console.log(isPasswordValid)

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

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
