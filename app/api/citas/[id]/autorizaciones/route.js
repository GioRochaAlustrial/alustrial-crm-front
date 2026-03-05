import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  const { id } = await params
console.log("ID autorizaciones:", id)
console.log(req.text())
  const token = req.cookies.get("token")?.value || ""
let body = {}

try {
  body = await req.json()
} catch {
  body = {}
}
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas/${id}/autorizaciones`, {
    method: "PUT",
    headers: {
      Cookie: `token=${token}`,
      "Content-Type": "application/json",
    },
    body:  JSON.stringify({
    accion: "AUTORIZAR"
  })
  })

  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
