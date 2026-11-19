import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_PREFIXES = ["/account"];

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_PREFIX = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const customerToken = request.cookies.get("auth_token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;

  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isAdminPage =
    pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);

  if (isAuthPage && customerToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPage && !customerToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Staff and customer sessions are tracked with separate cookies so a
  // customer session can never satisfy the admin route guard.
  if (isAdminLoginPage && adminToken) {
    return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
  }

  if (isAdminPage && !isAdminLoginPage && !adminToken) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
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
    "/admin",
    "/admin/:path*",
  ],
};
