// import { NextResponse } from "next/server"
// import { cookies } from "next/headers"

// const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm"

// export async function GET() {
//   const token = cookies().get("token")?.value

//   // Debug útil (solo en dev)
//   // console.log("TOKEN EN NEXT:", Boolean(token))

//   if (!token) {
//     return NextResponse.json({ error: "TOKEN_REQUERIDO" }, { status: 401 })
//   }

//   const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prospectos`, {
//     method: "GET",
//     headers: {
//       cookie: `token=${token}`, // ✅ aquí va el token al backend
//       Authorization:  `Bearer ${token}`,
//     },
//     cache: "no-store",
//   })

//   const data = await apiRes.json().catch(() => ({}))
//   return NextResponse.json(data, { status: apiRes.status })
// }
import { NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm";

export async function GET() {
  const cookieStore = await nextCookies();
  const token = cookieStore.get("token")?.value;

  console.log("🧠 [API/prospectos] Token presente:", !!token);

  if (!token) {
    console.error("🚫 No hay token en cookies");
    return NextResponse.json({ error: "TOKEN_REQUERIDO" }, { status: 401 });
  }

  try {
    console.log("🌐 Fetching:", `${process.env.NEXT_PUBLIC_API_URL}/prospectos`);
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prospectos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("📦 Respuesta del backend:", apiRes.status);
    const text = await apiRes.text();
    console.log("📨 Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error("💥 Error en /api/prospectos:", err);
    return NextResponse.json(
      { error: "ERROR_INTERNO", details: err.message },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  const cookieStore = await nextCookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Token no encontrado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prospectos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
    const data = await apiRes.json().catch(() => ({}));
  return Response.json(data, { status: apiRes.status });
}