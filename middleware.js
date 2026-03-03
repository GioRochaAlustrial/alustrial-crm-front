import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const path = req.nextUrl.pathname;

  const isPrivate =
    path.startsWith("/dashboard") ||
    path.startsWith("/welcome") ||
    path.startsWith("/ventas") ||
    path.startsWith("/citas");
  const isLogin = req.nextUrl.pathname.startsWith("/login");

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/welcome/:path*", "/ventas/:path*", "/citas/:path*", "/login"],
};
