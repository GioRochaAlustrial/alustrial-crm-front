import { cookies } from "next/headers";

export function getSession() {
  const c = cookies();

  return {
    nombre: c.get("usuario_nombre")?.value || "",
    rol: c.get("usuario_rol")?.value || "",
    avatarUrl: c.get("usuario_avatar")?.value || null,
  };
}