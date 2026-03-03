import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/crm"

export async function GET() {
  const token = cookies().get("token")?.value
  if (!token) return NextResponse.json({ error: "TOKEN_REQUERIDO" }, { status: 401 })

  const r = await fetch(`${BASE}/prospectos`, {
    method: "GET",
    headers: { cookie: `token=${token}` },
    cache: "no-store",
  })

  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}

export async function PUT(req, { params }) {
  const cookie = req.headers.get("cookie") || ""
  const body = await req.json().catch(() => ({}))

  const r = await fetch(`${BASE}/prospectos/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie, // ✅ reenvía token al backend
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const data = await r.text()
  return new NextResponse(data, {
    status: r.status,
    headers: { "content-type": "application/json" },
  })
}