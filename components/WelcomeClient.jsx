"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function safeJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function Card({ title, desc, href }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition"
    >
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
      <div className="mt-4 text-sm font-medium text-blue-700">Abrir →</div>
    </Link>
  );
}

export default function WelcomeClient() {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    (async () => {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, { cache: "no-store" });
      const data = await safeJson(r);
      if (r.ok) {
        setNombre(data?.nombre || "");
        setRol((data?.rol || "").toUpperCase());
      }
    })();
  }, []);

  const canVentas = rol === "VENTAS" || rol === "ADMIN";
  const canCitas = rol === "ESPECIALISTA" || rol === "ADMIN";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        Bienvenido{nombre ? `, ${nombre}` : ""}
      </h1>
      <p className="mt-2 text-slate-600">
        {rol ? (
          <>
            Rol actual: <span className="font-medium text-slate-900">{rol}</span>
          </>
        ) : (
          "Cargando tu perfil…"
        )}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card
          title="Dashboard"
          desc="Resumen general y métricas principales."
          href="/dashboard"
        />

        {canVentas && (
          <Card
            title="Ventas"
            desc="Gestión de oportunidades y seguimiento comercial."
            href="/ventas"
          />
        )}

        {canCitas && (
          <Card
            title="Citas"
            desc="Agenda, confirmaciones y cierre de citas."
            href="/citas"
          />
        )}
      </div>
    </div>
  );
}
