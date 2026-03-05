// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import { Bell, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );
//   // const { data } = supabase.storage.from("planos").getPublicUrl(path);
//   // console.log(data.publicUrl);
//   console.log(supabase)
// export async function uploadFile(file) {
//   const { data, error } = await supabase.storage
//     .from("planos")
//     .upload(`planos/${Date.now()}-${file.name}`, file);

//   if (error) throw error;
//   return data.path;
// }
// function initials(fullName = "") {
//   const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
//   return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
// }

// function getCookie(name) {
//   if (typeof document === "undefined") return null;
//   const parts = document.cookie.split("; ").map((c) => c.split("="));
//   const found = parts.find(([k]) => k === name);
//   return found ? found.slice(1).join("=") : null;
// }

// function prettyCargo(c) {
//   const raw = String(c || "").trim();
//   if (!raw) return "";
//   return raw
//     .toLowerCase()
//     .split("_")
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");
// }

// function parsePayload(payload) {
//   try {
//     return typeof payload === "string" ? JSON.parse(payload) : (payload || {});
//   } catch {
//     return {};
//   }
// }

// function formatDate(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toLocaleString();
// }

// export default function Topbar() {
//   const [usuario, setUsuario] = useState(null);

//   const [notifCount, setNotifCount] = useState(0);
//   const [notifs, setNotifs] = useState([]);
//   const [notifLoading, setNotifLoading] = useState(false);

//   const [openNotifs, setOpenNotifs] = useState(false);
//   const [pulse, setPulse] = useState(false);

//   const rootRef = useRef(null);
//   const prevCountRef = useRef(0);

//   // ✅ Cargar usuario desde cookie `user`
//   console.log("cargar cookie user")
// //   useEffect(() => {
// //  console.log("cargar cookie user2")
// //     const raw = getCookie("user");
// //     console.log('raw')
// //     console.log(raw)
// //     if (!raw) return;

// //     try {
// //       const decoded = decodeURIComponent(raw);
// //       const u = JSON.parse(decoded);
// //       setUsuario(u);
// //     } catch (e) {
// //       // Si falla, deja fallback
// //       console.log("No pude parsear cookie user:", e);
// //     }
// //   }, []);
// useEffect(() => {
//     ;(async () => {
//       const res = await fetch("/api/auth/me")
//       if (res.ok) {
//         const data = await res.json()
//         setUsuario(data.usuario)
//       }
//     })()
//   }, [])
//   // ✅ Avatar
//   const avatarSrc = useMemo(() => {
//     if (!usuario?.foto_url) return null;
//     if (usuario.foto_url.startsWith("/uploads/")) return `http://localhost:3000${usuario.foto_url}`;
//     return usuario.foto_url;
//   }, [usuario]);

//   const avatarInitials = initials(usuario?.nombre);

//   // ✅ Fetch de notifs (reutilizable)
//   const fetchNotifs = async () => {
//     setNotifLoading(true);
//     try {
//       const res = await fetch("/api/notificaciones?only_unread=true&limit=50", { cache: "no-store" });
//       if (!res.ok) return;

//       const data = await res.json().catch(() => null);
//       const arr = Array.isArray(data) ? data : (data?.items || []);
//       setNotifs(arr);
//       setNotifCount(arr.length);

//       // ✅ pulse si sube el contador
//       const prev = prevCountRef.current;
//       if (arr.length > prev) {
//         setPulse(true);
//         setTimeout(() => setPulse(false), 1200);
//       }
//       prevCountRef.current = arr.length;
//     } finally {
//       setNotifLoading(false);
//     }
//   };

//   // ✅ Poll cada 10s (solo contador/lista)
//   useEffect(() => {
//     fetchNotifs();
//     const id = setInterval(fetchNotifs, 10000);
//     return () => clearInterval(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ✅ Refresca al abrir dropdown (CRM feel)
//   useEffect(() => {
//     if (openNotifs) fetchNotifs();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [openNotifs]);

//   // ✅ Cerrar al click fuera + ESC
//   useEffect(() => {
//     if (!openNotifs) return;

