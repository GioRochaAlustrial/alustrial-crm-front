// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useRef } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import { LayoutDashboard, Briefcase, Users, ClipboardList, CalendarCheck2, LogOut ,Upload} from "lucide-react"

// export default function Sidebar({ rol = "" }) {
//   const pathname = usePathname()

//   const role = String(rol || "").trim().toUpperCase()
//   const isVentas = role === "VENTAS"
//   const isAdmin = role === "ADMIN"
//   const isEspe = role === "ESPECIALISTA"
//   const isGerente = role === "GERENTE" || role === "DIRECTOR"

//   const isActiveExact = (href) => pathname === href
//   const isActivePrefix = (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
//   const espeActive = isActivePrefix("/especialista")

//   const itemBase =
//     "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition w-full"
//   const itemIdle = "text-white/80 hover:bg-white/10 hover:text-white"
//   const itemActive =
//     "bg-white/10 text-white border-l-4 border-brand-500 pl-3"

//   // Ventas se considera “activa” si estás en cualquier ruta /ventas/*
//   const ventasActive = isActivePrefix("/ventas")
// const handleUploadClick = () => fileInputRef.current?.click()

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     try {
//       const filePath = `Alustrial-CRM-Storage/${Date.now()}-${file.name}`
//       const { data, error } = await supabase.storage
//         .from("Alustrial-CRM-Storage")
//         .upload(filePath, file)

//       if (error) throw error

//       const { data: publicData } = supabase.storage
//         .from("Alustrial-CRM-Storage")
//         .getPublicUrl(filePath)

//       console.log("✅ Archivo subido:", publicData.publicUrl)
//       toast?.success?.("Archivo subido correctamente")

//     } catch (err) {
//       console.error("❌ Error al subir archivo:", err.message)
//       toast?.error?.("Error al subir el archivo")
//     } finally {
//       e.target.value = "" // limpiar input
//     }
//   }
//   return (
//     <aside className="w-72 min-h-screen bg-[#03045e] text-white flex flex-col">
//       {/* Logo corporativo centrado */}
//       <div className="h-32 border-b border-white/10 flex items-center justify-center px-6">
//         <Image
//           src="/alustrial-logo.png"
//           alt="Alustrial"
//           width={220}
//           height={80}
//           className="object-contain w-full h-auto"
//           priority
//         />
//       </div>

//       {/* Navegación */}
//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         <Link
//           href="/dashboard"
//           className={[
//             itemBase,
//             isActiveExact("/dashboard") ? itemActive : itemIdle,
//           ].join(" ")}
//         >
//           <LayoutDashboard size={18} className={isActiveExact("/dashboard") ? "text-brand-200" : "text-white/80"} />
//           <span>Dashboard</span>
//         </Link>

//         {/* Ventas (solo rol ventas) */}
//         {(isVentas || isAdmin) && (
//           <div className={`group ${ventasActive ? "bg-white/0" : ""}`}>
//             {/* Item principal Ventas */}
//             <div
//               className={[
//                 itemBase,
//                 ventasActive ? itemActive : itemIdle,
//                 "cursor-pointer select-none",
//               ].join(" ")}
//             >
//               <Briefcase size={18} className={ventasActive ? "text-brand-200" : "text-white/80"} />
//               <span className="flex-1">Ventas</span>
//               <span className={`text-xs ${ventasActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
//                 ▾
//               </span>
//             </div>

//             {/* Submenú:
//                 - visible en hover
//                 - O visible si estás en /ventas/*
//             */}
//             <div className={`pl-8 mt-1 space-y-1 ${ventasActive ? "block" : "hidden group-hover:block"}`}>
//               <Link
//                 href="/ventas/clientes"
//                 className={[
//                   itemBase,
//                   isActiveExact("/ventas/clientes") ? itemActive : itemIdle,
//                 ].join(" ")}
//               >
//                 <Users size={17} className={isActiveExact("/ventas/clientes") ? "text-brand-200" : "text-white/80"} />
//                 <span>Clientes</span>
//               </Link>
//             </div>
//           </div>
//         )}
//         {/* Proyectos (solo rol especialista) */}
//         {(isEspe || isAdmin) && (
//           <div className={`group ${espeActive ? "bg-white/0" : ""}`}>
//             {/* Item principal Proyectos */}
//             <div
//               className={[
//                 itemBase,
//                 espeActive ? itemActive : itemIdle,
//                 "cursor-pointer select-none",
//               ].join(" ")}
//             >
//               <ClipboardList size={18} className={espeActive ? "text-brand-200" : "text-white/80"} />
//               <span className="flex-1">Proyectos</span>
//               <span className={`text-xs ${espeActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
//                 ▾
//               </span>
//             </div>

//             {/* Submenú */}
//             <div className={`pl-8 mt-1 space-y-1 ${espeActive ? "block" : "hidden group-hover:block"}`}>
//               <Link
//                 href="/especialista/citas"
//                 className={[
//                   itemBase,
//                   isActiveExact("/especialista/citas") ? itemActive : itemIdle,
//                 ].join(" ")}
//               >
//                 <CalendarCheck2 size={17} className={isActiveExact("/especialista/citas") ? "text-brand-200" : "text-white/80"} />
//                 <span>Citas</span>
//               </Link>
//             </div>
//           </div>
//         )}

//           {/* Gerencia: Autorizaciones */}
//           {(isGerente || isAdmin) && (
//             <div className={`group ${isActivePrefix("/gerente") ? "bg-white/0" : ""}`}>
//               <Link
//                 href="/gerente/operaciones"
//                 className={[
//                   itemBase,
//                   isActiveExact("/gerente/operaciones") ? itemActive : itemIdle,
//                 ].join(" ")}
//               >
//                 <ClipboardList size={18} className={isActiveExact("/gerente/operaciones") ? "text-brand-200" : "text-white/80"} />
//                 <span>Citas</span>
//               </Link>
//             </div>
//           )}
//       </nav>
//  {/* Botón subir archivo */}
//       <div className="p-4 border-t border-white/10">
//         <button
//           onClick={handleUploadClick}
//           className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm bg-white/10 hover:bg-white/20 transition"
//         >
//           <Upload size={18} className="text-white/80" />
//           <span>Subir archivo</span>
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </div>
//       {/* Footer */}
//       <div className="mt-auto p-4 border-t border-white/10">
//         <button
//           className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm ${itemIdle}`}
//           onClick={async () => {
//             await fetch("/api/auth/logout", { method: "POST" })
//             window.location.href = "/login"
//           }}
//         >
//           <LogOut size={18} className="text-white/80" />
//           Logout
//         </button>
//       </div>
//     </aside>
//   )
// }
// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useRef } from "react"
// import { supabase } from "@/lib/supabaseClient"
// // import { toast } from "sonner" // opcional si usas toasts
// import {
//   LayoutDashboard,
//   Briefcase,
//   Users,
//   ClipboardList,
//   CalendarCheck2,
//   LogOut,
//   Upload
// } from "lucide-react"

// export default function Sidebar({ rol = "" }) {
//   const pathname = usePathname()
//   const fileInputRef = useRef(null)

//   const role = String(rol || "").trim().toUpperCase()
//   const isVentas = role === "VENTAS"
//   const isAdmin = role === "ADMIN"
//   const isEspe = role === "ESPECIALISTA"
//   const isGerente = role === "GERENTE" || role === "DIRECTOR"

//   const isActiveExact = (href) => pathname === href
//   const isActivePrefix = (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
//   const espeActive = isActivePrefix("/especialista")

//   const itemBase = "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition w-full"
//   const itemIdle = "text-white/80 hover:bg-white/10 hover:text-white"
//   const itemActive = "bg-white/10 text-white border-l-4 border-brand-500 pl-3"

//   const ventasActive = isActivePrefix("/ventas")

//   // 🔼 Manejador de subida
//   const handleUploadClick = () => fileInputRef.current?.click()

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     try {
//       // const filePath = `Alustrial-CRM-Storage/${Date.now()}-${file.name}`
//       const cleanName = file.name
//   .normalize("NFD")                // quita acentos (ó → o)
//   .replace(/[\u0300-\u036f]/g, "") // elimina marcas diacríticas
//   .replace(/[^a-zA-Z0-9.\-_]/g, "_") // reemplaza caracteres no válidos por "_"
// const filePath = `Alustrial-CRM-Storage/${Date.now()}-${cleanName}`
//       const { data, error } = await supabase.storage
//         .from("Alustrial-CRM-Storage")
//         .upload(filePath, file)

//       if (error) throw error

//       const { data: publicData } = supabase.storage
//         .from("Alustrial-CRM-Storage")
//         .getPublicUrl(filePath)

//       console.log("✅ Archivo subido:", publicData.publicUrl)
//       toast?.success?.("Archivo subido correctamente")

//     } catch (err) {
//       console.error("❌ Error al subir archivo:", err.message)
//       toast?.error?.("Error al subir el archivo")
//     } finally {
//       e.target.value = "" // limpiar input
//     }
//   }

//   return (
//     <aside className="w-72 min-h-screen bg-[#03045e] text-white flex flex-col">
//       {/* Logo corporativo */}
//       <div className="h-32 border-b border-white/10 flex items-center justify-center px-6">
//         <Image
//           src="/alustrial-logo.png"
//           alt="Alustrial"
//           width={220}
//           height={80}
//           className="object-contain w-full h-auto"
//           priority
//         />
//       </div>

//       {/* Navegación */}
//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         <Link
//           href="/dashboard"
//           className={[itemBase, isActiveExact("/dashboard") ? itemActive : itemIdle].join(" ")}
//         >
//           <LayoutDashboard size={18} className={isActiveExact("/dashboard") ? "text-brand-200" : "text-white/80"} />
//           <span>Dashboard</span>
//         </Link>

//         {/* Ventas */}
//         {(isVentas || isAdmin) && (
//           <div className={`group ${ventasActive ? "bg-white/0" : ""}`}>
//             <div className={[itemBase, ventasActive ? itemActive : itemIdle, "cursor-pointer select-none"].join(" ")}>
//               <Briefcase size={18} className={ventasActive ? "text-brand-200" : "text-white/80"} />
//               <span className="flex-1">Ventas</span>
//               <span className={`text-xs ${ventasActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
//                 ▾
//               </span>
//             </div>

//             <div className={`pl-8 mt-1 space-y-1 ${ventasActive ? "block" : "hidden group-hover:block"}`}>
//               <Link
//                 href="/ventas/clientes"
//                 className={[itemBase, isActiveExact("/ventas/clientes") ? itemActive : itemIdle].join(" ")}
//               >
//                 <Users size={17} className={isActiveExact("/ventas/clientes") ? "text-brand-200" : "text-white/80"} />
//                 <span>Clientes</span>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Proyectos */}
//         {(isEspe || isAdmin) && (
//           <div className={`group ${espeActive ? "bg-white/0" : ""}`}>
//             <div className={[itemBase, espeActive ? itemActive : itemIdle, "cursor-pointer select-none"].join(" ")}>
//               <ClipboardList size={18} className={espeActive ? "text-brand-200" : "text-white/80"} />
//               <span className="flex-1">Proyectos</span>
//               <span className={`text-xs ${espeActive ? "text-white/80" : "text-white/50"} group-hover:text-white/80`}>
//                 ▾
//               </span>
//             </div>

//             <div className={`pl-8 mt-1 space-y-1 ${espeActive ? "block" : "hidden group-hover:block"}`}>
//               <Link
//                 href="/especialista/citas"
//                 className={[itemBase, isActiveExact("/especialista/citas") ? itemActive : itemIdle].join(" ")}
//               >
//                 <CalendarCheck2 size={17} className={isActiveExact("/especialista/citas") ? "text-brand-200" : "text-white/80"} />
//                 <span>Citas</span>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Gerencia */}
//         {(isGerente || isAdmin) && (
//           <div className={`group ${isActivePrefix("/gerente") ? "bg-white/0" : ""}`}>
//             <Link
//               href="/gerente/operaciones"
//               className={[itemBase, isActiveExact("/gerente/operaciones") ? itemActive : itemIdle].join(" ")}
//             >
//               <ClipboardList size={18} className={isActiveExact("/gerente/operaciones") ? "text-brand-200" : "text-white/80"} />
//               <span>Citas</span>
//             </Link>
//           </div>
//         )}
//       </nav>

//       {/* Botón subir archivo */}
//       <div className="p-4 border-t border-white/10">
//         <button
//           onClick={handleUploadClick}
//           className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm bg-white/10 hover:bg-white/20 transition"
//         >
//           <Upload size={18} className="text-white/80" />
//           <span>Subir archivo</span>
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </div>

//       {/* Logout */}
//       <div className="p-4 border-t border-white/10">
//         <button
//           className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm ${itemIdle}`}
//           onClick={async () => {
//             await fetch("/api/auth/logout", { method: "POST" })
//             window.location.href = "/login"
//           }}
//         >
//           <LogOut size={18} className="text-white/80" />
//           Logout
//         </button>
//       </div>
//     </aside>
//   )
// }
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { supabase } from "@/lib/supabaseClient"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  CalendarCheck2,
  LogOut,
  Upload,
  Eye,
  X,
} from "lucide-react"

export default function Sidebar({ rol = "" }) {
  const pathname = usePathname()
  const fileInputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [archivos, setArchivos] = useState([])

  const role = String(rol || "").trim().toUpperCase()
  const isVentas = role === "VENTAS"
  const isAdmin = role === "ADMIN"
  const isEspe = role === "ESPECIALISTA"
  const isGerente = role === "GERENTE" || role === "DIRECTOR"

  const isActiveExact = (href) => pathname === href
  const isActivePrefix = (prefix) =>
    pathname === prefix || pathname.startsWith(prefix + "/")
  const espeActive = isActivePrefix("/especialista")
  const ventasActive = isActivePrefix("/ventas")

  const itemBase = "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition w-full"
  const itemIdle = "text-white/80 hover:bg-white/10 hover:text-white"
  const itemActive = "bg-white/10 text-white border-l-4 border-brand-500 pl-3"


  const [previewFile, setPreviewFile] = useState(null)

const handlePreview = (file) => {
  setPreviewFile(file)
}

const getPublicUrl = (file) => {
  const filePath = file.id || file.name || file.path;
  const { data } = supabase.storage
    .from("Alustrial-CRM-Storage")
    .getPublicUrl(filePath);
    console.log("Archivos obtenidos:", data);
  return data.publicUrl;
};
  // =============================
  // 🔼 SUBIR ARCHIVO
  // =============================
  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const cleanName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_")

      const filePath = `${Date.now()}-${cleanName}`

      const { data, error } = await supabase.storage
        .from("Alustrial-CRM-Storage")
        .upload(filePath, file)

      if (error) throw error

      alert("✅ Archivo subido correctamente")
      await fetchArchivos() // refresca la lista después de subir
    } catch (err) {
      console.error("❌ Error al subir archivo:", err.message)
      alert("Error al subir el archivo")
    } finally {
      e.target.value = ""
    }
  }

  // =============================
  // 👁️ VISUALIZAR ARCHIVOS
  // =============================
  // const fetchArchivos = async () => {
  //   const { data, error } = await supabase.storage
  //     .from("Alustrial-CRM-Storage")
  //     .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } })

  //   if (error) {
  //     console.error("Error al listar archivos:", error.message)
  //   } else {
  //     setArchivos(data)
  //   }
  // }
