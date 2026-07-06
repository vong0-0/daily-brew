import "server-only";

import { forbidden } from "next/navigation";
import { UserRole } from "@/prisma/generated/prisma/client";

import {
  type ActiveSession,
  type SessionUser,
  getCurrentSession,
} from "./session";
import { verifySession } from "./dal";

export type { SessionUser } from "./session";


function denyAccess() {
  forbidden();
}

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  const session = await getCurrentSession();

  return session?.user ?? null;
}

export async function requireRole(...roles: UserRole[]): Promise<ActiveSession> {
  const session = await verifySession();

  if (!roles.includes(session.user.role)) {
    denyAccess();
  }

  return session;
}

export async function requireAdmin(): Promise<ActiveSession> {
  return await requireRole(UserRole.ADMIN);
}

/** Returns true if the current session belongs to an ADMIN user, false otherwise. */
export async function isAdmin(): Promise<boolean> {
  const session = await getCurrentSession();
  return session?.user.role === UserRole.ADMIN;
}
