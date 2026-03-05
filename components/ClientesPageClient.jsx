// "use client";

// import Cookies from "js-cookie";
// import { useEffect, useMemo, useState } from "react";
// import { PlusCircle, CalendarPlus, UserPlus, MessageSquareText } from "lucide-react";

// const FIELDS = [
//   { key: "empresa", label: "Empresa" },
//   { key: "direccion", label: "Dirección" },
//   { key: "nombre", label: "Nombre" },
//   { key: "telefono", label: "Teléfono" },
//   { key: "extension", label: "Extensión" },
//   { key: "celular", label: "Celular" },
//   { key: "correo", label: "Correo" },
//   { key: "tipo_contacto", label: "Tipo de contacto" },
// ];

// function isEmpty(v) {
//   return v === null || v === undefined || String(v).trim() === "";
// }

// function missingKeys(row) {
//   return FIELDS.map(f => f.key).filter(k => isEmpty(row?.[k]));
// }

// const FIELD_LABEL = Object.fromEntries(FIELDS.map(f => [f.key, f.label]));

// function missingLabels(row) {
//   return missingKeys(row).map(k => FIELD_LABEL[k] || k);
// }

// function cellClass(isMissing) {
//   return [
//     "p-3",
//     isMissing ? "bg-red-50/60 text-red-800" : "text-slate-700",
//   ].join(" ");
// }

// export default function ClientesPageClient() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selected, setSelected] = useState(null); // prospecto seleccionado
//   const [form, setForm] = useState({}); // solo campos vacíos a llenar
//   const [saving, setSaving] = useState(false);

//   const [citaOpen, setCitaOpen] = useState(false);
//   const [citaFor, setCitaFor] = useState(null);

//   const [citaForm, setCitaForm] = useState({
//     fecha: "",     // yyyy-mm-dd
//     hora: "",      // HH:mm
//     notas: "",
//     tipo: "HVAC",  // HVAC | ELECTRICA | CIVIL | ATM/CONTROL
//   });

//   const [comercialOpen, setComercialOpen] = useState(false)
//   const [comercialFor, setComercialFor] = useState(null)

//   const [levantOpen, setLevantOpen] = useState(false)
//   const [levantFor, setLevantFor] = useState(null)

//   const [comercialForm, setComercialForm] = useState({ fecha: "", hora: "", nota: "" })
//   const [levantForm, setLevantForm] = useState({ fecha: "", hora: "", tipo: "HVAC", nota: "" })

//   const [createOpen, setCreateOpen] = useState(false);

//   const [createError, setCreateError] = useState("");
//   const [creating, setCreating] = useState(false);

//   const [createForm, setCreateForm] = useState({
//     empresa: "",
//     direccion: "",
//     nombre: "",
//     telefono: "",
//     extension: "",
//     celular: "",
//     correo: "",
//     tipo_contacto: "WHATSAPP", // default
//   });
//   const userCookie = Cookies.get("user") || "";
//   const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
//   const rol = (user?.rol || "").toUpperCase();

//   async function load() {
//       console.log('load')
//     try {
//       setError("");
//       setLoading(true);

      

//       const res = await fetch(`/api/prospectos`, {
//         cache: "no-store",
//         credentials: "include",
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         throw new Error(data?.error || `Error cargando prospectos: ${res.status}`);
//       }

//       setRows(Array.isArray(data) ? data : (data?.prospectos || []));
//     } catch (e) {
//       setError(e?.message || "Error inesperado");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     console.log('effect')
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const tableRows = useMemo(() => rows.map(r => ({ ...r, _missing: missingKeys(r) })), [rows]);

//   function openAddInfo(row) {
//     const miss = missingKeys(row);
//     const init = {};
//     for (const k of miss) init[k] = "";
//     setSelected(row);
//     setForm(init);
//     setModalOpen(true);
//   }

//   async function saveMissing() {
//     if (!selected) return;

//     const payload = {};
//     for (const [k, v] of Object.entries(form)) {
//       if (!isEmpty(v)) payload[k] = v; // solo envía lo que el usuario llenó
//     }

//     if (Object.keys(payload).length === 0) {
//       setModalOpen(false);
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       // ✅ RECOMENDADO: PATCH para completar SOLO campos vacíos
//       // Ajusta endpoint a tu backend real:
//       const res = await fetch(`/api/prospectos/${selected.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });


//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`Error guardando: ${res.status} ${txt}`);
//       }

//       setModalOpen(false);
//       setSelected(null);
//       setForm({});
//       await load();
//     } catch (e) {
//       setError(e.message || "Error");
//     } finally {
//       setSaving(false);
//     }
//   }

//   function openCitaModal(row) {
//     setCitaFor(row);
//     setCitaForm({ fecha: "", hora: "", notas: "", tipo: "HVAC" });
//     setCitaOpen(true);
//   }

//   function parseFechaToISO(fecha) {
//     if (!fecha) return null;
//     if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha; // ISO

//     const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha); // DD/MM/YYYY
//     if (!m) return null;

//     const [, dd, mm, yyyy] = m;
//     return `${yyyy}-${mm}-${dd}`;
//   }

//   function parseHoraTo24(hora) {
//     if (!hora) return null;
//     if (/^\d{2}:\d{2}$/.test(hora)) return hora; // 24h

//     const cleaned = hora.trim().toLowerCase().replace(/\./g, "");
//     const m = /^(\d{1,2}):(\d{2})\s*(am|pm)$/.exec(cleaned);
//     if (!m) return null;

//     let hh = parseInt(m[1], 10);
//     const mm = m[2];
//     const ap = m[3];

//     if (ap === "am") {
//       if (hh === 12) hh = 0;
//     } else {
//       if (hh !== 12) hh += 12;
//     }
//     return `${String(hh).padStart(2, "0")}:${mm}`;
//   }

//   async function saveCita() {
//     if (!citaFor) return;

//     if (!citaForm.fecha || !citaForm.hora) {
//       setError("Fecha y hora son requeridas");
//       return;
//     }

//     if (!citaForm.tipo) {
//       setError("Tipo de proyecto es requerido");
//       return;
//     }

//     if (rol === "ESPECIALISTA") {
//       setError("Los especialistas no agendan; solo marcan como realizada.");
//       return;
//     }

//     // ✅ normaliza a lo que backend espera
//     const fechaISO = parseFechaToISO(citaForm.fecha);
//     const hora24 = parseHoraTo24(citaForm.hora);

//     if (!fechaISO) {
//       setError("Fecha inválida (usa DD/MM/YYYY).");
//       return;
//     }
//     if (!hora24) {
//       setError("Hora inválida.");
//       return;
//     }

//     // String interpretable por new Date() en backend
//     const fecha_hora = `${fechaISO}T${hora24}:00`;

//     // ✅ validación UI: no pasado (mismo criterio que backend)
//     const dt = new Date(fecha_hora);
//     if (Number.isNaN(dt.getTime())) {
//       setError("Fecha/hora inválidas.");
//       return;
//     }
//     if (dt.getTime() < Date.now() - 60_000) {
//       setError("No se puede agendar o reagendar una cita en el pasado.");
//       return;
//     }

//     try {
//       setError("");

//       const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//       const isReagendar = !!citaFor?.next_cita_id;

//       const url = isReagendar
//         ? `/api/citas/${citaFor.next_cita_id}/reprogramar`
//         : `/api/prospectos/${citaFor.id}/citas`;

//       const payload = {
//         fecha_hora,
//         tipo: String(citaForm.tipo).toUpperCase(),
//         nota: citaForm.notas || "",
//       };

