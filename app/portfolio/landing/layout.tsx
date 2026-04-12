import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Landing Page | Mindbridge IA",
  description: "Ejemplo real de landing page profesional con IA integrada. Alta conversión, diseño moderno y automatizaciones para captar clientes. Desarrollo web para empresas en España.",
  alternates: {
    canonical: "https://mindbride.net/portfolio/landing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
