import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import CustomScrollbar from "@/components/CustomScrollbar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import PageViewTracker from "@/components/PageViewTracker";

/* ============================================ */
/* FUENTE PRINCIPAL */
/* ============================================ */

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

/* ============================================ */
/* METADATA BASE */
/* ============================================ */

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mindbride.net"
);

/* ============================================ */
/* METADATOS SEO */
/* ============================================ */

export const metadata: Metadata = {
  title: "Mindbridge IA | Desarrollo Web + Inteligencia Artificial",
  description: "Desarrollo web de élite y automatizaciones con IA integrada para empresas. Landing pages, e-commerce, dashboards y soluciones personalizadas.",
  keywords: [
    "desarrollo web Santander",
    "agencia digital Cantabria",
    "página web para empresas",
    "inteligencia artificial para negocios",
    "automatización empresas pequeñas",
    "landing page profesional España",
    "web con IA",
    "chatbot para empresas",
    "presencia digital pymes",
    "Mindbridge IA"
  ],
  verification: {
    google: "W19JTMyAdhc7Rq7qGlPHIduU3upoGT2Kx5mQK8GuTko",
  },
  authors: [{ name: "Mindbridge IA" }],
  creator: "Mindbridge IA",
  publisher: "Mindbridge IA",
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
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.mindbride.net",
    siteName: "Mindbridge IA",
    title: "Mindbridge IA | Desarrollo Web + Inteligencia Artificial",
    description: "Desarrollo web de élite y automatizaciones con IA integrada para empresas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mindbridge IA - Desarrollo Web + IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindbridge IA | Desarrollo Web + Inteligencia Artificial",
    description: "Desarrollo web de élite y automatizaciones con IA integrada para empresas.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

/* ============================================ */
/* VIEWPORT (themeColor va aquí) */
/* ============================================ */

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ============================================ */
/* LAYOUT PRINCIPAL */
/* ============================================ */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={publicSans.variable} suppressHydrationWarning>
      <body className="bg-office antialiased min-h-screen">
        {/* ✅ Theme Provider para modo claro/oscuro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ Custom Scrollbar con hormiga verde */}
          <CustomScrollbar />
          
          {/* ✅ Contenido principal */}
          <LanguageProvider>
            <PageViewTracker />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}