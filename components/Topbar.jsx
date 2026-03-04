"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Bell, Mail } from "lucide-react"

function initials(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(p => p[0].toUpperCase()).join("")
}

export default function Topbar() {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`)
      if (res.ok) {
        const data = await res.json()
        setUsuario(data.usuario)
      }
    })()
  }, [])

  const avatarSrc = useMemo(() => {
    if (!usuario?.foto_url) return null
    // Si guardas ruta relativa (/uploads/...), tu backend está en :3000
    if (usuario.foto_url.startsWith("/uploads/")) {
      return `http://localhost:3000${usuario.foto_url}`
    }
    // Si guardas URL completa (https://...)
    return usuario.foto_url
  }, [usuario])

  const avatarInitials = initials(usuario?.nombre)

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <button className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" title="Alertas">
          <Bell size={18} className="text-slate-700" />
        </button>

        <button className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" title="Correo">
          <Mail size={18} className="text-slate-700" />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Foto empleado"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm font-semibold text-slate-700">
                {avatarInitials || "?"}
              </span>
            )}
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              {usuario?.nombre || "Empleado"}
            </div>
            <div className="text-xs text-slate-500">
              {usuario?.departamento || "Departamento"}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}