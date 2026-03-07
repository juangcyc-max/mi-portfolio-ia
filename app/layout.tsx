import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Optimización de fuente: pre-load y display swap para mejor LCP
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// Viewport para móviles y PWA
export const viewport: Viewport = {
  themeColor: "#0f172a", // Color de la barra de navegación en móviles (slate-900)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
    template: "%s | MINDBRIDGE IA"
  },
  description: "Especialista en Web + IA. Ayudo a emprendedores a automatizar procesos con soluciones inteligentes y código escalable.",
  keywords: [
    "desarrollo web", 
    "inteligencia artificial", 
    "automatización de procesos", 
    "Next.js", 
    "IA para empresas",
    "Juan Gutiérrez de la Concha"
  ],
  authors: [{ name: "Juan Gutiérrez de la Concha de la Cuesta" }],
  creator: "Juan Gutiérrez de la Concha",
  metadataBase: new URL("https://mi-portfolio-ia-rpbw.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
    description: "Desarrollo Web y Automatizaciones con IA Integrada para Empresas. Potencia tu negocio con tecnología de vanguardia.",
    url: "https://mi-portfolio-ia-rpbw.vercel.app",
    siteName: "MINDBRIDGE IA",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MINDBRIDGE IA - Desarrollo Web e IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MINDBRIDGE IA",
    description: "Soluciones de IA y Desarrollo Web de alto rendimiento.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body 
        className={`
          ${inter.variable} 
          ${inter.className} 
          antialiased 
          bg-slate-50 dark:bg-slate-900 
          text-slate-900 dark:text-slate-100
          min-h-screen 
          selection:bg-emerald-500/30 selection:text-emerald-200
          transition-colors duration-300
        `}
      >
        {children}
      </body>
    </html>
  );
}