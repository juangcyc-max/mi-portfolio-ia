import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
  description: "Ayudo a emprendedores a automatizar sus procesos con soluciones web inteligentes. Combino código limpio con inteligencia artificial para crear productos que escalan.",
  keywords: ["desarrollo web", "inteligencia artificial", "automatización", "Next.js", "IA para empresas"],
  authors: [{ name: "Juan Gutiérrez de la Concha de la Cuesta" }],
  openGraph: {
    title: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
    description: "Desarrollo Web y Automatizaciones con IA Integrada para Empresas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}