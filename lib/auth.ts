import "server-only";

import { forbidden } from "next/navigation";
import { UserRole } from "@/prisma/generated/prisma/client";

import {
  type ActiveSession,
} from "./session";
import { verifySession } from "./dal";


function denyAccess() {
  forbidden();
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
