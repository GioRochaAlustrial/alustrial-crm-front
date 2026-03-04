"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareText, CheckCircle2, RefreshCw } from "lucide-react";

function formatFechaHora(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function EspecialistaCitasPageClient() {
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const departamento = useMemo(() => {
    const u = me?.user || me;
    return (u?.departamento || u?.tipo_proyecto || u?.area || "").toString().toUpperCase();
  }, [me]);

  async function loadMe() {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "No auth");
    setMe(data);
  }

  async function loadCitas() {
    try {
      setError("");
      setLoading(true);

      if (!departamento) {
        setRows([]);
        return;
      }

      const res = await fetch(`/api/citas?tipo=${encodeURIComponent(departamento)}&estado=PROGRAMADA`, {
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Error cargando citas: ${res.status}`);

      setRows(Array.isArray(data) ? data : (data?.citas || []));
    } catch (e) {
      setError(e?.message || "Error inesperado");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function marcarRealizada(citaId) {
    try {
      setError("");

      const res = await fetch(`/api/citas/${citaId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "REALIZADA" }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `No se pudo actualizar: ${res.status}`);

      await loadCitas();
    } catch (e) {
      setError(e?.message || "Error inesperado");
    }
  }

  useEffect(() => {
    loadMe().catch((e) => setError(e?.message || "NO_AUTH"));
  }, []);

  useEffect(() => {
    if (me) loadCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, departamento]);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Citas</h1>
          <p className="text-slate-500">
            {departamento ? `Departamento: ${departamento}` : "Sin departamento asignado"}
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
          onClick={loadCitas}
          type="button"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Empresa</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Fecha / Hora</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Nota</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="p-6 text-slate-500" colSpan={7}>Cargando…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-6 text-slate-500" colSpan={7}>No hay citas.</td></tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{r.empresa}</td>
                  <td className="p-3">{r.nombre}</td>
                  <td className="p-3">{formatFechaHora(r.fecha_hora)}</td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs">
                      {r.tipo}
                    </span>
                  </td>

                  <td className="p-3">
                    {r.nota && String(r.nota).trim() ? (
                      <div className="relative group w-fit">
                        <button type="button" className="text-slate-400 hover:text-slate-600" title="Ver nota">
                          <MessageSquareText className="w-4 h-4" />
                        </button>
                        <div className="absolute z-20 hidden group-hover:block top-6 left-0 w-72 max-h-40 overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl p-3 text-xs text-slate-700">
                          {r.nota}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                      onClick={() => marcarRealizada(r.id)}
                      type="button"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar realizada
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}