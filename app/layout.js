import "./globals.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "CRM Alustrial",
  icons: {
    icon: "/favicon.png"
  },
  description: "Next.js Frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
