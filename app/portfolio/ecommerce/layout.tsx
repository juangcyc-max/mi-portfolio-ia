import type { Metadata } from "next";
import PortfolioBreadcrumb from "@/components/PortfolioBreadcrumb";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mindbride.net" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://mindbride.net/#portfolio" },
    { "@type": "ListItem", "position": 3, "name": "Tienda Online", "item": "https://mindbride.net/portfolio/ecommerce" },
  ],
};

export const metadata: Metadata = {
  title: "Demo Tienda Online | Mindbridge IA",
  description: "Ejemplo real de tienda online con carrito, wishlist y panel de gestión. E-commerce profesional con IA para PYMEs españolas. Desarrollo web Cantabria.",
  alternates: {
    canonical: "https://mindbride.net/portfolio/ecommerce",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PortfolioBreadcrumb page="Tienda Online" />
      <div className="pt-9">{children}</div>
    </>
  );
}
