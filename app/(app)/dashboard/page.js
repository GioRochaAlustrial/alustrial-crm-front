"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

async function safeJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-200">
      {children}
    </span>
  );
}

function ProspectoCard({ p, usuarioRol, onDocs, onCita, onEdit, setCitaEstado, nowTick }) {
  const initials = (p?.empresa || p?.nombre || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0].toUpperCase())
    .join("");

  const citaFecha = p.next_cita_fecha_hora ? new Date(p.next_cita_fecha_hora) : null;
  const estado = p.next_cita_estado || null;

  const citaEnElFuturo = citaFecha ? citaFecha.getTime() > nowTick : false;
  const noAtendida = estado === "PROGRAMADA" && citaFecha && citaFecha.getTime() < nowTick;

  // ✅ usa el rol que viene del Dashboard (prop), NO p.usuario_rol
  const rol = usuarioRol;
  const puedeReagendar = rol === "VENTAS" || rol === "ADMIN";

  // ✅ si hay cita PROGRAMADA (futura o vencida), VENTAS/ADMIN verá "Reprogramar"
  const mostrarReagendar = Boolean(p.next_cita_id) && estado === "PROGRAMADA" && puedeReagendar;

  return (
    <div
      className={`rounded-2xl border overflow-hidden
        ${noAtendida ? "border-red-700 bg-red-950/20" : "border-neutral-800 bg-neutral-900/40"}
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-neutral-800 grid place-items-center text-sm font-semibold text-neutral-100">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-semibold leading-tight">
              {p.empresa || "Sin empresa"}
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              {p.direccion || "Sin dirección"}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{p.tipo_contacto}</Badge>
              <Badge>{p.tipo_proyecto}</Badge>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-neutral-400 hover:text-neutral-100 text-sm"
          title="Editar"
        >
          ✎
        </button>
      </div>

      {/* ... todo lo demás igual ... */}

      <div className="border-t border-neutral-800 bg-neutral-950/40 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onDocs}
            className="rounded-xl border border-neutral-700 px-3 py-2 text-xs text-neutral-100 hover:bg-neutral-900"
          >
            Documentos
          </button>

          <button
            type="button"
            onClick={onCita}
            className="rounded-xl border border-neutral-700 px-3 py-2 text-xs text-neutral-100 hover:bg-neutral-900"
          >
            {mostrarReagendar ? "Reprogramar cita" : "Agendar cita"}
          </button>

          {p.next_cita_id && estado === "PROGRAMADA" && (
            <>
              {rol === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => setCitaEstado(p.next_cita_id, "CANCELADA")}
                  className="rounded-xl border border-neutral-700 px-3 py-2 text-xs hover:bg-neutral-900"
                >
                  Cancelar cita
                </button>
              )}

              {(rol === "ESPECIALISTA" || rol === "ADMIN") && (
                <button
                  type="button"
                  disabled={citaEnElFuturo}
                  onClick={() => {
                    if (citaEnElFuturo) {
                      alert("No puedes cerrar la cita antes de la fecha programada.");
                      return;
                    }
                    setCitaEstado(p.next_cita_id, "REALIZADA");
                  }}
                  className={`rounded-xl px-3 py-2 text-xs ${citaEnElFuturo
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-100 text-neutral-950 hover:opacity-90"
                    }`}
                >
                  Marcar realizada
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const PLACEHOLDER = "__placeholder__";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prospectos, setProspectos] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usuarioNombre, setUsuarioNombre] = useState("");
  const [usuarioRol, setUsuarioRol] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    direccion: "",
    telefono: "",
    extension: "",
    celular: "",
    correo: "",
    tipo_contacto: PLACEHOLDER,
    tipo_proyecto: PLACEHOLDER,
  });
  const [editForm, setEditForm] = useState({
    nombre: "",
    empresa: "",
    direccion: "",
    telefono: "",
    extension: "",
    celular: "",
    correo: "",
    tipo_contacto: PLACEHOLDER,
    tipo_proyecto: PLACEHOLDER,
  });
  const canSave = useMemo(() => {
    return (
      form.nombre.trim() &&
      form.empresa.trim() &&
      form.direccion.trim() &&
      form.telefono.trim() &&
      form.celular.trim() &&
      form.correo.trim() &&
      form.tipo_contacto !== PLACEHOLDER &&
      form.tipo_proyecto !== PLACEHOLDER
    );
  }, [form]);
  const [citaOpen, setCitaOpen] = useState(false);
  const [citaSaving, setCitaSaving] = useState(false);
  const [citaProspecto, setCitaProspecto] = useState(null);
  const [citaForm, setCitaForm] = useState({
    fecha_hora: "",
    nota: "",
  });
  const [nowTick, setNowTick] = useState(Date.now());
  const [citaMode, setCitaMode] = useState("CREATE");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function loadProspectos() {
    setError(null);
    setLoading(true);

    try {
      const r = await fetch("/api/prospectos", { cache: "no-store" });
      const data = await safeJson(r);

      if (!r.ok) {
        throw new Error(data?.error || "No se pudieron cargar prospectos");
      }

      const arr = Array.isArray(data) ? data : (data?.prospectos || []);
      setProspectos(arr);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProspectos();

    (async () => {
      try {
        const r = await fetch("/api/auth/profile", { cache: "no-store" });
        const data = await safeJson(r);
        if (r.ok) {
          setUsuarioNombre(data?.nombre || "");
          setUsuarioRol(data?.rol || "");
        }
      } catch {
        // no-op
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60_000); // cada 60s
    return () => clearInterval(id);
  }, []);

  function openModal() {
    setForm({
      nombre: "",
      empresa: "",
      direccion: "",
      telefono: "",
      extension: "",
      celular: "",
      correo: "",
      tipo_contacto: PLACEHOLDER,
      tipo_proyecto: PLACEHOLDER,
    });
    setError(null);
    setOpen(true);
  }

  function openEditModal(p) {
    try {
      console.log("EDIT", p);
      setEditId(p.id);
      setEditForm({
        nombre: p.nombre || "",
        empresa: p.empresa || "",
        direccion: p.direccion || "",
        telefono: p.telefono || "",
        extension: p.extension || "",
        celular: p.celular || "",
        correo: p.correo || "",
        tipo_contacto: p.tipo_contacto || PLACEHOLDER,
        tipo_proyecto: p.tipo_proyecto || PLACEHOLDER,
      });
      setError(null);
      setEditOpen(true);
    } catch (e) {
      console.error("openEditModal error:", e);
      setError(e?.message || "Error al abrir edición");
    }
  }

  async function updateProspecto(e) {
    e.preventDefault();
    if (!editId) return;

    // Validación (igual que crear: selects obligatorios)
    if (
      !editForm.nombre.trim() ||
      !editForm.empresa.trim() ||
      !editForm.direccion.trim() ||
      !editForm.telefono.trim() ||
      !editForm.celular.trim() ||
      !editForm.correo.trim() ||
      editForm.tipo_contacto === PLACEHOLDER ||
      editForm.tipo_proyecto === PLACEHOLDER
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setEditSaving(true);
    setError(null);

    try {
      const r = await fetch(`/api/prospectos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const text = await r.text();
      const data = text ? JSON.parse(text) : null;

      if (!r.ok) {
        throw new Error(data?.error || `Error ${r.status}: no se pudo actualizar`);
      }

      await loadProspectos();
      setEditOpen(false);
    } catch (e) {
      console.error("updateProspecto error:", e);
      setError(e.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function createProspecto(e) {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setError(null);

    try {
      const r = await fetch("/api/prospectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await safeJson(r);

      if (!r.ok) {
        throw new Error(data?.error || "No se pudo crear el prospecto");
      }

      // refrescar lista
      await loadProspectos();
      setOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function openCitaModal(p) {
    setCitaProspecto(p);

    // ✅ si ya hay cita PROGRAMADA (futura o vencida) → REPROGRAM
    if (p?.next_cita_id && p?.next_cita_estado === "PROGRAMADA") {
      setCitaMode("REPROGRAM");
    } else {
      setCitaMode("CREATE");
    }

    setCitaForm({ fecha_hora: "", nota: "" });
    setError(null);
    setCitaOpen(true);
  }

  async function safeJsonFromResponse(res) {
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return { error: text }; }
  }

  async function createCita(e) {
    e.preventDefault();
    if (!citaProspecto) return;

    // Validación básica
    if (!citaForm.fecha_hora) {
      setError("Selecciona fecha y hora.");
      return;
    }

    // Validación: no permitir pasado
    const dt = new Date(citaForm.fecha_hora);
    if (Number.isNaN(dt.getTime())) {
      setError("Fecha y hora inválidas.");
      return;
    }
    if (dt.getTime() < Date.now()) {
      setError("No puedes agendar una cita en el pasado. Cambia la fecha y/o la hora.");
      return;
    }
    if (!puedeReprogramar && citaProspecto?.next_cita_id) {
      setError("No tienes permisos para reprogramar citas.");
      return;
    }

    const fecha_hora = `${citaForm.fecha_hora}:00`;

    const rol = citaProspecto?.usuario_rol; // viene del backend o cookie/profile
    const puedeReprogramar = rol === "VENTAS" || rol === "ADMIN";

    // ✅ Reprogramar SOLO si:
    // - el usuario puede reprogramar (VENTAS o ADMIN)
    // - existe next_cita_id
    // - y el estado actual es PROGRAMADA
    const isReprogramar =
      Boolean(citaProspecto?.next_cita_id) &&
      citaProspecto?.next_cita_estado === "PROGRAMADA" &&
      puedeReprogramar;

    setCitaSaving(true);
    setError(null);

    try {
      const url = isReprogramar
        ? `/api/citas/${citaProspecto.next_cita_id}/reprogramar`
        : `/api/prospectos/${citaProspecto.id}/citas`;

      const res = await fetch(url, {
        method: isReprogramar ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha_hora, nota: citaForm.nota }),
      });

      const data = await safeJsonFromResponse(res);

      if (!res.ok) {
        // Solo aplica al crear (POST). En reprogramar (PUT) ya no debería salir este error.
        if (!isReprogramar && data?.error === "CITA_YA_PROGRAMADA") {
          throw new Error(
            `Ya hay una cita programada: ${new Date(data.next_cita).toLocaleString()}`
          );
        }
        throw new Error(data?.error || "No se pudo guardar la cita");
      }

      await loadProspectos();
      setCitaOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCitaSaving(false);
    }
  }

  async function setCitaEstado(citaId, estado) {
    if (!citaId) return;

    setError(null);
    try {
      const r = await fetch(`/api/citas/${citaId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      const data = await safeJson(r); // usa tu helper safeJson de arriba

      if (!r.ok) {
        // ✅ Caso especial: intentar cerrar antes de la fecha
        if (data?.error === "CITA_AUN_NO_OCURRE" && estado === "REALIZADA") {
          alert("No puedes marcar la cita como realizada porque aún no se llega a la fecha programada.");
          return;
        }

        throw new Error(data?.error || "No se pudo actualizar el estado");
      }

      await loadProspectos(); // refresca next_cita
    } catch (e) {
      setError(e.message);
    }
  }

  const minDateTime = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // para formato local
    return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }, []);

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Prospectos</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {usuarioNombre && (
              <div className="text-sm text-neutral-300">{usuarioNombre}</div>
            )}

            <div className="flex gap-2">
              <button
                onClick={openModal}
                className="rounded-xl bg-neutral-100 text-neutral-950 font-medium px-4 py-2"
              >
                Nuevo prospecto
              </button>

              <button
                onClick={logout}
                className="rounded-xl border border-neutral-700 text-neutral-100 font-medium px-4 py-2"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
          {loading && <div className="p-4 text-neutral-300">Cargando...</div>}

          {error && (
            <div className="p-4 text-sm text-red-200 bg-red-950/30 border-t border-red-900">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-6">
              {prospectos.length === 0 ? (
                <div className="p-4 text-neutral-400 rounded-2xl border border-neutral-800 bg-neutral-900/40">
                  No hay prospectos.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {prospectos.map((p) => (
                    <ProspectoCard
                      key={p.id}
                      p={p}
                      usuarioRol={usuarioRol}
                      nowTick={nowTick}
                      onDocs={() => alert(`Docs/Fotos/Planos: ${p.nombre}`)}
                      onCita={() => openCitaModal(p)}
                      setCitaEstado={setCitaEstado}
                      onEdit={() => openEditModal(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/60 grid place-items-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Nuevo prospecto</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-100"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={createProspecto} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Nombre</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Empresa</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.empresa}
                      onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Dirección</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.direccion}
                      onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Teléfono</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">
                      Extensión (opcional)
                    </label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.extension}
                      onChange={(e) => setForm({ ...form, extension: e.target.value })}
                      placeholder="Ej: 101"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Celular</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.celular}
                      onChange={(e) => setForm({ ...form, celular: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Correo</label>
                    <input
                      type="email"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.correo}
                      onChange={(e) => setForm({ ...form, correo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Tipo de contacto</label>
                    <select
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.tipo_contacto}
                      onChange={(e) => setForm({ ...form, tipo_contacto: e.target.value })}
                    >
                      <option value={PLACEHOLDER}>Selecciona una opción...</option>
                      <option value="Recomendación">Recomendación</option>
                      <option value="Teléfono">Teléfono</option>
                      <option value="Redes Sociales">Redes Sociales</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Tipo de proyecto</label>
                    <select
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={form.tipo_proyecto}
                      onChange={(e) => setForm({ ...form, tipo_proyecto: e.target.value })}
                    >
                      <option value={PLACEHOLDER}>Selecciona una opción...</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Electrica">Electrica</option>
                      <option value="Civil">Civil</option>
                      <option value="ATM/Control">ATM/Control</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-neutral-700 px-4 py-2"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={!canSave || saving}
                    className="rounded-xl bg-neutral-100 text-neutral-950 font-medium px-4 py-2 disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {editOpen && (
          <div className="fixed inset-0 bg-black/60 grid place-items-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Editar prospecto</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="text-neutral-400 hover:text-neutral-100"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={updateProspecto} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Nombre</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.nombre}
                      onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Empresa</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.empresa}
                      onChange={(e) => setEditForm({ ...editForm, empresa: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-neutral-300">Dirección</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.direccion}
                      onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Teléfono</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.telefono}
                      onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Extensión (opcional)</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.extension}
                      onChange={(e) => setEditForm({ ...editForm, extension: e.target.value })}
                      placeholder="Ej: 101"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Celular</label>
                    <input
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.celular}
                      onChange={(e) => setEditForm({ ...editForm, celular: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Correo</label>
                    <input
                      type="email"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.correo}
                      onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Tipo de contacto</label>
                    <select
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.tipo_contacto}
                      onChange={(e) => setEditForm({ ...editForm, tipo_contacto: e.target.value })}
                      required
                    >
                      <option value={PLACEHOLDER}>Selecciona una opción...</option>
                      <option value="Recomendación">Recomendación</option>
                      <option value="Teléfono">Teléfono</option>
                      <option value="Redes Sociales">Redes Sociales</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-neutral-300">Tipo de proyecto</label>
                    <select
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                      value={editForm.tipo_proyecto}
                      onChange={(e) => setEditForm({ ...editForm, tipo_proyecto: e.target.value })}
                      required
                    >
                      <option value={PLACEHOLDER}>Selecciona una opción...</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Electrica">Electrica</option>
                      <option value="Civil">Civil</option>
                      <option value="ATM/Control">ATM/Control</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="rounded-xl border border-neutral-700 px-4 py-2"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={editSaving}
                    className="rounded-xl bg-neutral-100 text-neutral-950 font-medium px-4 py-2 disabled:opacity-60"
                  >
                    {editSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {citaOpen && (
          <div className="fixed inset-0 bg-black/60 grid place-items-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Agendar cita {citaProspecto ? `— ${citaProspecto.empresa}` : ""}
                </h2>
                <button
                  type="button"
                  onClick={() => setCitaOpen(false)}
                  className="text-neutral-400 hover:text-neutral-100"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={createCita} className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-neutral-300">Fecha y hora</label>
                  <input
                    type="datetime-local"
                    min={minDateTime}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                    value={citaForm.fecha_hora}
                    onChange={(e) => setCitaForm({ ...citaForm, fecha_hora: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-neutral-300">Nota (opcional)</label>
                  <textarea
                    className="w-full min-h-[90px] rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                    value={citaForm.nota}
                    onChange={(e) => setCitaForm({ ...citaForm, nota: e.target.value })}
                    placeholder="Ej: Levantamiento en sitio, traer planos, confirmar acceso..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCitaOpen(false)}
                    className="rounded-xl border border-neutral-700 px-4 py-2"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={citaSaving}
                    className="rounded-xl bg-neutral-100 text-neutral-950 font-medium px-4 py-2 disabled:opacity-60"
                  >
                    {citaSaving ? "Guardando..." : "Agendar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}