"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import AIDemo from "@/components/AIDemo";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Image from "next/image";  // ✅ IMPORTANTE: Agregar este import

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      
      {/* ✅ IMAGEN DE FONDO GLOBAL - Cubre TODA la pantalla */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/office-background.jpg"
          alt="Fondo Mindbridge IA"
          fill
          className="object-cover"  // ✅ CLAVE: cubre toda la pantalla sin huecos
          priority
          quality={100}
        />
        {/* Capa overlay para mejorar legibilidad del contenido */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
      </div>
      
      <Navbar />
      
      <main className="flex-1">  {/* ✅ flex-1 hace que el contenido ocupe todo el espacio */}
        <Hero />
        <Portfolio />
        <Services />
        <Technologies />
        <AIDemo />
        <ContactForm />
      </main>
      
      <Footer />
      
    </div>
  );
}