//     const onClick = (e) => {
//       if (!rootRef.current) return;
//       if (!rootRef.current.contains(e.target)) setOpenNotifs(false);
//     };

//     const onKey = (e) => {
//       if (e.key === "Escape") setOpenNotifs(false);
//     };

//     document.addEventListener("mousedown", onClick);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onClick);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [openNotifs]);

//   // (Opcional) marcar como leída si tu API lo soporta.
//   // Si no existe, NO rompe: solo actualiza UI local.
//   async function markReadLocalFirst(id) {
//     setNotifs((prev) => prev.filter((n) => n.id !== id));
//     setNotifCount((c) => Math.max(0, c - 1));

//     // Intentos comunes (si alguno existe en tu backend/proxy)
//     const candidates = [
//       `/api/notificaciones/${id}/leer`,
//       `/api/notificaciones/${id}/leida`,
//       `/api/notificaciones/${id}`,
//     ];

//     for (const url of candidates) {
//       try {
//         const res = await fetch(url, { method: "PUT" });
//         if (res.ok) break;
//       } catch {
//         // ignore
//       }
//     }
//   }

//   function notifMeta(n) {
//     const tipo = String(n?.tipo || "").toUpperCase();
//     const p = parsePayload(n?.payload);

//     if (tipo === "CITA_COMERCIAL_PENDIENTE_AUTORIZACION") {
//       return {
//         icon: <Clock className="h-4 w-4 text-amber-600" />,
//         title: "Cita comercial pendiente",
//         subtitle: p?.fecha_hora ? `Fecha: ${formatDate(p.fecha_hora)}` : "Requiere autorización",
//         href: "/gerente/operaciones",
//       };
//     }

//     return {
//       icon: <CheckCircle2 className="h-4 w-4 text-slate-500" />,
//       title: n?.tipo || "Notificación",
//       subtitle: "",
//       href: "/dashboard",
//     };
//   }

//   return (
//     <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-end">
//       <div className="flex items-center gap-3" ref={rootRef}>
//         {/* 🔔 Campana + Dropdown */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setOpenNotifs((v) => !v)}
//             className="relative h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
//             title="Notificaciones"
//             aria-label="Notificaciones"
//           >
//             <Bell size={18} className="text-slate-700" />

//             {notifCount > 0 && (
//               <span
//                 className={`absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white ${
//                   pulse ? "animate-pulse" : ""
//                 }`}
//               >
//                 {notifCount > 99 ? "99+" : notifCount}
//               </span>
//             )}
//           </button>

//           {openNotifs && (
//             <div className="absolute right-0 mt-2 w-[380px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
//               <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
//                 <div>
//                   <div className="text-sm font-semibold text-slate-900">Notificaciones</div>
//                   <div className="text-xs text-slate-500">
//                     {notifCount ? `${notifCount} sin leer` : "Sin pendientes"}
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setOpenNotifs(false)}
//                   className="text-xs text-slate-600 hover:text-slate-900"
//                 >
//                   Cerrar
//                 </button>
//               </div>

//               {notifLoading ? (
//                 <div className="px-4 py-6 text-sm text-slate-500">Cargando…</div>
//               ) : notifs.length === 0 ? (
//                 <div className="px-4 py-6 text-sm text-slate-500">
//                   No tienes notificaciones pendientes.
//                 </div>
//               ) : (
//                 <ul className="max-h-80 overflow-auto">
//                   {notifs.slice(0, 20).map((n) => {
//                     const meta = notifMeta(n);
//                     return (
//                       <li key={n.id} className="border-b last:border-b-0">
//                         <div className="px-4 py-3 hover:bg-slate-50 flex items-start gap-3">
//                           <div className="mt-0.5">{meta.icon}</div>

//                           <button
//                             type="button"
//                             onClick={() => {
//                               window.location.href = meta.href;
//                               setOpenNotifs(false);
//                             }}
//                             className="flex-1 text-left"
//                           >
//                             <div className="text-sm font-medium text-slate-900">{meta.title}</div>
//                             {meta.subtitle && (
//                               <div className="mt-1 text-xs text-slate-600">{meta.subtitle}</div>
//                             )}
//                           </button>

