import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURE_ADMIN_PATH = "/ruman-admin-hub";
const LOGIN_PATH = "/ruman-login-hub";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLegacyAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSecureAdminRoute = pathname === SECURE_ADMIN_PATH || pathname.startsWith(`${SECURE_ADMIN_PATH}/`);
  const isHiddenLoginRoute = pathname === LOGIN_PATH;
  const hasSession = Boolean(request.cookies.get("ruman_session")?.value);

  if (isLegacyAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-not-found";
    const response = NextResponse.rewrite(url);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (isSecureAdminRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (isHiddenLoginRoute && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = SECURE_ADMIN_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/ruman-admin-hub/:path*", "/ruman-admin-hub", "/ruman-login-hub"],
};
