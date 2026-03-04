import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const token = req.cookies.get("token")?.value || "";
  const body = await req.json().catch(() => ({}));

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas/${params.id}/estado`, {
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