//       const res = await fetch(url, {
//         method: isReagendar ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         // Mapear errores conocidos a mensajes bonitos
//         const code = data?.error;
//         if (code === "FECHA_EN_EL_PASADO") throw new Error("No se puede agendar o reagendar en el pasado.");
//         if (code === "CITA_YA_PROGRAMADA") throw new Error("Este cliente ya tiene una cita programada.");
//         if (code === "CITA_AUN_VIGENTE") throw new Error("La cita aún está vigente; no se puede reagendar.");
//         if (code === "CITA_NO_REPROGRAMABLE") throw new Error("La cita no es reprogramable.");
//         throw new Error(code || `Error guardando cita: ${res.status}`);
//       }

//       setCitaOpen(false);
//       setCitaFor(null);
//       await load(); // refrescar si quieres
//     } catch (e) {
//       setError(e?.message || "Error inesperado");
//     }
//   }

//   function getComercialUi(row) {
//     // si no hay comercial
//     if (!row?.next_comercial_id) {
//       return {
//         estadoUi: "SIN_COMERCIAL",
//         canAgendar: true,
//         canReagendar: false,
//         isBloqueada: false,
//         fecha: null,
//         nota: null,
//         motivo: null,
//       }
//     }

//     const auth = (row.next_comercial_auth_estado || "PENDIENTE").toUpperCase()
//     const fecha = row.next_comercial_fecha_hora ? new Date(row.next_comercial_fecha_hora) : null

//     // Ventas NO reagenda comercial: si rechazada, agenda una nueva (no reprogramar)
//     const isBloqueada = auth === "PENDIENTE" || auth === "AUTORIZADA"
//     const canAgendar = auth === "RECHAZADA" ? true : false

//     return {
//       estadoUi: auth, // PENDIENTE | AUTORIZADA | RECHAZADA
//       canAgendar,
//       canReagendar: false,
//       isBloqueada,
//       fecha,
//       nota: row.next_comercial_nota,
//       motivo: row.next_comercial_auth_motivo,
//     }
//   }

//   function getLevantamientoUi(row) {
//     // 1) Sin levantamiento
//     if (!row?.next_levantamiento_id) {
//       return {
//         estadoUi: "SIN_LEVANTAMIENTO",
//         canAgendar: true,
//         canReagendar: false,
//         isBloqueada: false,
//         fecha: null,
//         nota: null,
//         tipo: null,
//       }
//     }

//     const rawEstado = row.next_levantamiento_estado_ui || "PROGRAMADA"
//     const fecha = row.next_levantamiento_fecha_hora ? new Date(row.next_levantamiento_fecha_hora) : null

//     const canReagendar = rawEstado === "VENCIDA"
//     const canAgendar = false
//     const isBloqueada = rawEstado === "PROGRAMADA"

//     return {
//       estadoUi: rawEstado, // PROGRAMADA | VENCIDA
//       canAgendar,
//       canReagendar,
//       isBloqueada,
//       fecha,
//       nota: row.next_levantamiento_nota,
//       tipo: row.next_levantamiento_tipo,
//     }
//   }

//   function formatFechaHora(date) {
//     if (!date || Number.isNaN(date.getTime())) return "";

//     return new Intl.DateTimeFormat("es-MX", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   }

//   function updateCreateForm(key, value) {
//     setCreateError("");
//     setCreateForm((p) => ({ ...p, [key]: value }));
//   }

//   function isEmailValid(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
//   }

//   async function createCliente() {
//     try {
//       setCreateError("");
//       const empresa = createForm.empresa.trim();
//       const direccion = createForm.direccion.trim();
//       const nombre = createForm.nombre.trim();
//       const telefono = createForm.telefono.trim();
//       const celular = createForm.celular.trim();
//       const correo = createForm.correo.trim();
//       const tipo_contacto = createForm.tipo_contacto;

//       if (!empresa || !direccion || !nombre || !telefono || !celular || !correo || !tipo_contacto) {
//         setCreateError("Completa los campos requeridos.");
//         return;
//       }

//       if (!isEmailValid(correo)) {
//         setCreateError("Correo inválido.");
//         return;
//       }

//       setCreating(true);

//       const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

//       const payload = {
//         empresa,
//         direccion,
//         nombre,
//         telefono,
//         extension: createForm.extension.trim() || null,
//         celular,
//         correo,
//         tipo_contacto,
//       };
// console.log('aqui')
//       const res = await fetch(`/api/prospectos`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         const code = data?.error;

//         if (code === "CAMPOS_REQUERIDOS") throw new Error("Faltan campos requeridos.");
//         if (code === "TIPO_PROYECTO_REQUERIDO") throw new Error("El backend aún requiere tipo_proyecto. Quita esa validación o envíalo como 'N/A'.");
//         throw new Error(code || `Error creando cliente: ${res.status}`);
//       }

//       // cerrar y refrescar tabla
//       setCreateOpen(false);
//       setCreateForm({
//         empresa: "",
//         direccion: "",
//         nombre: "",
//         telefono: "",
//         extension: "",
//         celular: "",
//         correo: "",
//         tipo_contacto: "WHATSAPP",
//       });

//       await load();
//     } catch (e) {
//       setCreateError(e?.message || "Error inesperado");
//     } finally {
//       setCreating(false);
//     }
//   }

//   function openComercialModal(row) {
//     setError("")
//     setComercialFor(row)
//     setComercialForm({ fecha: "", hora: "", notas: "" })
//     setComercialOpen(true)
//   }

//   function openLevantamientoModal(row) {
//     setError("")
//     setLevantFor(row)

//     // opcional: si ya tienes cita vencida, puedes precargar tipo anterior
//     const prevTipo = row?.next_levantamiento_tipo || "HVAC"

//     setLevantForm({ fecha: "", hora: "", tipo: prevTipo, notas: "" })
//     setLevantOpen(true)
//   }

//   function buildFechaHoraISO(fecha, hora) {
//     // fecha: "2026-02-28", hora: "13:25"
//     const dt = new Date(`${fecha}T${hora}:00`)
//     return dt
//   }

//   async function saveComercial() {
//     if (!comercialFor) return

//     if (!comercialForm.fecha || !comercialForm.hora) {
//       setError("Fecha y hora son requeridas")
//       return
//     }

//     const dt = buildFechaHoraISO(comercialForm.fecha, comercialForm.hora)
//     if (Number.isNaN(dt.getTime())) {
//       setError("Fecha inválida")
//       return
//     }
//     if (dt.getTime() < Date.now()) {
//       setError("No se puede agendar una visita en el pasado")
//       return
//     }

//     try {
//       setError("")
//       const payload = {
//         categoria: "VISITA_COMERCIAL",
//         fecha_hora: dt.toISOString(),
//         nota: comercialForm.nota || "",
//       }

//       const res = await fetch(`/api/citas/prospectos/${comercialFor.id}/citas`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data?.error || `Error guardando visita: ${res.status}`)

//       setComercialOpen(false)
//       setComercialFor(null)
//       await load()
//     } catch (e) {
//       setError(e?.message || "Error inesperado")
//     }
//   }

//   async function saveLevantamiento() {
//     if (!levantFor) return

//     if (!levantForm.fecha || !levantForm.hora) {
//       setError("Fecha y hora son requeridas")
//       return
//     }
//     if (!levantForm.tipo) {
//       setError("Tipo de proyecto es requerido")
//       return
//     }

//     const dt = buildFechaHoraISO(levantForm.fecha, levantForm.hora)
//     if (Number.isNaN(dt.getTime())) {
//       setError("Fecha inválida")
//       return
//     }
//     if (dt.getTime() < Date.now()) {
//       setError("No se puede agendar un levantamiento en el pasado")
//       return
//     }

//     try {
//       setError("")

//       const payload = {
//         categoria: "LEVANTAMIENTO",
//         fecha_hora: dt.toISOString(),
//         nota: levantForm.notas || "",
//         tipo: levantForm.tipo,
//       }

