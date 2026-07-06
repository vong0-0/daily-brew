import { cache } from "react";
import { cookies } from "next/headers";
import { Session as SessionRecord, User } from "@/prisma/generated/prisma/client";

import prisma from "./prisma";
import { generateRawHash, hashToken } from "./token";

export const SESSION_COOKIE_NAME = "daily-brew-session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export type SessionUser = Pick<User, "id" | "username" | "firstName" | "lastName" | "role">;
export type ActiveSession = SessionRecord & { user: SessionUser };

function getSessionExpiresAt(referenceDate = new Date()) {
  return new Date(referenceDate.getTime() + SESSION_DURATION_MS);
}

async function getCookieStore() {
  return cookies();
}

async function getRawSessionTokenFromCookie() {
  const cookieStore = await getCookieStore();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

async function setSessionCookie(rawToken: string, expiresAt: Date) {
  const cookieStore = await getCookieStore();

  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await getCookieStore();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionByTokenHash(tokenHash: string): Promise<ActiveSession | null> {
  if (!tokenHash) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    return null;
  }

  return session;
}

export async function updateSessionExpiry(tokenHash: string) {
  const expiresAt = getSessionExpiresAt();

  const updated = await prisma.session.updateMany({
    where: {
      tokenHash,
    },
    data: {
      expiresAt,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const session = await getSessionByTokenHash(tokenHash);

  if (!session) {
    return null;
  }

  return session;
}

async function readSessionFromCookie(): Promise<ActiveSession | null> {
  const rawToken = await getRawSessionTokenFromCookie();

  if (!rawToken) {
    return null;
  }

  return await getSessionByTokenHash(hashToken(rawToken));
}

export const getCurrentSession = cache(readSessionFromCookie);

export async function createSession(userId: string) {
  const rawToken = generateRawHash();
  const tokenHash = hashToken(rawToken);
  const expiresAt = getSessionExpiresAt();

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  await setSessionCookie(rawToken, expiresAt);

  return session;
}

export async function refreshedSession(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const session = await updateSessionExpiry(tokenHash);

  if (!session) {
    return null
  }

  await setSessionCookie(rawToken, getSessionExpiresAt());

  return session;
}

export async function deleteSession(tokenHash: string) {
  if (!tokenHash) {
    return null
  }

  await prisma.session.deleteMany({
    where: {
      tokenHash,
    },
  });
}

export async function deleteCurrentSession() {
  const cookieStore = await getCookieStore();
  const sessionTokenRaw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionTokenRaw) {
    return null;
  }

  const tokenHash = hashToken(sessionTokenRaw);

  const session = await getSessionByTokenHash(tokenHash);

  if (!session) {
    return null;
  }

  await deleteSession(tokenHash);
  await clearSessionCookie();

  return session;

}

export async function deleteUserSession(userId: string) {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}
