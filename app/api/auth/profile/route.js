import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // const rawNombre = cookies().get("usuario_nombre")?.value || "";
  // const rol = cookies().get("usuario_rol")?.value || "";
const cookieStore = await cookies();
  const rawNombre = cookieStore.get("usuario_nombre")?.value || "";
  const rol = cookieStore.get("usuario_rol")?.value || "";
  const nombre = rawNombre ? decodeURIComponent(rawNombre) : "";

  return NextResponse.json({
    nombre,
    rol,
  });
}