//       // si ya hay levantamiento vencido => reagendar (PUT)
//       const tieneId = Boolean(levantFor?.next_levantamiento_id)
//       const esVencida = String(levantFor?.next_levantamiento_estado_ui || "").toUpperCase() === "VENCIDA"

//       let res
//       if (tieneId && esVencida) {
//         res = await fetch(`/api/citas/${levantFor.next_levantamiento_id}/reprogramar`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         })
//       } else {
//         res = await fetch(`/api/citas/prospectos/${levantFor.id}/citas`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         })
//       }

//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data?.error || `Error guardando levantamiento: ${res.status}`)

//       setLevantOpen(false)
//       setLevantFor(null)

//       await load()
//     } catch (e) {
//       setError(e?.message || "Error inesperado")
//     }
//   }

//   function toUpper(v) {
//     return String(v || "").toUpperCase();
//   }

//   function msUntilThreeHoursAfter(iso) {
//     const t = new Date(iso).getTime();
//     if (Number.isNaN(t)) return null;
//     const unlock = t + 3 * 60 * 60 * 1000;
//     return unlock - Date.now();
//   }

//   function formatRemaining(ms) {
//     const s = Math.max(0, Math.floor(ms / 1000));
//     const h = Math.floor(s / 3600);
//     const m = Math.floor((s % 3600) / 60);
//     if (h <= 0) return `${m}m`;
//     return `${h}h ${m}m`;
//   }

//   function canMarkRealizada(row) {
//     if (!row?.comercial_cita_id) return false;
//     if (toUpper(row.comercial_auth_estado) !== "AUTORIZADA") return false;

//     const waitMs = msUntilThreeHoursAfter(row.comercial_fecha_hora);
//     if (waitMs === null) return false;
//     return waitMs <= 0;
//   }

//   async function marcarRealizada(citaId) {
//     const ok = window.confirm("¿Marcar esta visita comercial como REALIZADA?");
//     if (!ok) return;

//     const res = await fetch(`/api/citas/${citaId}/estado`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ estado: "REALIZADA" }),
//     });

//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       alert(data?.error || "No se pudo marcar como realizada");
//       return;
//     }

//     await load(); // tu función que recarga la tabla
//   }

//   function ComercialCell({ row, onAgendar, onRealizada }) {
//     const id = row?.comercial_cita_id;
//     const auth = toUpper(row?.comercial_auth_estado);
//     const fh = row?.comercial_fecha_hora;

//     // No hay cita comercial vigente -> agendar nueva
//     if (!id) {
//       return (
//         <button
//           onClick={() => onAgendar(row)}
//           className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
//         >
//           Agendar
//         </button>
//       );
//     }

//     // Badge
//     const badge =
//       auth === "PENDIENTE" ? (
//         <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
//           Pendiente
//         </span>
//       ) : auth === "AUTORIZADA" ? (
//         <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
//           Autorizada
//         </span>
//       ) : (
//         <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
//           {auth || "—"}
//         </span>
//       );

//     const waitMs = fh ? msUntilThreeHoursAfter(fh) : null;
//     const ready = canMarkRealizada(row);

//     return (
//       <div className="flex flex-col gap-1">
//         <div className="flex items-center gap-2">
//           {badge}
//           {fh && (
//             <span className="text-xs text-slate-600">
//               {new Date(fh).toLocaleString()}
//             </span>
//           )}
//         </div>

//         {/* Mensaje de tiempo */}
//         {auth === "AUTORIZADA" && waitMs !== null && !ready && (
//           <div className="text-[11px] text-slate-500">
//             Disponible para cerrar en {formatRemaining(waitMs)}
//           </div>
//         )}

//         {/* Acción */}
//         {auth === "AUTORIZADA" && ready && (
//           <button
//             onClick={() => onRealizada(id)}
//             className="mt-1 inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
//           >
//             Marcar realizada
//           </button>
//         )}

//         {/* Si está pendiente, no hay acciones */}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
//           <p className="text-slate-600 mt-1">Datos generales de tus clientes</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
//             onClick={() => setCreateOpen(true)}
//             type="button"
//           >
//             <UserPlus className="w-4 h-4" />
//             Nuevo cliente
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       {/* Tabla */}
//       <div className="mt-6 bg-white border border-slate-200 rounded-lg overflow-visible">
//         {loading ? (
//           <div className="p-6 text-slate-600">Cargando...</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr className="text-left text-slate-700">
//                 <th className="p-3">#</th>
//                 <th className="p-3">Empresa</th>
//                 <th className="p-3">Nombre</th>
//                 <th className="p-3">Correo</th>
//                 <th className="p-3">Teléfono</th>
//                 <th className="p-3">Extensión</th>
//                 <th className="p-3">Celular</th>
//                 <th className="p-3">Faltantes</th>
//                 <th className="p-3">Comercial</th>
//                 <th className="p-3">Levantamiento</th>
//                 <th className="p-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableRows.map((r, index) => {
//                 const comercial = getComercialUi(r);
//                 const levant = getLevantamientoUi(r);

//                 const missCount = r._missing?.length || 0;
//                 const missTxt = missingLabels(r).join(", ");

//                 const missEmpresa = r._missing?.includes("empresa");
//                 const missNombre = r._missing?.includes("nombre");
//                 const missCorreo = r._missing?.includes("correo");
//                 const missTelefono = r._missing?.includes("telefono");
//                 const missExtension = r._missing?.includes("extension");
//                 const missCelular = r._missing?.includes("celular");

//                 return (
//                   <tr key={r.id} className="border-b border-slate-100">
//                     <td className="p-3 text-slate-700">{index + 1}</td>

//                     <td className={cellClass(missEmpresa)} title={missEmpresa ? "Campo faltante" : ""}>
//                       {isEmpty(r.empresa) ? <span className="opacity-70">—</span> : r.empresa}
//                     </td>

//                     <td className={cellClass(missNombre)} title={missNombre ? "Campo faltante" : ""}>
//                       {isEmpty(r.nombre) ? <span className="opacity-70">—</span> : r.nombre}
//                     </td>

//                     <td className={cellClass(missCorreo)} title={missCorreo ? "Campo faltante" : ""}>
//                       {isEmpty(r.correo) ? <span className="opacity-70">—</span> : r.correo}
//                     </td>

//                     <td className={cellClass(missTelefono)} title={missTelefono ? "Campo faltante" : ""}>
//                       {isEmpty(r.telefono) ? <span className="opacity-70">—</span> : r.telefono}
//                     </td>

//                     <td className={cellClass(missExtension)} title={missExtension ? "Campo faltante" : ""}>
//                       {isEmpty(r.extension) ? <span className="opacity-70">—</span> : r.extension}
//                     </td>

//                     <td className={cellClass(missCelular)} title={missCelular ? "Campo faltante" : ""}>
//                       {isEmpty(r.celular) ? <span className="opacity-70">—</span> : r.celular}
//                     </td>

//                     <td className="p-3">
//                       {missCount === 0 ? (
//                         <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
//                           Completo
//                         </span>
//                       ) : (
//                         <div className="flex flex-col gap-1">
//                           <span
//                             className="inline-flex w-fit px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs"
//                             title={missTxt}
//                           >
//                             {missCount} faltante{missCount === 1 ? "" : "s"}
//                           </span>
//                           <span className="text-xs text-slate-500 line-clamp-1" title={missTxt}>
//                             {missTxt}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="p-3">
//                       <div className="flex flex-col gap-1">
//                         {comercial.estadoUi === "SIN_COMERCIAL" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs">
//                             Sin comercial
//                           </span>
//                         )}

//                         {comercial.estadoUi === "PENDIENTE" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs">
//                             Pendiente
//                           </span>
//                         )}

