import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function safeJson(res) {
  const text = await res.text();
  if (!text) return { data: null, text: "" };
  try { return { data: JSON.parse(text), text }; } catch { return { data: null, text }; }
}

export async function PUT(req, { params }) {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const base = process.env.NEXT_PUBLIC_API_BASE_URL; // http://localhost:3000/crm
  if (!base) return NextResponse.json({ error: "Falta NEXT_PUBLIC_API_BASE_URL" }, { status: 500 });

  const r = await fetch(`${base}/citas/${params.id}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  const { data, text } = await safeJson(r);

  if (!r.ok) {
    return NextResponse.json(
      { error: data?.error || data?.message || text || "ERROR_BACKEND" },
      { status: r.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}