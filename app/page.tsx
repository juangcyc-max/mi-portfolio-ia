"use client";

import OpeningVideo from "@/components/OpeningVideo";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Mindbridge IA",
  "url": "https://mindbride.net",
  "logo": "https://mindbride.net/logo.svg",
  "description": "Desarrollo web profesional y automatizaciones con IA integrada para PYMEs. Web, cloud e inteligencia artificial en un solo servicio.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santander",
    "addressRegion": "Cantabria",
    "addressCountry": "ES"
  },
  "areaServed": {
    "@type": "Country",
    "name": "España"
  },
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Transferencia bancaria, Bizum",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planes de desarrollo web con IA",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Plan Lanzamiento",
        "price": "79",
        "priceCurrency": "EUR",
        "description": "Landing page con IA para freelancers y pequeños negocios. Setup único 990€."
      },
      {
        "@type": "Offer",
        "name": "Plan Negocio",
        "price": "149",
        "priceCurrency": "EUR",
        "description": "Web multipágina + panel + chatbot IA para PYMEs. Setup único 2490€."
      },
      {
        "@type": "Offer",
        "name": "Plan Empresa",
        "price": "299",
        "priceCurrency": "EUR",
        "description": "Web custom + cloud completo + IA en todos los procesos. Setup desde 4990€."
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "3",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Lisandra Vega Fuente" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Genial, un excelente trabajo con esta página tan funcional, ojalá otros puedan disfrutar de sus beneficios."
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "juangutierrezdelaconcha@mindbride.net",
    "contactType": "customer service",
    "availableLanguage": ["Spanish", "English"]
  }
}

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpeningVideo />
      
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