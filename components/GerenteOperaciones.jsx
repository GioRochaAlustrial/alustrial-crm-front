"use client"

import { useEffect, useState } from "react"

export default function GerenteOperaciones() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/citas/autorizaciones")
      if (res.ok) {
        const data = await res.json()
        setItems(data || [])
      } else {
        setItems([])
      }
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function doAutorizar(id) {
    if (!confirm("Autorizar esta cita?")) return
    const res = await fetch(`/api/citas/${id}/autorizar`, { method: "PUT" })
    if (res.ok) load()
    else alert("Error al autorizar")
  }

  async function doRechazar(id) {
    const motivo = prompt("Motivo de rechazo:")
    if (!motivo) return alert('Motivo requerido')
    const res = await fetch(`/api/citas/${id}/rechazar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo }),
    })
    if (res.ok) load()
    else alert("Error al rechazar")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Autorizaciones pendientes</h1>
      {loading && <div>Cargando...</div>}
      {!loading && items.length === 0 && <div>No hay autorizaciones pendientes.</div>}
      {!loading && items.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>ID</th>
              <th>Prospecto</th>
              <th>Fecha</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="py-2">{it.id}</td>
                <td>{it.nombre_prospecto || it.id_prospectos || '-'}</td>
                <td>{it.fecha_hora || '-'}</td>
                <td>{it.categoria || '-'}</td>
                <td>{it.tipo || '-'}</td>
                <td className="py-2">
                  <button onClick={() => doAutorizar(it.id)} className="mr-2 px-3 py-1 bg-green-600 text-white rounded">Autorizar</button>
                  <button onClick={() => doRechazar(it.id)} className="px-3 py-1 bg-red-600 text-white rounded">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
