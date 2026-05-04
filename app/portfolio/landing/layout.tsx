import type { Metadata } from "next";
import PortfolioBreadcrumb from "@/components/PortfolioBreadcrumb";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mindbride.net" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://mindbride.net/#portfolio" },
    { "@type": "ListItem", "position": 3, "name": "Landing Page", "item": "https://mindbride.net/portfolio/landing" },
  ],
};

export const metadata: Metadata = {
  title: "Demo Landing Page | Mindbridge IA",
  description: "Ejemplo real de landing page profesional con IA integrada. Alta conversión, diseño moderno y automatizaciones para captar clientes. Desarrollo web para empresas en España.",
  alternates: {
    canonical: "https://mindbride.net/portfolio/landing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PortfolioBreadcrumb page="Landing Page" />
      <div className="pt-9">{children}</div>
    </>
  );
}
