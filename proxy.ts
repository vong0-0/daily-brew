import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS, clearSessionCookie, deleteSession, getSessionByTokenHash, updateSessionExpiry } from "./lib/session";
import { hashToken } from "./lib/token";

function createLoginUrl(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "redirectTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return loginUrl;
}

function attachSessionToNextResponse(response: NextResponse, sessionRawToken: string) {
  response.cookies.set(SESSION_COOKIE_NAME, sessionRawToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  });
}

export async function proxy(request: NextRequest) {
  const sessionRawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  console.log(createLoginUrl(request))
  if (!sessionRawToken) {
    return NextResponse.redirect(createLoginUrl(request))
  }

  const tokenHash = hashToken(sessionRawToken)
  const session = await getSessionByTokenHash(tokenHash)

  if (!session) {
    const response = NextResponse.redirect(createLoginUrl(request))
    await deleteSession(tokenHash);
    await clearSessionCookie();
    return response;
  }

  const refreshedSession = await updateSessionExpiry(session.tokenHash);

  if (!refreshedSession) {
    const response = NextResponse.redirect(createLoginUrl(request))
    await deleteSession(tokenHash);
    await clearSessionCookie();
    return response;
  }

  const response = NextResponse.next();
  attachSessionToNextResponse(response, sessionRawToken)

  return response
}

export const config = {
  matcher: [
    "/dashboard"
  ]
}