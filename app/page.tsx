"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import AIDemo from "@/components/AIDemo";
import BudgetCalculator from "@/components/BudgetCalculator";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      
      {/* Fondo global */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/office-background.jpg"
          alt="Fondo Mindbridge IA"
          fill
          className="object-cover opacity-30 dark:opacity-20"
          priority
          quality={100}
        />
      </div>
      
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Portfolio />
        <Services />
        <Plans />
        <Testimonials />
        <Technologies />
        <AIDemo />
        <BudgetCalculator />  {/* ✅ Agregar aquí, antes del contacto */}
        <ContactForm />
      </main>
      
      <Footer />
      
    </div>
  );
}