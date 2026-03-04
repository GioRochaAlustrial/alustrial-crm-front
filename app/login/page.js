"use client"

import Image from "next/image"
import { useState } from "react"

export default function LoginPage() {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    const res = await fetch("/api/auth/login", { 
    method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena: password }),
      credentials: "include", 
    })

    const data = await res.json().catch(() => ({}))
console.log("Status:", res.status);
console.log("Data:", data);
    if (!res.ok) {
      setError(data?.error || "Credenciales incorrectas")
      return
    }
localStorage.setItem("token", data.token);
   setTimeout(() => {
  window.location.href = "/dashboard";
}, 300);
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/fondo.jpeg"            // ✅ tu imagen real en /public
          alt="Fondo Alustrial"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay corporativo (azul institucional) */}
        <div className="absolute inset-0 bg-[#03045e]/75" />
        {/* Degradado sutil para look institucional */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
      </div>

      {/* Contenido central */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-md border border-slate-200">
          {/* Header institucional */}
          <div className="px-10 pt-10 pb-6 border-b border-slate-200">
            <div className="flex justify-center">
              <Image
                src="/alustrial-logo.png"
                alt="Alustrial México"
                width={210}
                height={70}
                priority
                className="object-contain"
              />
            </div>

            <h1 className="mt-6 text-xl font-semibold text-center text-[#03045e] tracking-wide">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-sm text-center text-slate-500">
              Acceso al sistema interno
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-8">
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#023e8a] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#023e8a] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#03045e] hover:bg-[#023e8a] text-white py-2.5 rounded-md font-medium transition-colors duration-200"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer institucional */}
      <footer className="relative z-10 text-center text-white/85 text-xs sm:text-sm py-4 border-t border-white/15 bg-black/25">
        <div>© {new Date().getFullYear()} Alustrial México. Todos los derechos reservados.</div>
        <div className="mt-1 text-white/70">
          Uso interno. Soporte: TI
        </div>
      </footer>
    </div>
  )
}