import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  const token = req.cookies.get("token")?.value || ""
  const body = await req.json().catch(() => ({}))

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas/${params.id}/rechazar`, {
    method: "PUT",
    headers: {
      Cookie: `token=${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
