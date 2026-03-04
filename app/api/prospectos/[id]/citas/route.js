import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function safeJson(res) {
  const text = await res.text();
  if (!text) return { data: null, text: "" };
  try {
    return { data: JSON.parse(text), text };
  } catch {
    return { data: null, text };
  }
}

export async function POST(req, { params }) {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const base = process.env.NEXT_PUBLIC_API_URL; // ej: http://localhost:3000/crm
  if (!base) return NextResponse.json({ error: "Falta NEXT_PUBLIC_API_URL" }, { status: 500 });

  const body = await req.json();

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prospectos/${params.id}/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const { data, text } = await safeJson(r);

  if (!r.ok) {
    return NextResponse.json(
      { error: data?.error || data?.message || text || "ERROR_BACKEND" },
      { status: r.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}