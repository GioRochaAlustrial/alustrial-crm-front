import { NextResponse } from "next/server"

export async function GET(req) {
  const token = req.cookies.get("token")?.value || ""

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`, // 👈 solo el token
    },
  })

  const data = await apiRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: apiRes.status })
}