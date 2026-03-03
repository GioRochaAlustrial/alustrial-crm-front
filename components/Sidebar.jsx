"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, ClipboardList, CalendarCheck2, LogOut } from "lucide-react"

export default function Sidebar({ rol = "" }) {
  const pathname = usePathname()

  const role = String(rol || "").trim().toUpperCase()
  const isVentas = role === "VENTAS"
  const isAdmin = role === "ADMIN"
  const isEspe = role === "ESPECIALISTA"
  const isGerente = role === "GERENTE" || role === "DIRECTOR"

  const isActiveExact = (href) => pathname === href
  const isActivePrefix = (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  const espeActive = isActivePrefix("/especialista")

  const itemBase =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition w-full"
  const itemIdle = "text-white/80 hover:bg-white/10 hover:text-white"
  const itemActive =
    "bg-white/10 text-white border-l-4 border-brand-500 pl-3"

  // Ventas se considera “activa” si estás en cualquier ruta /ventas/*
  const ventasActive = isActivePrefix("/ventas")

  return (
    <aside className="w-72 min-h-screen bg-[#03045e] text-white flex flex-col">
      {/* Logo corporativo centrado */}
      <div className="h-32 border-b border-white/10 flex items-center justify-center px-6">
        <Image
          src="/alustrial-logo.png"
          alt="Alustrial"
          width={220}
          height={80}
          className="object-contain w-full h-auto"
          priority
        />
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className={[
            itemBase,
            isActiveExact("/dashboard") ? itemActive : itemIdle,
          ].join(" ")}
        >
          <LayoutDashboard size={18} className={isActiveExact("/dashboard") ? "text-brand-200" : "text-white/80"} />
          <span>Dashboard</span>
        </Link>

        {/* Ventas (solo rol ventas) */}
        {(isVentas || isAdmin) && (
          <div className={`group ${ventasActive ? "bg-white/0" : ""}`}>
            {/* Item principal Ventas */}
            <div
              className={[
                itemBase,
                ventasActive ? itemActive : itemIdle,
                "cursor-pointer select-none",
              ].join(" ")}
            >
              <Briefcase size={18} className={ventasActive ? "text-brand-200" : "text-white/80"} />
              <span className="flex-1">Ventas</span>
              <span className={`text-xs ${ventasActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
                ▾
              </span>
            </div>

            {/* Submenú:
                - visible en hover
                - O visible si estás en /ventas/*
            */}
            <div className={`pl-8 mt-1 space-y-1 ${ventasActive ? "block" : "hidden group-hover:block"}`}>
              <Link
                href="/ventas/clientes"
                className={[
                  itemBase,
                  isActiveExact("/ventas/clientes") ? itemActive : itemIdle,
                ].join(" ")}
              >
                <Users size={17} className={isActiveExact("/ventas/clientes") ? "text-brand-200" : "text-white/80"} />
                <span>Clientes</span>
              </Link>
            </div>
          </div>
        )}
        {/* Proyectos (solo rol especialista) */}
        {(isEspe || isAdmin) && (
          <div className={`group ${espeActive ? "bg-white/0" : ""}`}>
            {/* Item principal Proyectos */}
            <div
              className={[
                itemBase,
                espeActive ? itemActive : itemIdle,
                "cursor-pointer select-none",
              ].join(" ")}
            >
              <ClipboardList size={18} className={espeActive ? "text-brand-200" : "text-white/80"} />
              <span className="flex-1">Proyectos</span>
              <span className={`text-xs ${espeActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
                ▾
              </span>
            </div>

            {/* Submenú */}
            <div className={`pl-8 mt-1 space-y-1 ${espeActive ? "block" : "hidden group-hover:block"}`}>
              <Link
                href="/especialista/citas"
                className={[
                  itemBase,
                  isActiveExact("/especialista/citas") ? itemActive : itemIdle,
                ].join(" ")}
              >
                <CalendarCheck2 size={17} className={isActiveExact("/especialista/citas") ? "text-brand-200" : "text-white/80"} />
                <span>Citas</span>
              </Link>
            </div>
          </div>
        )}

          {/* Gerencia: Autorizaciones */}
          {(isGerente || isAdmin) && (
            <div className={`group ${isActivePrefix("/gerente") ? "bg-white/0" : ""}`}>
              <Link
                href="/gerente/operaciones"
                className={[
                  itemBase,
                  isActiveExact("/gerente/operaciones") ? itemActive : itemIdle,
                ].join(" ")}
              >
                <ClipboardList size={18} className={isActiveExact("/gerente/operaciones") ? "text-brand-200" : "text-white/80"} />
                <span>Gerencia</span>
              </Link>
            </div>
          )}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-white/10">
        <button
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm ${itemIdle}`}
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/login"
          }}
        >
          <LogOut size={18} className="text-white/80" />
          Logout
        </button>
      </div>
    </aside>
  )
}