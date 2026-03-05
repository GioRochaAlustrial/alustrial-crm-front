import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL; 
// ejemplo: https://alustrial-crm-back.onrender.com/crm

export async function GET() {
   const cookieStore = await cookies(); // ← AQUÍ estaba el problema
  const token = cookieStore.get("token")?.value;

  console.log("🔑 Token encontradox:", !!token);

  if (!token) {
    return NextResponse.json(
      { error: "TOKEN_REQUERIDO" },
      { status: 401 }
    );
  }

  try {
    console.log("🌐 Llamando backend:", `${API_URL}/citas/autorizaciones`);
    const res = await fetch(`${API_URL}/citas/autorizaciones`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
console.log("📦 Status backend:", res.status);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("💥 Error llamando backend:", error);

    return NextResponse.json(
      { error: "ERROR_BACKEND", detail: error.message },
      { status: 500 }
    );
  }
}