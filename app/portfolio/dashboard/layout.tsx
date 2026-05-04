import type { Metadata } from "next";
import PortfolioBreadcrumb from "@/components/PortfolioBreadcrumb";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mindbride.net" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://mindbride.net/#portfolio" },
    { "@type": "ListItem", "position": 3, "name": "Dashboard Empresarial", "item": "https://mindbride.net/portfolio/dashboard" },
  ],
};

export const metadata: Metadata = {
  title: "Demo Dashboard Empresarial | Mindbridge IA",
  description: "Ejemplo real de panel de control con métricas en tiempo real, gráficas y automatizaciones. Dashboard profesional con IA para gestión empresarial.",
  alternates: {
    canonical: "https://mindbride.net/portfolio/dashboard",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PortfolioBreadcrumb page="Dashboard" />
      <div className="pt-9">{children}</div>
    </>
  );
}
