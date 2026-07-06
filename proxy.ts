import "server-only"

import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "./lib/session";

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

  if (!sessionRawToken) {
    const response = NextResponse.redirect(createLoginUrl(request))
    return response;
  }

  const response = NextResponse.next();
  attachSessionToNextResponse(response, sessionRawToken);

  return response
}

export const config = {
  matcher: [
    "/dashboard"
  ]
}