import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function safeParse(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export async function PUT(req, { params }) {
  const token = req.cookies.get("token")?.value || "";
  const body = await req.json().catch(() => ({}));
  const { id } = params;

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/citas/${id}/reprogramar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}