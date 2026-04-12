import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Tienda Online | Mindbridge IA",
  description: "Ejemplo real de tienda online con carrito, wishlist y panel de gestión. E-commerce profesional con IA para PYMEs españolas. Desarrollo web Cantabria.",
  alternates: {
    canonical: "https://mindbride.net/portfolio/ecommerce",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
