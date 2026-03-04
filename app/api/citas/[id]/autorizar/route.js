import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  const token = req.cookies.get("token")?.value || ""

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/citas/${params.id}/autorizar`, {
    method: "PUT",
    headers: {
      Cookie: `token=${token}`,
      "Content-Type": "application/json",
    },
    body: await req.text(),
  })

  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
