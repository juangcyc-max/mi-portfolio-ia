import type { Metadata } from "next";
import PortfolioBreadcrumb from "@/components/PortfolioBreadcrumb";

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
      <PortfolioBreadcrumb page="Dashboard" />
      <div className="pt-9">{children}</div>
    </>
  );
}
