// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;

//   const path = req.nextUrl.pathname;

//   const isPrivate =
//     path.startsWith("/dashboard") ||
//     path.startsWith("/welcome") ||
//     path.startsWith("/ventas") ||
//     path.startsWith("/citas");
//   const isLogin = req.nextUrl.pathname.startsWith("/login");

//   if (isPrivate && !token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (isLogin && token) {
//     return NextResponse.redirect(new URL("/welcome", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/welcome/:path*", "/ventas/:path*", "/citas/:path*", "/login"],
// };
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  console.log("🧩 Middleware ejecutado →", path, "| Token:", token ? "✅ Sí hay token" : "❌ No hay token");

  const isPrivate =
    path.startsWith("/dashboard") ||
    path.startsWith("/welcome") ||
    path.startsWith("/ventas") ||
    path.startsWith("/citas");

  const isLogin = path.startsWith("/login");

  if (isPrivate && !token) {
    console.log("🚫 Redirigiendo a /login (ruta privada sin token)");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLogin && token) {
    console.log("🔁 Ya tienes token, redirigiendo a /welcome");
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  console.log("✅ Acceso permitido:", path);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/welcome/:path*", "/ventas/:path*", "/citas/:path*", "/login"],
};
