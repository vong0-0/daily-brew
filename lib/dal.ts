import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { clearSessionCookie, deleteSession, getSessionByTokenHash, SESSION_COOKIE_NAME, updateSessionExpiry } from "./session"
import { redirect } from "next/navigation"
import { hashToken } from "./token"

export const verifySession = cache(async () => {
  const sessionRawToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!sessionRawToken) {
    return redirect("/login")
  }

  const tokenHash = hashToken(sessionRawToken);
  const session = await getSessionByTokenHash(tokenHash)

  if (!session) {
    await deleteSession(tokenHash);
    await clearSessionCookie();
    return redirect("/login");
  }

  const refreshedSession = await updateSessionExpiry(session.tokenHash);

  if (!refreshedSession) {
    await deleteSession(tokenHash);
    await clearSessionCookie();
    return redirect("/login");
  }

  return refreshedSession
})