//                         {comercial.estadoUi === "AUTORIZADA" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
//                             Autorizada
//                           </span>
//                         )}

//                         {comercial.estadoUi === "RECHAZADA" && (
//                           <span
//                             className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs"
//                             title={comercial.motivo ? `Motivo: ${comercial.motivo}` : "Rechazada"}
//                           >
//                             Rechazada
//                           </span>
//                         )}

//                         {comercial.fecha && (
//                           <span className="text-xs text-slate-500">
//                             {formatFechaHora(comercial.fecha)}
//                           </span>
//                         )}

//                         {r.next_comercial_nota && String(r.next_comercial_nota).trim() && (
//                           <div className="relative group w-fit">
//                             <button
//                               type="button"
//                               className="mt-1 text-slate-400 hover:text-slate-600"
//                               title="Ver nota"
//                             >
//                               <MessageSquareText className="w-4 h-4" />
//                             </button>
//                             <div className="absolute z-[9999] hidden group-hover:block bottom-full left-0 mb-2 w-72 max-w-[20rem] rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-xs text-slate-700 whitespace-pre-wrap">
//                               {r.next_comercial_nota}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="p-3">
//                       <div className="flex flex-col gap-1">
//                         {levant.estadoUi === "SIN_LEVANTAMIENTO" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs">
//                             Sin levantamiento
//                           </span>
//                         )}

//                         {levant.estadoUi === "PROGRAMADA" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">
//                             Programada
//                           </span>
//                         )}

//                         {levant.estadoUi === "VENCIDA" && (
//                           <span className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs">
//                             Vencida
//                           </span>
//                         )}

//                         {levant.tipo && (
//                           <span className="text-xs text-slate-600">
//                             {String(levant.tipo).toUpperCase()}
//                           </span>
//                         )}

//                         {levant.fecha && (
//                           <span className="text-xs text-slate-500">
//                             {formatFechaHora(levant.fecha)}
//                           </span>
//                         )}

//                         {levant.nota && String(levant.nota).trim() && (
//                           <div className="relative group w-fit">
//                             <button
//                               type="button"
//                               className="mt-1 text-slate-400 hover:text-slate-600"
//                               title="Ver nota"
//                             >
//                               <MessageSquareText className="w-4 h-4" />
//                             </button>
//                             <div className="absolute z-20 hidden group-hover:block top-6 left-0 w-64 rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-xs text-slate-700">
//                               {levant.nota}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="p-3 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         {missCount > 0 && (
//                           <button
//                             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800"
//                             onClick={() => openAddInfo(r)}
//                             type="button"
//                             title="Completar campos faltantes"
//                           >
//                             <PlusCircle className="w-4 h-4" />
//                             Completar
//                           </button>
//                         )}

//                         {/* Comercial: Ventas puede agendar (si no existe o si rechazada) */}
//                         {comercial.canAgendar && (
//                           <button
//                             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800"
//                             onClick={() => openComercialModal(r)}
//                             type="button"
//                             title="Agendar visita comercial"
//                           >
//                             <CalendarPlus className="w-4 h-4" />
//                             Comercial
//                           </button>
//                         )}

//                         {/* Levantamiento: puede agendar o reagendar si vencida */}
//                         {(levant.canAgendar || levant.canReagendar) && (
//                           <button
//                             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 disabled:opacity-50"
//                             onClick={() => openLevantamientoModal(r)}
//                             type="button"
//                             disabled={levant.isBloqueada}
//                             title={levant.canReagendar ? "Reagendar levantamiento" : "Agendar levantamiento"}
//                           >
//                             <CalendarPlus className="w-4 h-4" />
//                             {levant.canReagendar ? "Reagendar" : "Levantamiento"}
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Modales/Form */}
//       {modalOpen && selected && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//           <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 overflow-hidden">
//             <div className="p-4 border-b border-slate-200 flex items-center justify-between">
//               <div>
//                 <div className="font-semibold text-slate-900">Completar información</div>
//               </div>
//               <button
//                 className="px-3 py-1 rounded-lg hover:bg-slate-100"
//                 onClick={() => setModalOpen(false)}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               {FIELDS.map((f) => {
//                 const hasValue = !isEmpty(selected[f.key]);
//                 const editable = isEmpty(selected[f.key]); // SOLO si está vacío
//                 const value = editable ? (form[f.key] ?? "") : selected[f.key];

//                 return (
//                   <label key={f.key} className="block">
//                     <span className="text-xs text-slate-600">{f.label}</span>
//                     <input
//                       className={[
//                         "mt-1 w-full rounded-lg border px-3 py-2 text-sm",
//                         editable ? "border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200" : "border-slate-200 bg-slate-50 text-slate-500",
//                       ].join(" ")}
//                       value={value ?? ""}
//                       disabled={hasValue} // bloquea los llenos
//                       onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
//                       placeholder={editable ? "Captura..." : "Ya registrado"}
//                     />
//                   </label>
//                 );
//               })}
//             </div>

//             <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
//               <button
//                 className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
//                 onClick={() => setModalOpen(false)}
//                 disabled={saving}
//               >
//                 Cancelar
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
//                 onClick={saveMissing}
//                 disabled={saving}
//               >
//                 {saving ? "Guardando..." : "Guardar"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {comercialOpen && comercialFor && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//           <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 overflow-hidden">
//             <div className="p-4 border-b border-slate-200 flex items-center justify-between">
//               <div>
//                 <div className="font-semibold text-slate-900">Agendar visita comercial</div>
//                 <div className="text-xs text-slate-600">
//                   Cliente: {comercialFor.empresa} — {comercialFor.nombre}
//                 </div>
//               </div>
//               <button
//                 className="px-3 py-1 rounded-lg hover:bg-slate-100"
//                 onClick={() => setComercialOpen(false)}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <label className="block">
//                   <span className="text-xs text-slate-600">Fecha</span>
//                   <input
//                     type="date"
//                     className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
//                     value={comercialForm.fecha}
//                     onChange={(e) => setComercialForm((p) => ({ ...p, fecha: e.target.value }))}
//                     required
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-xs text-slate-600">Hora</span>
//                   <input
//                     type="time"
//                     className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
//                     value={comercialForm.hora}
//                     onChange={(e) => setComercialForm((p) => ({ ...p, hora: e.target.value }))}
//                     required
//                   />
//                 </label>
//               </div>

//               <label className="block">
//                 <span className="text-xs text-slate-600">Notas</span>
//                 <textarea
//                   className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[100px]"
//                   value={comercialForm.nota}
//                   onChange={(e) => setComercialForm((p) => ({ ...p, nota: e.target.value }))}
//                   placeholder="Objetivo de la visita, asistentes, contexto..."
//                 />
//               </label>
//             </div>

