import { NextResponse } from "next/server"

export async function POST(req) {
  const body = await req.json()

  // Llama a tu backend real
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await apiRes.json()

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status })
  }

  // Backend devuelve { token, usuario }
  const { token, usuario } = data

  if (!token) {
    return NextResponse.json({ error: "LOGIN_SIN_TOKEN" }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true, usuario })

  // ✅ cookie httpOnly para middleware (seguridad)
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60, // 1h
  })

  // ✅ cookie NO httpOnly para UI (rol/nombre); corporativo y práctico
  // (No guardes info sensible aquí)
  res.cookies.set("user", JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    departamento: usuario.departamento,
    cargo: usuario.cargo,
  }), {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  })

  return res
}