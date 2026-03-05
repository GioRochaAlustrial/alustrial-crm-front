// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Check, X } from "lucide-react";

// export default function GerenteOperaciones() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filtro, setFiltro] = useState("TODAS");
//   const [q, setQ] = useState("");

//   const pendientes = useMemo(
//     () => items.filter((i) => i.auth_estado === "PENDIENTE").length,
//     [items]
//   );
//   const autorizadas = useMemo(
//     () => items.filter((i) => i.auth_estado === "AUTORIZADA").length,
//     [items]
//   );
//   const rechazadas = useMemo(
//     () => items.filter((i) => i.auth_estado === "RECHAZADA").length,
//     [items]
//   );

//   const itemsFiltrados = useMemo(() => {
//     const qNorm = q.trim().toLowerCase();

//     return items.filter((i) => {
//       if (filtro !== "TODAS" && i.auth_estado !== filtro) return false;
//       if (!qNorm) return true;

//       const empresa = String(i.empresa || "").toLowerCase();
//       const contacto = String(i.nombre || "").toLowerCase();
//       const nota = String(i.nota || "").toLowerCase();

//       return empresa.includes(qNorm) || contacto.includes(qNorm) || nota.includes(qNorm);
//     });
//   }, [items, filtro, q]);

//   async function load() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/citas/autorizaciones", { cache: "no-store" });
//       if (res.ok) {
//         const data = await res.json();
//         setItems(Array.isArray(data) ? data : []);
//       } else {
//         setItems([]);
//       }
//     } catch {
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function doAutorizar(id) {
//     const ok = window.confirm("¿Autorizar esta visita comercial?");
//     if (!ok) return;

//     try {
//       const res = await fetch(`/api/citas/${id}/autorizar`, { method: "PUT" });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Error al autorizar la cita");
//         return;
//       }
//       load();
//     } catch {
//       alert("Error de conexión con el servidor");
//     }
//   }

//   async function doRechazar(id) {
//     const motivo = window.prompt("Motivo de rechazo:");
//     if (motivo === null) return;
//     if (!motivo.trim()) return alert("Debes indicar un motivo de rechazo");

//     try {
//       const res = await fetch(`/api/citas/${id}/rechazar`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ motivo }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Error al rechazar la cita");
//         return;
//       }

//       load();
//     } catch {
//       alert("Error de conexión con el servidor");
//     }
//   }

//   function renderEstadoBadge(estado) {
//     const e = String(estado || "").toUpperCase();

//     if (e === "AUTORIZADA") {
//       return (
//         <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
//           Autorizada
//         </span>
//       );
//     }

//     if (e === "RECHAZADA") {
//       return (
//         <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
//           Rechazada
//         </span>
//       );
//     }

//     return (
//       <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
//         Pendiente
//       </span>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Autorizaciones</h1>

//       {/* contadores */}
//       <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="rounded-lg border bg-amber-50 p-4">
//           <div className="text-sm text-amber-700">Pendientes</div>
//           <div className="text-2xl font-semibold text-amber-900">{pendientes}</div>
//         </div>

//         <div className="rounded-lg border bg-emerald-50 p-4">
//           <div className="text-sm text-emerald-700">Autorizadas</div>
//           <div className="text-2xl font-semibold text-emerald-900">{autorizadas}</div>
//         </div>

//         <div className="rounded-lg border bg-rose-50 p-4">
//           <div className="text-sm text-rose-700">Rechazadas</div>
//           <div className="text-2xl font-semibold text-rose-900">{rechazadas}</div>
//         </div>
//       </div>

//       {/* buscador + filtros */}
//       <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div className="flex-1">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Buscar por empresa, contacto o nota…"
//             className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
//           />
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           <button
//             type="button"
//             onClick={() => setFiltro("TODAS")}
//             className={`px-3 py-2 rounded-md border text-sm ${
//               filtro === "TODAS" ? "bg-slate-800 text-white" : "bg-white"
//             }`}
//           >
//             Todas
//           </button>

//           <button
//             type="button"
//             onClick={() => setFiltro("PENDIENTE")}
//             className={`px-3 py-2 rounded-md border text-sm ${
//               filtro === "PENDIENTE" ? "bg-amber-500 text-white" : "bg-white"
//             }`}
//           >
//             Pendientes
//           </button>

//           <button
//             type="button"
//             onClick={() => setFiltro("AUTORIZADA")}
//             className={`px-3 py-2 rounded-md border text-sm ${
//               filtro === "AUTORIZADA" ? "bg-emerald-600 text-white" : "bg-white"
//             }`}
//           >
//             Autorizadas
//           </button>

//           <button
//             type="button"
//             onClick={() => setFiltro("RECHAZADA")}
//             className={`px-3 py-2 rounded-md border text-sm ${
//               filtro === "RECHAZADA" ? "bg-rose-600 text-white" : "bg-white"
//             }`}
//           >
//             Rechazadas
//           </button>
//         </div>
//       </div>

//       {loading && <div>Cargando...</div>}

//       {!loading && items.length === 0 && <div>No hay autorizaciones.</div>}

//       {!loading && items.length > 0 && (
//         <div className="overflow-x-auto rounded-lg border">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-50 border-b">
//               <tr className="text-left text-sm font-semibold text-slate-600">
//                 <th className="p-3 w-12">#</th>
//                 <th className="p-3">Empresa</th>
//                 <th className="p-3">Contacto</th>
//                 <th className="p-3 w-44">Fecha / Hora</th>
//                 <th className="p-3">Nota</th>
//                 <th className="p-3 w-32">Estado</th>
//                 <th className="p-3 w-28 text-center">Acciones</th>
//               </tr>
//             </thead>

//             <tbody>
//               {itemsFiltrados.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center text-slate-500">
//                     No hay resultados para el filtro/búsqueda actual.
//                   </td>
//                 </tr>
//               ) : (
//                 itemsFiltrados.map((it, index) => (
//                   <tr key={it.id} className="border-t hover:bg-slate-50 transition">
//                     <td className="p-3 text-slate-700">{index + 1}</td>
//                     <td className="p-3 font-medium">{it.empresa || "-"}</td>
//                     <td className="p-3">{it.nombre || "-"}</td>
//                     <td className="p-3">{new Date(it.fecha_hora).toLocaleString()}</td>
//                     <td className="p-3 max-w-[420px] whitespace-pre-wrap break-words">
//                       {it.nota?.trim() ? it.nota : "-"}
//                     </td>
//                     <td className="p-3">{renderEstadoBadge(it.auth_estado)}</td>

//                     <td className="p-3">
//                       {String(it.auth_estado).toUpperCase() === "PENDIENTE" ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             type="button"
//                             title="Autorizar"
//                             aria-label="Autorizar"
//                             onClick={() => doAutorizar(it.id)}
//                             className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
//                           >
//                             <Check size={18} />
//                           </button>

//                           <button
//                             type="button"
//                             title="Rechazar"
//                             aria-label="Rechazar"
//                             onClick={() => doRechazar(it.id)}
//                             className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700"
//                           >
//                             <X size={18} />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="text-center text-slate-400">—</div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export default function GerenteOperaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);       // solo primera carga
  const [refreshing, setRefreshing] = useState(false); // refrescos posteriores
  const [filtro, setFiltro] = useState("TODAS");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const pendientes = useMemo(
    () => items.filter((i) => i.auth_estado === "PENDIENTE").length,
    [items]
  );
  const autorizadas = useMemo(
    () => items.filter((i) => i.auth_estado === "AUTORIZADA").length,
    [items]
  );
  const rechazadas = useMemo(
    () => items.filter((i) => i.auth_estado === "RECHAZADA").length,
    [items]
  );
  const itemsFiltrados = useMemo(() => {
    const qNorm = q.trim().toLowerCase();

    return items.filter((i) => {
      if (filtro !== "TODAS" && i.auth_estado !== filtro) return false;
      if (!qNorm) return true;

      const empresa = String(i.empresa || "").toLowerCase();
      const contacto = String(i.nombre || "").toLowerCase();
      const nota = String(i.nota || "").toLowerCase();

      return empresa.includes(qNorm) || contacto.includes(qNorm) || nota.includes(qNorm);
    });
  }, [items, filtro, q]);

  const inFlightRef = useRef(false);

  async function load({ silent = false } = {}) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const hasData = items.length > 0;
    if (silent || hasData) setRefreshing(true);
    else setLoading(true);
      console.log("/api/citas/autorizaciones")
    try {
      const res = await fetch("/api/citas/autorizaciones", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      console.log("DATA:", data);
      if (!res.ok) {
        setError(data?.error || `Error ${res.status}`);
        if (!hasData) setItems([]);
        return;
      }

      setError("");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Error de red");
    } finally {
      setLoading(false);
      setRefreshing(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    load({ silent: false }); // 👈 primera carga

    const onNotifsChanged = () => load({ silent: true });
    window.addEventListener("crm:notifs-changed", onNotifsChanged);

    return () => window.removeEventListener("crm:notifs-changed", onNotifsChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doAutorizar(id) {
    const ok = window.confirm("¿Autorizar esta visita comercial?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/citas/${id}/autorizar`, { method: "PUT" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Error al autorizar la cita");
        return;
      }
      await load({ silent: true });
      window.dispatchEvent(new CustomEvent("crm:notifs-changed"));
    } catch {
      alert("Error de conexión con el servidor");
    }
  }

  async function doRechazar(id) {
    const motivo = window.prompt("Motivo de rechazo:");
    if (motivo === null) return;
    if (!motivo.trim()) return alert("Debes indicar un motivo de rechazo");

    try {
      const res = await fetch(`/api/citas/${id}/rechazar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Error al rechazar la cita");
        return;
      }

      await load({ silent: true });
      window.dispatchEvent(new CustomEvent("crm:notifs-changed"));
    } catch {
      alert("Error de conexión con el servidor");
    }
  }

  function renderEstadoBadge(estado) {
    const e = String(estado || "").toUpperCase();

    if (e === "AUTORIZADA") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
          Autorizada
        </span>
      );
    }

    if (e === "RECHAZADA") {
      return (
        <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
          Rechazada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
        Pendiente
      </span>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Autorizaciones</h1>

      {/* contadores */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-amber-50 p-4">
          <div className="text-sm text-amber-700">Pendientes</div>
          <div className="text-2xl font-semibold text-amber-900">{pendientes}</div>
        </div>

        <div className="rounded-lg border bg-emerald-50 p-4">
          <div className="text-sm text-emerald-700">Autorizadas</div>
          <div className="text-2xl font-semibold text-emerald-900">{autorizadas}</div>
        </div>

        <div className="rounded-lg border bg-rose-50 p-4">
          <div className="text-sm text-rose-700">Rechazadas</div>
          <div className="text-2xl font-semibold text-rose-900">{rechazadas}</div>
        </div>
      </div>

      {/* buscador + filtros */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por empresa, contacto o nota…"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFiltro("TODAS")}
            className={`px-3 py-2 rounded-md border text-sm ${filtro === "TODAS" ? "bg-slate-800 text-white" : "bg-white"
              }`}
          >
            Todas
          </button>

          <button
            type="button"
            onClick={() => setFiltro("PENDIENTE")}
            className={`px-3 py-2 rounded-md border text-sm ${filtro === "PENDIENTE" ? "bg-amber-500 text-white" : "bg-white"
              }`}
          >
            Pendientes
          </button>

          <button
            type="button"
            onClick={() => setFiltro("AUTORIZADA")}
            className={`px-3 py-2 rounded-md border text-sm ${filtro === "AUTORIZADA" ? "bg-emerald-600 text-white" : "bg-white"
              }`}
          >
            Autorizadas
          </button>

          <button
            type="button"
            onClick={() => setFiltro("RECHAZADA")}
            className={`px-3 py-2 rounded-md border text-sm ${filtro === "RECHAZADA" ? "bg-rose-600 text-white" : "bg-white"
              }`}
          >
            Rechazadas
          </button>
        </div>
      </div>

      {/* ✅ Solo primera carga muestra "Cargando..." */}
      {loading && <div className="text-slate-600">Cargando...</div>}

      {/* ✅ Cuando ya cargó una vez, NO escondas la tabla nunca */}
      {!loading && items.length === 0 && (
        <div className="text-slate-600">No hay autorizaciones.</div>
      )}

      {items.length > 0 && (
        <div className="relative overflow-x-auto rounded-lg border">
          {/* ✅ Overlay suave en refresh (sin desmontar tabla) */}
          {refreshing && (
            <div className="absolute inset-0 z-10 bg-white/45 backdrop-blur-[1px] flex items-start justify-end p-3">
              <div className="rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                Actualizando…
              </div>
            </div>
          )}

          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-sm font-semibold text-slate-600">
                <th className="p-3 w-12">#</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Contacto</th>
                <th className="p-3 w-44">Fecha / Hora</th>
                <th className="p-3">Nota</th>
                <th className="p-3 w-32">Estado</th>
                <th className="p-3 w-28 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {itemsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No hay resultados para el filtro/búsqueda actual.
                  </td>
                </tr>
              ) : (
                itemsFiltrados.map((it, index) => (
                  <tr key={it.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-3 text-slate-700">{index + 1}</td>
                    <td className="p-3 font-medium">{it.empresa || "-"}</td>
                    <td className="p-3">{it.nombre || "-"}</td>
                    <td className="p-3">{new Date(it.fecha_hora).toLocaleString()}</td>
                    <td className="p-3 max-w-[420px] whitespace-pre-wrap break-words">
                      {it.nota?.trim() ? it.nota : "-"}
                    </td>
                    <td className="p-3">{renderEstadoBadge(it.auth_estado)}</td>

                    <td className="p-3">
                      {String(it.auth_estado).toUpperCase() === "PENDIENTE" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="Autorizar"
                            aria-label="Autorizar"
                            onClick={() => doAutorizar(it.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            type="button"
                            title="Rechazar"
                            aria-label="Rechazar"
                            onClick={() => doRechazar(it.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400">—</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}