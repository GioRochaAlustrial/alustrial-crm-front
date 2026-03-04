import { NextResponse } from "next/server"

export async function POST(req) {
  const res = NextResponse.json({ ok: true })

  // Borra cookie del FRONT (localhost:3100)
  res.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
  })

  return res
}