//                           {/* (Opcional) marcar como leída */}
//                           <button
//                             type="button"
//                             onClick={() => markReadLocalFirst(n.id)}
//                             className="text-xs text-slate-500 hover:text-slate-900"
//                             title="Marcar como leída"
//                           >
//                             <XCircle className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}

//               <div className="px-4 py-3 border-t bg-white">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     window.location.href = "/gerente/operaciones";
//                     setOpenNotifs(false);
//                   }}
//                   className="w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
//                 >
//                   Ver autorizaciones
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ✉️ Mail (placeholder) */}
//         <button
//           type="button"
//           className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
//           title="Correo"
//           aria-label="Correo"
//         >
//           <Mail size={18} className="text-slate-700" />
//         </button>

//         {/* 👤 Avatar + Nombre + Cargo • Depto */}
//         <div className="flex items-center gap-3 pl-2">
//           <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
//             {avatarSrc ? (
//               <Image
//                 src={avatarSrc}
//                 alt="Foto empleado"
//                 width={40}
//                 height={40}
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <span className="text-sm font-semibold text-slate-700">
//                 {avatarInitials || "?"}
//               </span>
//             )}
//           </div>

//           <div className="leading-tight text-right">
//             <div className="text-sm font-semibold text-slate-900">
//               {usuario?.nombre?.trim() || "Empleado"}
//             </div>
//             <div className="text-xs text-slate-500">
//               {(prettyCargo(usuario?.cargo) || "Cargo")}{" "}
//               <span className="text-slate-300">•</span>{" "}
//               {(usuario?.departamento || "Departamento")}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Bell, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";

function initials(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ").map((c) => c.split("="));
  const found = parts.find(([k]) => k === name);
  return found ? found.slice(1).join("=") : null;
}

