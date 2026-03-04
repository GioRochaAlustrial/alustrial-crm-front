import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const token = req.cookies.get("token")?.value || "";
  const body = await req.json().catch(() => ({}));
  const { id } = params;

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas/prospectos/${id}/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}