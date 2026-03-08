import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
    template: "%s | MINDBRIDGE IA",
  },
  description:
    "Especialista en Web + IA. Ayudo a emprendedores a automatizar procesos con soluciones inteligentes y código escalable.",
  keywords: [
    "desarrollo web",
    "inteligencia artificial",
    "automatización de procesos",
    "Next.js",
    "IA para empresas",
    "Juan Gutiérrez de la Concha",
  ],
  authors: [{ name: "Juan Gutiérrez de la Concha de la Cuesta" }],
  creator: "Juan Gutiérrez de la Concha",
  metadataBase: new URL("https://mi-portfolio-ia-rpbw.vercel.app"),
  openGraph: {
    title: "MINDBRIDGE IA | Desarrollo Web y Automatizaciones con IA",
    description:
      "Desarrollo Web y Automatizaciones con IA Integrada para Empresas.",
    url: "https://mi-portfolio-ia-rpbw.vercel.app",
    siteName: "MINDBRIDGE IA",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MINDBRIDGE IA",
    description: "Soluciones de IA y Desarrollo Web de alto rendimiento.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const theme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (!theme && systemDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`,
          }}
        />
      </head>

      <body
        className={`
          ${publicSans.variable}
          ${publicSans.className}
          antialiased
          min-h-screen
          bg-office
          text-slate-900 dark:text-slate-100
          bg-slate-50 dark:bg-slate-900
          transition-colors duration-300
          selection:bg-emerald-500/30
          selection:text-emerald-200
        `}
      >
        {children}
      </body>
    </html>
  );
}