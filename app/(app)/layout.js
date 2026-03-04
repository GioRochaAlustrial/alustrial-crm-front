"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function AppLayout({ children }) {
  const [rol, setRol] = useState("")

  useEffect(() => {
    ; (async () => {
      const res = await fetch(`/api/auth/me`)
      if (res.ok) {
        const data = await res.json()
        setRol(data.usuario?.rol || "")
      } else {
        setRol("")
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex">
      <Sidebar rol={rol} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  )
}