function prettyCargo(c) {
  const raw = String(c || "").trim();
  if (!raw) return "";
  return raw
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parsePayload(payload) {
  try {
    return typeof payload === "string" ? JSON.parse(payload) : (payload || {});
  } catch {
    return {};
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function Topbar() {
  const [usuario, setUsuario] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [openNotifs, setOpenNotifs] = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevSigRef = useRef(""); // firma por ids
  const rootRef = useRef(null);
  const prevCountRef = useRef(0);

  // ✅ Cargar usuario desde cookie `user`
  useEffect(() => {
    const raw = getCookie("user");
    if (!raw) return;

    try {
      const decoded = decodeURIComponent(raw);
      const u = JSON.parse(decoded);
      setUsuario(u);
    } catch (e) {
      // Si falla, deja fallback
      console.log("No pude parsear cookie user:", e);
    }
  }, []);

  // ✅ Avatar
  const avatarSrc = useMemo(() => {
    if (!usuario?.foto_url) return null;
    if (usuario.foto_url.startsWith("/uploads/")) return `http://localhost:3000${usuario.foto_url}`;
    return usuario.foto_url;
  }, [usuario]);

  const avatarInitials = initials(usuario?.nombre);

  // ✅ Fetch de notifs (reutilizable)
  const fetchNotifs = async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/notificaciones?only_unread=true&limit=50", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json().catch(() => null);
      const arr = Array.isArray(data) ? data : (data?.items || []);
      const sig = arr.map(n => n.id).join(",");

      setNotifs(arr);
      setNotifCount(arr.length);

      // ✅ Disparar evento global si cambió la lista (ids)
      if (sig !== prevSigRef.current) {
        prevSigRef.current = sig;

        window.dispatchEvent(
          new CustomEvent("crm:notifs-changed", {
            detail: { count: arr.length, ids: arr.map(n => n.id) },
          })
        );
      }

      // ✅ pulse si sube el contador
      const prev = prevCountRef.current;
      if (arr.length > prev) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
      }
      prevCountRef.current = arr.length;
    } finally {
      setNotifLoading(false);
    }
  };

  // ✅ Poll cada 10s (solo contador/lista)
  useEffect(() => {
    fetchNotifs();
    const id = setInterval(fetchNotifs, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Refresca al abrir dropdown (CRM feel)
  useEffect(() => {
    if (openNotifs) fetchNotifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNotifs]);

  // ✅ Cerrar al click fuera + ESC
  useEffect(() => {
    if (!openNotifs) return;

    const onClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpenNotifs(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpenNotifs(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openNotifs]);

  // (Opcional) marcar como leída si tu API lo soporta.
  // Si no existe, NO rompe: solo actualiza UI local.
  async function markReadLocalFirst(id) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    setNotifCount((c) => Math.max(0, c - 1));

    await fetch(`/api/notificaciones/${id}/leida`, {
      method: "PUT",
      credentials: "include",
    });

    // ✅ avisa a toda la app
    window.dispatchEvent(new CustomEvent("crm:notifs-changed"));
  }

  function notifMeta(n) {
    const tipo = String(n?.tipo || "").toUpperCase();
    const p = parsePayload(n?.payload);

    if (tipo === "CITA_COMERCIAL_PENDIENTE_AUTORIZACION") {
      return {
        icon: <Clock className="h-4 w-4 text-amber-600" />,
        title: "Cita comercial pendiente",
        subtitle: p?.fecha_hora ? `Fecha: ${formatDate(p.fecha_hora)}` : "Requiere autorización",
        href: "/gerente/operaciones",
      };
    }

    return {
      icon: <CheckCircle2 className="h-4 w-4 text-slate-500" />,
      title: n?.tipo || "Notificación",
      subtitle: "",
      href: "/dashboard",
    };
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-end">
      <div className="flex items-center gap-3" ref={rootRef}>
        {/* 🔔 Campana + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenNotifs((v) => !v)}
            className="relative h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
            title="Notificaciones"
            aria-label="Notificaciones"
          >
            <Bell size={18} className="text-slate-700" />

            {notifCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white ${pulse ? "animate-pulse" : ""
                  }`}
              >
                {notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
          </button>

          {openNotifs && (
            <div className="absolute right-0 mt-2 w-[380px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Notificaciones</div>
                  <div className="text-xs text-slate-500">
                    {notifCount ? `${notifCount} sin leer` : "Sin pendientes"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenNotifs(false)}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  Cerrar
                </button>
              </div>

              {notifLoading ? (
                <div className="px-4 py-6 text-sm text-slate-500">Cargando…</div>
              ) : notifs.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  No tienes notificaciones pendientes.
                </div>
              ) : (
                <ul className="max-h-80 overflow-auto">
                  {notifs.slice(0, 20).map((n) => {
                    const meta = notifMeta(n);
                    return (
                      <li key={n.id} className="border-b last:border-b-0">
                        <div className="px-4 py-3 hover:bg-slate-50 flex items-start gap-3">
                          <div className="mt-0.5">{meta.icon}</div>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = meta.href;
                              setOpenNotifs(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="text-sm font-medium text-slate-900">{meta.title}</div>
                            {meta.subtitle && (
                              <div className="mt-1 text-xs text-slate-600">{meta.subtitle}</div>
                            )}
                          </button>

                          {/* (Opcional) marcar como leída */}
                          <button
                            type="button"
                            onClick={() => markReadLocalFirst(n.id)}
                            className="text-xs text-slate-500 hover:text-slate-900"
                            title="Marcar como leída"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="px-4 py-3 border-t bg-white">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/gerente/operaciones";
                    setOpenNotifs(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Ver autorizaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ✉️ Mail (placeholder) */}
        <button
          type="button"
          className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
          title="Correo"
          aria-label="Correo"
        >
          <Mail size={18} className="text-slate-700" />
        </button>

        {/* 👤 Avatar + Nombre + Cargo • Depto */}
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

          <div className="leading-tight text-right">
            <div className="text-sm font-semibold text-slate-900">
              {usuario?.nombre?.trim() || "Empleado"}
            </div>
            <div className="text-xs text-slate-500">
              {(prettyCargo(usuario?.cargo) || "Cargo")}{" "}
              <span className="text-slate-300">•</span>{" "}
              {(usuario?.departamento || "Departamento")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}