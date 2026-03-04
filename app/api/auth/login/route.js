// import { NextResponse } from "next/server"

// export async function POST(req) {
//   const body = await req.json()

//   // Llama a tu backend real
//   const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   })

//   const data = await apiRes.json()

//   if (!apiRes.ok) {
//     return NextResponse.json(data, { status: apiRes.status })
//   }

//   // Backend devuelve { token, usuario }
//   const { token, usuario } = data

//   if (!token) {
//     return NextResponse.json({ error: "LOGIN_SIN_TOKEN" }, { status: 500 })
//   }

//   const res = NextResponse.json({ ok: true, usuario })

//   // ✅ cookie httpOnly para middleware (seguridad)
//   res.cookies.set("token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false,
//     path: "/",
//     maxAge: 60 * 60, // 1h
//   })

//   // ✅ cookie NO httpOnly para UI (rol/nombre); corporativo y práctico
//   // (No guardes info sensible aquí)
//   res.cookies.set("user", JSON.stringify({
//     id: usuario.id,
//     nombre: usuario.nombre,
//     correo: usuario.correo,
//     rol: usuario.rol,
//     departamento: usuario.departamento,
//   }), {
//     httpOnly: false,
//     sameSite: "lax",
//     secure: false,
//     path: "/",
//     maxAge: 60 * 60,
//   })

//   return res
// }
// app/api/auth/login/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const body = await req.json();

//   // 🔹 Llamar al backend
//   const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//     credentials: "include",
//   });

//   const data = await apiRes.json();

//   if (!apiRes.ok) {
//     return NextResponse.json(data, { status: apiRes.status });
//   }

//   // 🔹 Crear respuesta local
//   const res = NextResponse.json({ ok: true, usuario: data.usuario });

//   // 🔹 Copiar cookies del backend al frontend (Render a veces las bloquea)
//   const setCookieHeader = apiRes.headers.get("set-cookie");
//   if (setCookieHeader) {
//     res.headers.set("set-cookie", setCookieHeader);
//   }

//   return res;
// }
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