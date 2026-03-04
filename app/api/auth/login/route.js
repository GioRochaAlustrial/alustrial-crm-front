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
//     console.log("🟢 [LOGIN ROUTE] Recibida petición de login en el proxy");

//   const body = await req.json();
//   console.log("🟢 [LOGIN ROUTE] Recibida petición de login en el proxy");

//   // 🔹 Llamar al backend
//   const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//     credentials: "include",
//   });
// console.log("🌐 [BACKEND] Status:", apiRes.status);
 
//   const data = await apiRes.json();

//   if (!apiRes.ok) {
//     return NextResponse.json(data, { status: apiRes.status });
//   }

//   // 🔹 Crear respuesta local
//   const res = NextResponse.json({ ok: true, usuario: data.usuario });

//   // 🔹 Copiar cookies del backend al frontend (Render a veces las bloquea)
//   const setCookieHeader = apiRes.headers.get("set-cookie");
//     console.log("🍪 [BACKEND] Set-Cookie recibido:", setCookieHeader ? "✅ Sí" : "❌ No");

//   if (setCookieHeader) {
//     res.headers.set("set-cookie", setCookieHeader);
//   }

//   return res;
// }
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("🟢 [LOGIN ROUTE] Recibida petición de login en el proxy");

  const body = await req.json();
  console.log("📦 Body recibido:", body);
console.log(process.env.NEXT_PUBLIC_API_URL)
  try {
    // Llamada al backend real
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include", // 👈 importante para cookies cross-domain
    });

    console.log("🌐 [BACKEND] Status:", apiRes.status);

    // Muestra si el backend está enviando cookies
    const setCookieHeader = apiRes.headers.get("set-cookie");
    console.log("🍪 [BACKEND] Set-Cookie recibido:", setCookieHeader ? "✅ Sí" : "❌ No");

    const data = await apiRes.json().catch(() => ({}));
    console.log("📨 [BACKEND] Data recibida:", data);

    if (!apiRes.ok) {
      console.log("⚠️ [LOGIN ROUTE] Backend devolvió error:", data);
      return NextResponse.json(data, { status: apiRes.status });
    }

    const res = NextResponse.json({ ok: true, usuario: data.usuario });

    // Copiamos cookie del backend al front
    if (setCookieHeader) {
      res.headers.set("set-cookie", setCookieHeader);
      console.log("✅ [LOGIN ROUTE] Cookie reenviada al cliente");
    } else {
      console.log("🚫 [LOGIN ROUTE] No se encontró cookie que reenviar");
    }

    console.log("✅ [LOGIN ROUTE] Respuesta final enviada al navegador");
    return res;

  } catch (err) {
    console.error("💥 [LOGIN ROUTE] Error general:", err);
    return NextResponse.json({ error: "Error interno en proxy login" }, { status: 500 });
  }
}