//             <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
//               <button
//                 className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
//                 onClick={() => setComercialOpen(false)}
//               >
//                 Cancelar
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-[#03045e] text-white hover:opacity-90"
//                 onClick={saveComercial}
//               >
//                 Guardar visita
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {createOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-100 p-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-900">Nuevo cliente</h2>
//                 <p className="text-sm text-slate-500">Captura los datos generales del cliente.</p>
//               </div>

//               <button
//                 className="rounded-lg p-2 hover:bg-slate-50"
//                 onClick={() => setCreateOpen(false)}
//                 type="button"
//                 aria-label="Cerrar"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-5">
//               {createError && (
//                 <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
//                   {createError}
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm text-slate-600">Empresa *</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.empresa}
//                     onChange={(e) => updateCreateForm("empresa", e.target.value)}
//                     placeholder="Ej. Marinela"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Nombre *</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.nombre}
//                     onChange={(e) => updateCreateForm("nombre", e.target.value)}
//                     placeholder="Ej. Pedro Pérez"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm text-slate-600">Dirección *</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.direccion}
//                     onChange={(e) => updateCreateForm("direccion", e.target.value)}
//                     placeholder="Calle, número, colonia, ciudad..."
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Correo *</label>
//                   <input
//                     type="email"
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.correo}
//                     onChange={(e) => updateCreateForm("correo", e.target.value)}
//                     placeholder="correo@empresa.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Tipo de contacto *</label>
//                   <select
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
//                     value={createForm.tipo_contacto}
//                     onChange={(e) => updateCreateForm("tipo_contacto", e.target.value)}
//                   >
//                     <option value="WHATSAPP">WhatsApp</option>
//                     <option value="TELEFONO">Teléfono</option>
//                     <option value="CORREO">Correo</option>
//                     <option value="VISITA">Visita</option>
//                     <option value="OTRO">Otro</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Teléfono *</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.telefono}
//                     onChange={(e) => updateCreateForm("telefono", e.target.value)}
//                     placeholder="Ej. 0123456789"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Extensión</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.extension}
//                     onChange={(e) => updateCreateForm("extension", e.target.value)}
//                     placeholder="Ej. 123"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-slate-600">Celular *</label>
//                   <input
//                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
//                     value={createForm.celular}
//                     onChange={(e) => updateCreateForm("celular", e.target.value)}
//                     placeholder="Ej. 9876543210"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-5">
//               <button
//                 className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
//                 onClick={() => setCreateOpen(false)}
//                 type="button"
//                 disabled={creating}
//               >
//                 Cancelar
//               </button>

//               <button
//                 className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                 type="button"
//                 onClick={createCliente}
//                 disabled={creating}
//               >
//                 {creating ? "Guardando..." : "Guardar cliente"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import Cookies from "js-cookie";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlusCircle, CalendarPlus, UserPlus, MessageSquareText } from "lucide-react";

const FIELDS = [
  { key: "empresa", label: "Empresa" },
  { key: "direccion", label: "Dirección" },
  { key: "nombre", label: "Nombre" },
  { key: "telefono", label: "Teléfono" },
  { key: "extension", label: "Extensión" },
  { key: "celular", label: "Celular" },
  { key: "correo", label: "Correo" },
  { key: "tipo_contacto", label: "Tipo de contacto" },
];

function isEmpty(v) {
  return v === null || v === undefined || String(v).trim() === "";
}

function missingKeys(row) {
  return FIELDS.map(f => f.key).filter(k => isEmpty(row?.[k]));
}

const FIELD_LABEL = Object.fromEntries(FIELDS.map(f => [f.key, f.label]));

function missingLabels(row) {
  return missingKeys(row).map(k => FIELD_LABEL[k] || k);
}

function cellClass(isMissing) {
  return [
    "p-3",
    isMissing ? "bg-red-50/60 text-red-800" : "text-slate-700",
  ].join(" ");
}

export default function ClientesPageClient() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);      // solo “primer carga”
  const [refreshing, setRefreshing] = useState(false); // refresco silencioso
  const inFlightRef = useRef(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null); // prospecto seleccionado
  const [form, setForm] = useState({}); // solo campos vacíos a llenar
  const [saving, setSaving] = useState(false);
  const [citaOpen, setCitaOpen] = useState(false);
  const [citaFor, setCitaFor] = useState(null);
  const [citaForm, setCitaForm] = useState({
    fecha: "",     // yyyy-mm-dd
    hora: "",      // HH:mm
    notas: "",
    tipo: "HVAC",  // HVAC | ELECTRICA | CIVIL | ATM/CONTROL
  });
  const [comercialOpen, setComercialOpen] = useState(false)
  const [comercialFor, setComercialFor] = useState(null)
  const [levantOpen, setLevantOpen] = useState(false)
  const [levantFor, setLevantFor] = useState(null)
  const [comercialForm, setComercialForm] = useState({ fecha: "", hora: "", nota: "" })
  const [levantForm, setLevantForm] = useState({ fecha: "", hora: "", tipo: "HVAC", nota: "" })
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    empresa: "",
    direccion: "",
    nombre: "",
    telefono: "",
    extension: "",
    celular: "",
    correo: "",
    tipo_contacto: "WHATSAPP", // default
  });
  const userCookie = Cookies.get("user") || "";
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  const rol = (user?.rol || "").toUpperCase();

  async function load({ silent = false } = {}) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const hasData = Array.isArray(items) && items.length > 0;

    // ✅ Solo muestra "loading" la primera vez (cuando no hay data)
    if (silent || hasData) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/prospectos`, {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // ✅ No borres tabla si era refresh
        if (!silent && !hasData) setItems([]);
        // opcional: setError(data?.error || `Error ${res.status}`);
        return;
      }

      setItems(Array.isArray(data) ? data : (data?.prospectos || []));
      // opcional: setError("");
    } catch (e) {
      if (!silent && !hasData) setItems([]);
      // opcional: setError(e?.message || "Error inesperado");
    } finally {
      setLoading(false);
      setRefreshing(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    load({ silent: false });

    const onNotifsChanged = () => load({ silent: true });
    const onVisibility = () => { if (document.visibilityState === "visible") load({ silent: true }); };
    const onFocus = () => load({ silent: true });

    window.addEventListener("crm:notifs-changed", onNotifsChanged);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    // ✅ Cross-browser: refresco periódico
    const pollId = setInterval(() => load({ silent: true }), 3000);

    return () => {
      window.removeEventListener("crm:notifs-changed", onNotifsChanged);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      clearInterval(pollId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableRows = useMemo(
    () => items.map(r => ({ ...r, _missing: missingKeys(r) })),
    [items]
  );

  function openAddInfo(row) {
    const miss = missingKeys(row);
    const init = {};
    for (const k of miss) init[k] = "";
    setSelected(row);
    setForm(init);
    setModalOpen(true);
  }

  async function saveMissing() {
    if (!selected) return;

    const payload = {};
    for (const [k, v] of Object.entries(form)) {
      if (!isEmpty(v)) payload[k] = v; // solo envía lo que el usuario llenó
    }

    if (Object.keys(payload).length === 0) {
      setModalOpen(false);
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ✅ RECOMENDADO: PATCH para completar SOLO campos vacíos
      // Ajusta endpoint a tu backend real:
      const res = await fetch(`/api/prospectos/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error guardando: ${res.status} ${txt}`);
      }

      setModalOpen(false);
      setSelected(null);
      setForm({});
      await load();
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  function openCitaModal(row) {
    setCitaFor(row);
    setCitaForm({ fecha: "", hora: "", notas: "", tipo: "HVAC" });
    setCitaOpen(true);
  }

  function parseFechaToISO(fecha) {
    if (!fecha) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha; // ISO

    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha); // DD/MM/YYYY
    if (!m) return null;

    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  function parseHoraTo24(hora) {
    if (!hora) return null;
    if (/^\d{2}:\d{2}$/.test(hora)) return hora; // 24h

    const cleaned = hora.trim().toLowerCase().replace(/\./g, "");
    const m = /^(\d{1,2}):(\d{2})\s*(am|pm)$/.exec(cleaned);
    if (!m) return null;

    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const ap = m[3];

    if (ap === "am") {
      if (hh === 12) hh = 0;
    } else {
      if (hh !== 12) hh += 12;
    }
    return `${String(hh).padStart(2, "0")}:${mm}`;
  }

  async function saveCita() {
    if (!citaFor) return;

    if (!citaForm.fecha || !citaForm.hora) {
      setError("Fecha y hora son requeridas");
      return;
    }

    if (!citaForm.tipo) {
      setError("Tipo de proyecto es requerido");
      return;
    }

    if (rol === "ESPECIALISTA") {
      setError("Los especialistas no agendan; solo marcan como realizada.");
      return;
    }

    // ✅ normaliza a lo que backend espera
    const fechaISO = parseFechaToISO(citaForm.fecha);
    const hora24 = parseHoraTo24(citaForm.hora);

    if (!fechaISO) {
      setError("Fecha inválida (usa DD/MM/YYYY).");
      return;
    }
    if (!hora24) {
      setError("Hora inválida.");
      return;
    }

    // String interpretable por new Date() en backend
    const fecha_hora = `${fechaISO}T${hora24}:00`;

    // ✅ validación UI: no pasado (mismo criterio que backend)
    const dt = new Date(fecha_hora);
    if (Number.isNaN(dt.getTime())) {
      setError("Fecha/hora inválidas.");
      return;
    }
    if (dt.getTime() < Date.now() - 60_000) {
      setError("No se puede agendar o reagendar una cita en el pasado.");
      return;
    }

    try {
      setError("");

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const isReagendar = !!citaFor?.next_cita_id;

      const url = isReagendar
        ? `${process.env.NEXT_PUBLIC_API_URL}/crm/citas/${citaFor.next_cita_id}/reprogramar`
        : `${process.env.NEXT_PUBLIC_API_URL}/crm/prospectos/${citaFor.id}/citas`;

      const payload = {
        fecha_hora,
        tipo: String(citaForm.tipo).toUpperCase(),
        nota: citaForm.notas || "",
      };

      const res = await fetch(url, {
        method: isReagendar ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Mapear errores conocidos a mensajes bonitos
        const code = data?.error;
        if (code === "FECHA_EN_EL_PASADO") throw new Error("No se puede agendar o reagendar en el pasado.");
        if (code === "CITA_YA_PROGRAMADA") throw new Error("Este cliente ya tiene una cita programada.");
        if (code === "CITA_AUN_VIGENTE") throw new Error("La cita aún está vigente; no se puede reagendar.");
        if (code === "CITA_NO_REPROGRAMABLE") throw new Error("La cita no es reprogramable.");
        throw new Error(code || `Error guardando cita: ${res.status}`);
      }

      setCitaOpen(false);
      setCitaFor(null);
      await load(); // refrescar si quieres
    } catch (e) {
      setError(e?.message || "Error inesperado");
    }
  }

  function getComercialUi(row) {
    // si no hay comercial
    if (!row?.next_comercial_id) {
      return {
        estadoUi: "SIN_COMERCIAL",
        canAgendar: true,
        canReagendar: false,
        isBloqueada: false,
        fecha: null,
        nota: null,
        motivo: null,
      }
    }

    const auth = (row.next_comercial_auth_estado || "PENDIENTE").toUpperCase()
    const fecha = row.next_comercial_fecha_hora ? new Date(row.next_comercial_fecha_hora) : null

    // Ventas NO reagenda comercial: si rechazada, agenda una nueva (no reprogramar)
    const isBloqueada = auth === "PENDIENTE" || auth === "AUTORIZADA"
    const canAgendar = auth === "RECHAZADA" ? true : false

    return {
      estadoUi: auth, // PENDIENTE | AUTORIZADA | RECHAZADA
      canAgendar,
      canReagendar: false,
      isBloqueada,
      fecha,
      nota: row.next_comercial_nota,
      motivo: row.next_comercial_auth_motivo,
    }
  }

  function getLevantamientoUi(row) {
    // 1) Sin levantamiento
    if (!row?.next_levantamiento_id) {
      return {
        estadoUi: "SIN_LEVANTAMIENTO",
        canAgendar: true,
        canReagendar: false,
        isBloqueada: false,
        fecha: null,
        nota: null,
        tipo: null,
      }
    }

    const rawEstado = row.next_levantamiento_estado_ui || "PROGRAMADA"
    const fecha = row.next_levantamiento_fecha_hora ? new Date(row.next_levantamiento_fecha_hora) : null

    const canReagendar = rawEstado === "VENCIDA"
    const canAgendar = false
    const isBloqueada = rawEstado === "PROGRAMADA"

    return {
      estadoUi: rawEstado, // PROGRAMADA | VENCIDA
      canAgendar,
      canReagendar,
      isBloqueada,
      fecha,
      nota: row.next_levantamiento_nota,
      tipo: row.next_levantamiento_tipo,
    }
  }

  function formatFechaHora(date) {
    if (!date || Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function updateCreateForm(key, value) {
    setCreateError("");
    setCreateForm((p) => ({ ...p, [key]: value }));
  }

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  async function createCliente() {
    try {
      setCreateError("");
      const empresa = createForm.empresa.trim();
      const direccion = createForm.direccion.trim();
      const nombre = createForm.nombre.trim();
      const telefono = createForm.telefono.trim();
      const celular = createForm.celular.trim();
      const correo = createForm.correo.trim();
      const tipo_contacto = createForm.tipo_contacto;

      if (!empresa || !direccion || !nombre || !telefono || !celular || !correo || !tipo_contacto) {
        setCreateError("Completa los campos requeridos.");
        return;
      }

      if (!isEmailValid(correo)) {
        setCreateError("Correo inválido.");
        return;
      }

      setCreating(true);

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const payload = {
        empresa,
        direccion,
        nombre,
        telefono,
        extension: createForm.extension.trim() || null,
        celular,
        correo,
        tipo_contacto,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/prospectos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = data?.error;

        if (code === "CAMPOS_REQUERIDOS") throw new Error("Faltan campos requeridos.");
        if (code === "TIPO_PROYECTO_REQUERIDO") throw new Error("El backend aún requiere tipo_proyecto. Quita esa validación o envíalo como 'N/A'.");
        throw new Error(code || `Error creando cliente: ${res.status}`);
      }

      // cerrar y refrescar tabla
      setCreateOpen(false);
      setCreateForm({
        empresa: "",
        direccion: "",
        nombre: "",
        telefono: "",
        extension: "",
        celular: "",
        correo: "",
        tipo_contacto: "WHATSAPP",
      });

      await load();
    } catch (e) {
      setCreateError(e?.message || "Error inesperado");
    } finally {
      setCreating(false);
    }
  }

  function openComercialModal(row) {
    setError("")
    setComercialFor(row)
    setComercialForm({ fecha: "", hora: "", notas: "" })
    setComercialOpen(true)
  }

  function openLevantamientoModal(row) {
    setError("")
    setLevantFor(row)

    // opcional: si ya tienes cita vencida, puedes precargar tipo anterior
    const prevTipo = row?.next_levantamiento_tipo || "HVAC"

    setLevantForm({ fecha: "", hora: "", tipo: prevTipo, notas: "" })
    setLevantOpen(true)
  }

  function buildFechaHoraISO(fecha, hora) {
    // fecha: "2026-02-28", hora: "13:25"
    const dt = new Date(`${fecha}T${hora}:00`)
    return dt
  }

  async function saveComercial() {
    if (!comercialFor) return

    if (!comercialForm.fecha || !comercialForm.hora) {
      setError("Fecha y hora son requeridas")
      return
    }

    const dt = buildFechaHoraISO(comercialForm.fecha, comercialForm.hora)
    if (Number.isNaN(dt.getTime())) {
      setError("Fecha inválida")
      return
    }
    if (dt.getTime() < Date.now()) {
      setError("No se puede agendar una visita en el pasado")
      return
    }

    try {
      setError("")
      const payload = {
        categoria: "VISITA_COMERCIAL",
        fecha_hora: dt.toISOString(),
        nota: comercialForm.nota || "",
      }

      const res = await fetch(`/api/citas/prospectos/${comercialFor.id}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `Error guardando visita: ${res.status}`)

      setComercialOpen(false)
      setComercialFor(null)
      await load()
    } catch (e) {
      setError(e?.message || "Error inesperado")
    }
  }

  async function saveLevantamiento() {
    if (!levantFor) return

    if (!levantForm.fecha || !levantForm.hora) {
      setError("Fecha y hora son requeridas")
      return
    }
    if (!levantForm.tipo) {
      setError("Tipo de proyecto es requerido")
      return
    }

    const dt = buildFechaHoraISO(levantForm.fecha, levantForm.hora)
    if (Number.isNaN(dt.getTime())) {
      setError("Fecha inválida")
      return
    }
    if (dt.getTime() < Date.now()) {
      setError("No se puede agendar un levantamiento en el pasado")
      return
    }

    try {
      setError("")

      const payload = {
        categoria: "LEVANTAMIENTO",
        fecha_hora: dt.toISOString(),
        nota: levantForm.notas || "",
        tipo: levantForm.tipo,
      }

      // si ya hay levantamiento vencido => reagendar (PUT)
      const tieneId = Boolean(levantFor?.next_levantamiento_id)
      const esVencida = String(levantFor?.next_levantamiento_estado_ui || "").toUpperCase() === "VENCIDA"

      let res
      if (tieneId && esVencida) {
        res = await fetch(`/api/citas/${levantFor.next_levantamiento_id}/reprogramar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/citas/prospectos/${levantFor.id}/citas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `Error guardando levantamiento: ${res.status}`)

      setLevantOpen(false)
      setLevantFor(null)

      await load()
    } catch (e) {
      setError(e?.message || "Error inesperado")
    }
  }

  function toUpper(v) {
    return String(v || "").toUpperCase();
  }

  function msUntilThreeHoursAfter(iso) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return null;
    const unlock = t + 3 * 60 * 60 * 1000;
    return unlock - Date.now();
  }

  function formatRemaining(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h <= 0) return `${m}m`;
    return `${h}h ${m}m`;
  }

  function canMarkRealizada(row) {
    if (!row?.comercial_cita_id) return false;
    if (toUpper(row.comercial_auth_estado) !== "AUTORIZADA") return false;

    const waitMs = msUntilThreeHoursAfter(row.comercial_fecha_hora);
    if (waitMs === null) return false;
    return waitMs <= 0;
  }

  async function marcarRealizada(citaId) {
    const ok = window.confirm("¿Marcar esta visita comercial como REALIZADA?");
    if (!ok) return;

    const res = await fetch(`/api/citas/${citaId}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "REALIZADA" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "No se pudo marcar como realizada");
      return;
    }

    await load(); // tu función que recarga la tabla
  }

  function ComercialCell({ row, onAgendar, onRealizada }) {
    const id = row?.comercial_cita_id;
    const auth = toUpper(row?.comercial_auth_estado);
    const fh = row?.comercial_fecha_hora;

    // No hay cita comercial vigente -> agendar nueva
    if (!id) {
      return (
        <button
          onClick={() => onAgendar(row)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
        >
          Agendar
        </button>
      );
    }

    // Badge
    const badge =
      auth === "PENDIENTE" ? (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
          Pendiente
        </span>
      ) : auth === "AUTORIZADA" ? (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
          Autorizada
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          {auth || "—"}
        </span>
      );

    const waitMs = fh ? msUntilThreeHoursAfter(fh) : null;
    const ready = canMarkRealizada(row);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {badge}
          {fh && (
            <span className="text-xs text-slate-600">
              {new Date(fh).toLocaleString()}
            </span>
          )}
        </div>

        {/* Mensaje de tiempo */}
        {auth === "AUTORIZADA" && waitMs !== null && !ready && (
          <div className="text-[11px] text-slate-500">
            Disponible para cerrar en {formatRemaining(waitMs)}
          </div>
        )}

        {/* Acción */}
        {auth === "AUTORIZADA" && ready && (
          <button
            onClick={() => onRealizada(id)}
            className="mt-1 inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Marcar realizada
          </button>
        )}

        {/* Si está pendiente, no hay acciones */}
      </div>
    );
  }

  async function cerrarNotificacion(id) {
    const res = await fetch(`/api/notificaciones/${id}/leida`, {
      method: "PUT",
    });

    if (res.ok) {
      tick();
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-1">Datos generales de tus clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={() => setCreateOpen(true)}
            type="button"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo cliente
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="mt-6 bg-white border border-slate-200 rounded-lg overflow-visible">
        {loading ? (
          <div className="p-6 text-slate-600">Cargando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-700">
                <th className="p-3">#</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Extensión</th>
                <th className="p-3">Celular</th>
                <th className="p-3">Faltantes</th>
                <th className="p-3">Comercial</th>
                <th className="p-3">Levantamiento</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, index) => {
                const comercial = getComercialUi(r);
                const levant = getLevantamientoUi(r);

                const missCount = r._missing?.length || 0;
                const missTxt = missingLabels(r).join(", ");

                const missEmpresa = r._missing?.includes("empresa");
                const missNombre = r._missing?.includes("nombre");
                const missCorreo = r._missing?.includes("correo");
                const missTelefono = r._missing?.includes("telefono");
                const missExtension = r._missing?.includes("extension");
                const missCelular = r._missing?.includes("celular");

                return (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="p-3 text-slate-700">{index + 1}</td>

                    <td className={cellClass(missEmpresa)} title={missEmpresa ? "Campo faltante" : ""}>
                      {isEmpty(r.empresa) ? <span className="opacity-70">—</span> : r.empresa}
                    </td>

                    <td className={cellClass(missNombre)} title={missNombre ? "Campo faltante" : ""}>
                      {isEmpty(r.nombre) ? <span className="opacity-70">—</span> : r.nombre}
                    </td>

                    <td className={cellClass(missCorreo)} title={missCorreo ? "Campo faltante" : ""}>
                      {isEmpty(r.correo) ? <span className="opacity-70">—</span> : r.correo}
                    </td>

                    <td className={cellClass(missTelefono)} title={missTelefono ? "Campo faltante" : ""}>
                      {isEmpty(r.telefono) ? <span className="opacity-70">—</span> : r.telefono}
                    </td>

                    <td className={cellClass(missExtension)} title={missExtension ? "Campo faltante" : ""}>
                      {isEmpty(r.extension) ? <span className="opacity-70">—</span> : r.extension}
                    </td>

                    <td className={cellClass(missCelular)} title={missCelular ? "Campo faltante" : ""}>
                      {isEmpty(r.celular) ? <span className="opacity-70">—</span> : r.celular}
                    </td>

                    <td className="p-3">
                      {missCount === 0 ? (
                        <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                          Completo
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span
                            className="inline-flex w-fit px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs"
                            title={missTxt}
                          >
                            {missCount} faltante{missCount === 1 ? "" : "s"}
                          </span>
                          <span className="text-xs text-slate-500 line-clamp-1" title={missTxt}>
                            {missTxt}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {(() => {
                        const fechaIso = comercial.fecha;                 // ISO
                        const waitMs = fechaIso ? msUntilThreeHoursAfter(fechaIso) : null;
                        const canClose = comercial.estadoUi === "AUTORIZADA" && waitMs !== null && waitMs <= 0;

                        const showAgendar =
                          comercial.estadoUi === "SIN_COMERCIAL" ||
                          comercial.estadoUi === "RECHAZADA";

                        return (
                          <div className="flex flex-col gap-2">
                            {/* Badges / fecha / nota */}
                            <div className="flex flex-col gap-1">
                              {comercial.estadoUi === "SIN_COMERCIAL" && (
                                <span className="inline-flex px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs w-fit">
                                  Sin comercial
                                </span>
                              )}

                              {comercial.estadoUi === "PENDIENTE" && (
                                <span className="inline-flex px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs w-fit">
                                  Pendiente
                                </span>
                              )}

                              {comercial.estadoUi === "AUTORIZADA" && (
                                <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs w-fit">
                                  Autorizada
                                </span>
                              )}

                              {comercial.estadoUi === "RECHAZADA" && (
                                <span
                                  className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs w-fit"
                                  title={comercial.motivo ? `Motivo: ${comercial.motivo}` : "Rechazada"}
                                >
                                  Rechazada
                                </span>
                              )}

                              {comercial.fecha && (
                                <span className="text-xs text-slate-500">
                                  {formatFechaHora(comercial.fecha)}
                                </span>
                              )}

                              {/* Hint de 3 horas */}
                              {comercial.estadoUi === "AUTORIZADA" && waitMs !== null && waitMs > 0 && (
                                <span className="text-[11px] text-slate-500">
                                  Disponible para cerrar en {formatRemaining(waitMs)}
                                </span>
                              )}

                              {/* Nota (tooltip) */}
                              {r.next_comercial_nota && String(r.next_comercial_nota).trim() && (
                                <div className="relative group w-fit">
                                  <button
                                    type="button"
                                    className="mt-1 text-slate-400 hover:text-slate-600"
                                    title="Ver nota"
                                  >
                                    <MessageSquareText className="w-4 h-4" />
                                  </button>
                                  <div className="absolute z-[9999] hidden group-hover:block bottom-full left-0 mb-2 w-72 max-w-[20rem] rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-xs text-slate-700 whitespace-pre-wrap">
                                    {r.next_comercial_nota}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap gap-2">
                              {/* Marcar realizada */}
                              {canClose && (
                                <button
                                  type="button"
                                  onClick={() => marcarRealizada(r.next_comercial_id)}
                                  className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                  title="Marcar visita como realizada"
                                >
                                  Marcar realizada
                                </button>
                              )}

                              {/* Agendar nueva */}

                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        {levant.estadoUi === "SIN_LEVANTAMIENTO" && (
                          <span className="inline-flex px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs">
                            Sin levantamiento
                          </span>
                        )}

                        {levant.estadoUi === "PROGRAMADA" && (
                          <span className="inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                            Programada
                          </span>
                        )}

                        {levant.estadoUi === "VENCIDA" && (
                          <span className="inline-flex px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs">
                            Vencida
                          </span>
                        )}

                        {levant.tipo && (
                          <span className="text-xs text-slate-600">
                            {String(levant.tipo).toUpperCase()}
                          </span>
                        )}

                        {levant.fecha && (
                          <span className="text-xs text-slate-500">
                            {formatFechaHora(levant.fecha)}
                          </span>
                        )}

                        {levant.nota && String(levant.nota).trim() && (
                          <div className="relative group w-fit">
                            <button
                              type="button"
                              className="mt-1 text-slate-400 hover:text-slate-600"
                              title="Ver nota"
                            >
                              <MessageSquareText className="w-4 h-4" />
                            </button>
                            <div className="absolute z-20 hidden group-hover:block top-6 left-0 w-64 rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-xs text-slate-700">
                              {levant.nota}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {missCount > 0 && (
                          <button
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800"
                            onClick={() => openAddInfo(r)}
                            type="button"
                            title="Completar campos faltantes"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Completar
                          </button>
                        )}

                        {/* Comercial: Ventas puede agendar (si no existe o si rechazada) */}
                        {comercial.canAgendar && (
                          <button
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800"
                            onClick={() => openComercialModal(r)}
                            type="button"
                            title="Agendar visita comercial"
                          >
                            <CalendarPlus className="w-4 h-4" />
                            Comercial
                          </button>
                        )}

                        {/* Levantamiento: puede agendar o reagendar si vencida */}
                        {(levant.canAgendar || levant.canReagendar) && (
                          <button
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 disabled:opacity-50"
                            onClick={() => openLevantamientoModal(r)}
                            type="button"
                            disabled={levant.isBloqueada}
                            title={levant.canReagendar ? "Reagendar levantamiento" : "Agendar levantamiento"}
                          >
                            <CalendarPlus className="w-4 h-4" />
                            {levant.canReagendar ? "Reagendar" : "Levantamiento"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modales/Form */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Completar información</div>
              </div>
              <button
                className="px-3 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIELDS.map((f) => {
                const hasValue = !isEmpty(selected[f.key]);
                const editable = isEmpty(selected[f.key]); // SOLO si está vacío
                const value = editable ? (form[f.key] ?? "") : selected[f.key];

                return (
                  <label key={f.key} className="block">
                    <span className="text-xs text-slate-600">{f.label}</span>
                    <input
                      className={[
                        "mt-1 w-full rounded-lg border px-3 py-2 text-sm",
                        editable ? "border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200" : "border-slate-200 bg-slate-50 text-slate-500",
                      ].join(" ")}
                      value={value ?? ""}
                      disabled={hasValue} // bloquea los llenos
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={editable ? "Captura..." : "Ya registrado"}
                    />
                  </label>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
                onClick={saveMissing}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {comercialOpen && comercialFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Agendar visita comercial</div>
                <div className="text-xs text-slate-600">
                  Cliente: {comercialFor.empresa} — {comercialFor.nombre}
                </div>
              </div>
              <button
                className="px-3 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setComercialOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs text-slate-600">Fecha</span>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={comercialForm.fecha}
                    onChange={(e) => setComercialForm((p) => ({ ...p, fecha: e.target.value }))}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-slate-600">Hora</span>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={comercialForm.hora}
                    onChange={(e) => setComercialForm((p) => ({ ...p, hora: e.target.value }))}
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-slate-600">Notas</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[100px]"
                  value={comercialForm.nota}
                  onChange={(e) => setComercialForm((p) => ({ ...p, nota: e.target.value }))}
                  placeholder="Objetivo de la visita, asistentes, contexto..."
                />
              </label>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={() => setComercialOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-[#03045e] text-white hover:opacity-90"
                onClick={saveComercial}
              >
                Guardar visita
              </button>
            </div>
          </div>
        </div>
      )}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Nuevo cliente</h2>
                <p className="text-sm text-slate-500">Captura los datos generales del cliente.</p>
              </div>

              <button
                className="rounded-lg p-2 hover:bg-slate-50"
                onClick={() => setCreateOpen(false)}
                type="button"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              {createError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Empresa *</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.empresa}
                    onChange={(e) => updateCreateForm("empresa", e.target.value)}
                    placeholder="Ej. Marinela"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Nombre *</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.nombre}
                    onChange={(e) => updateCreateForm("nombre", e.target.value)}
                    placeholder="Ej. Pedro Pérez"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Dirección *</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.direccion}
                    onChange={(e) => updateCreateForm("direccion", e.target.value)}
                    placeholder="Calle, número, colonia, ciudad..."
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Correo *</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.correo}
                    onChange={(e) => updateCreateForm("correo", e.target.value)}
                    placeholder="correo@empresa.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Tipo de contacto *</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
                    value={createForm.tipo_contacto}
                    onChange={(e) => updateCreateForm("tipo_contacto", e.target.value)}
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="TELEFONO">Teléfono</option>
                    <option value="CORREO">Correo</option>
                    <option value="VISITA">Visita</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-600">Teléfono *</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.telefono}
                    onChange={(e) => updateCreateForm("telefono", e.target.value)}
                    placeholder="Ej. 0123456789"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Extensión</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.extension}
                    onChange={(e) => updateCreateForm("extension", e.target.value)}
                    placeholder="Ej. 123"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Celular *</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={createForm.celular}
                    onChange={(e) => updateCreateForm("celular", e.target.value)}
                    placeholder="Ej. 9876543210"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-5">
              <button
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={() => setCreateOpen(false)}
                type="button"
                disabled={creating}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={createCliente}
                disabled={creating}
              >
                {creating ? "Guardando..." : "Guardar cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}