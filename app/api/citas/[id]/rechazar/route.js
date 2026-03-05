import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  const { id } = await params
console.log("ID autorizaciones:", id)
  const token = req.cookies.get("token")?.value || ""
  const body = await req.json().catch(() => ({}))
  console.log
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas/${id}/autorizaciones`, {
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