const fetchArchivos = async () => {
  const { data, error } = await supabase.storage
    .from("Alustrial-CRM-Storage")
    .list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error("Error al listar archivos:", error.message);
  } else {
    // Si algún archivo está dentro de subcarpetas, list() no los muestra.
    // Vamos a buscarlos recursivamente si no hay resultados:
    if (!data || data.length === 0) {
      console.log("Intentando listar subcarpeta...");
      const { data: subData } = await supabase.storage
        .from("Alustrial-CRM-Storage")
        .list("planos", { limit: 100 });
      setArchivos(subData || []);
    } else {
      setArchivos(data);
    }
  }
};
  useEffect(() => {
    if (isOpen) fetchArchivos()
  }, [isOpen])

  return (
    <>
      <aside className="w-72 min-h-screen bg-[#03045e] text-white flex flex-col">
        {/* Logo */}
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
            <LayoutDashboard size={18} className="text-white/80" />
            <span>Dashboard</span>
          </Link>

          {/* Ejemplo de secciones existentes */}
          {(isEspe || isAdmin) && (
            <div className={`group ${espeActive ? "bg-white/0" : ""}`}>
              <div
                className={[
                  itemBase,
                  espeActive ? itemActive : itemIdle,
                  "cursor-pointer select-none",
                ].join(" ")}
              >
                <ClipboardList size={18} className="text-white/80" />
                <span className="flex-1">Proyectos</span>
              </div>
            </div>
          )}
        </nav>

        {/* Botones finales */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm bg-white/10 hover:bg-white/20 transition"
          >
            <Upload size={18} className="text-white/80" />
            <span>Subir archivo</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm bg-white/10 hover:bg-white/20 transition"
          >
            <Eye size={18} className="text-white/80" />
            <span>Ver archivos</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
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

      {/* MODAL de archivos */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="bg-white text-gray-800 w-full max-w-2xl rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <Dialog.Title className="text-lg font-semibold">📂 Archivos subidos</Dialog.Title>
        <button onClick={() => setIsOpen(false)}>
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {archivos.length === 0 ? (
        <p className="text-sm text-gray-500">No hay archivos aún.</p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {archivos.map((file) => (
            <li key={file.name} className="py-2 flex justify-between items-center">
              <span className="text-sm truncate w-3/4">{file.name}</span>
              <button
                onClick={() => handlePreview(file)}
                className="text-blue-600 hover:underline text-sm"
              >
                Ver
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog.Panel>
  </div>
</Dialog>
{/* Modal de previsualización */}
<Dialog open={!!previewFile} onClose={() => setPreviewFile(null)} className="relative z-50">
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="bg-white text-gray-800 w-full max-w-3xl rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <Dialog.Title className="text-lg font-semibold">
          Vista previa: {previewFile?.name}
        </Dialog.Title>
        <button onClick={() => setPreviewFile(null)}>
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {previewFile ? (
        previewFile.name.endsWith(".pdf") ? (
          <iframe
            src={getPublicUrl(previewFile)}
            className="w-full h-[70vh] border rounded-lg"
          />
        ) : previewFile.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
          <img
            src={getPublicUrl(previewFile)}
            alt={previewFile.name}
            className="max-h-[70vh] mx-auto rounded-lg"
          />
        ) : (
          <p className="text-sm text-gray-500">
            No hay vista previa disponible para este tipo de archivo.
          </p>
        )
      ) : null}
    </Dialog.Panel>
  </div>
</Dialog>
    </>
  )
}