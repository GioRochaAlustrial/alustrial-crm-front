import { NextResponse } from "next/server";
export { GET, POST, PUT, PATCH, DELETE } from "./[...slug]/route";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm";

export async function GET(req) {
  const token = req.cookies.get("token")?.value || "";

  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") || "";
  const estado = searchParams.get("estado") || "";

  const qs = new URLSearchParams();
  if (tipo) qs.set("tipo", tipo);
  if (estado) qs.set("estado", estado);

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas?${qs.toString()}`, {
    method: "GET",
    headers: { Cookie: `token=${token}` },
  });

  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}