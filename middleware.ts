import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_PREFIXES = ["/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPage && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/account/:path*",
  ],
};
