import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm"

export async function GET() {
  const token = cookies().get("token")?.value

  // Debug útil (solo en dev)
  // console.log("TOKEN EN NEXT:", Boolean(token))

  if (!token) {
    return NextResponse.json({ error: "TOKEN_REQUERIDO" }, { status: 401 })
  }

  const apiRes = await fetch(`${BASE}/prospectos`, {
    method: "GET",
    headers: {
      cookie: `token=${token}`, // ✅ aquí va el token al backend
    },
    cache: "no-store",
  })

  const data = await apiRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: apiRes.status })
}