"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  popular?: boolean;
  implementation: string;
  monthly: string;
  monthlyNote?: string;
  forWho: string;
  includes: string[];
  ai: string;
  aiOverage: string;
  support: string;
  cta: string;
  color: string;
  border: string;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: "launch",
    name: "Lanzamiento",
    tagline: "Para autónomos y negocios que empiezan",
    implementation: "990 €",
    monthly: "79 €/mes",
    forWho: "Ideal para negocios que necesitan presencia digital profesional con automatizaciones básicas y captación de leads.",
    includes: [
      "Landing page o web de 1 página",
      "Formulario de contacto conectado",
      "Integración WhatsApp Business",
      "1 automatización de email o notificación",
      "Alojamiento cloud gestionado",
      "Mantenimiento y actualizaciones",
    ],
    ai: "500 consultas IA/mes incluidas",
    aiOverage: "+0,10 € por consulta adicional",
    support: "Soporte por email (48h)",
    cta: "Empezar con Lanzamiento",
    color: "from-slate-800 to-slate-900",
    border: "border-slate-200 dark:border-white/10",
    badge: undefined,
  },
  {
    id: "business",
    name: "Negocio",
    tagline: "Para PYMEs que quieren crecer con digital",
    popular: true,
    implementation: "2.490 €",
    monthly: "149 €/mes",
    forWho: "Solución completa para empresas que necesitan web avanzada, automatizaciones, IA conversacional y conexión con su CRM.",
    includes: [
      "Web multi-página + panel de gestión simple",
      "Captación de leads con CRM integrado",
      "3 automatizaciones de flujo (email, WhatsApp, CRM)",
      "Chatbot IA para preguntas frecuentes",
      "Integración con herramientas existentes",
      "Alojamiento cloud + monitorización 24/7",
    ],
    ai: "2.000 consultas IA/mes incluidas",
    aiOverage: "+0,08 € por consulta adicional",
    support: "Soporte WhatsApp + email (24h)",
    cta: "Empezar con Negocio",
    color: "from-emerald-600 to-emerald-700",
    border: "border-emerald-500/30",
    badge: "Más popular",
  },
  {
    id: "enterprise",
    name: "Empresa",
    tagline: "Para empresas con procesos y volumen",
    implementation: "4.990 € +",
    monthly: "299 €/mes",
    monthlyNote: "Ajustable según alcance",
    forWho: "Desarrollo a medida, infraestructura cloud completa, automatizaciones avanzadas con n8n y IA integrada en todos los puntos clave del negocio.",
    includes: [
      "Desarrollo web y producto a medida",
      "Infraestructura cloud full-stack",
      "Automatizaciones ilimitadas (n8n + API)",
      "IA integrada en múltiples flujos del negocio",
      "Panel de control para el equipo",
      "Integraciones con ERP, CRM, e-commerce",
    ],
    ai: "5.000 consultas IA/mes incluidas",
    aiOverage: "Paquetes adicionales a medida",
    support: "Soporte prioritario + SLA (4h respuesta)",
    cta: "Solicitar propuesta",
    color: "from-slate-800 to-slate-900",
    border: "border-slate-200 dark:border-white/10",
    badge: undefined,
  },
];

const Checkmark = ({ className }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function Plans() {
  const [activeTab, setActiveTab] = useState<"implementation" | "monthly">("monthly");

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent" id="planes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span
            className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full border border-emerald-500/20 dark:border-emerald-400/20"
            variants={fadeInUp}
          >
            Planes y Precios
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
            variants={fadeInUp}
          >
            Inversión clara,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              resultados medibles
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed mb-8"
            variants={fadeInUp}
          >
            Cada plan incluye implementación inicial, cuota mensual de mantenimiento, uso de IA dentro del límite y soporte técnico. Sin sorpresas, sin costes ocultos.
          </motion.p>

          {/* Toggle */}
          <motion.div
            className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10"
            variants={fadeInUp}
          >
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "monthly" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              Cuota mensual
            </button>
            <button
              onClick={() => setActiveTab("implementation")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "implementation" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              Implementación
            </button>
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
                plan.popular
                  ? "border-emerald-500/40 shadow-2xl shadow-emerald-500/10 md:scale-[1.03] md:-mt-2"
                  : `${plan.border} shadow-xl`
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                  <span className="inline-block px-5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-black tracking-widest uppercase rounded-b-xl shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className={`bg-gradient-to-br ${plan.color} p-8 ${plan.badge ? "pt-10" : ""}`}>
                <div className="mb-1">
                  <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{plan.tagline}</p>
                </div>

                {/* Price display */}
                <div className="mt-6">
                  {activeTab === "monthly" ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{plan.monthly.split(" ")[0]}</span>
                        <span className="text-white/60 font-medium">/mes</span>
                      </div>
                      <p className="text-white/50 text-xs mt-1">+ {plan.implementation} de implementación</p>
                      {plan.monthlyNote && (
                        <p className="text-emerald-300 text-xs mt-0.5">{plan.monthlyNote}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{plan.implementation}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-1">pago único de implementación</p>
                      <p className="text-white/50 text-xs">luego {plan.monthly}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white dark:bg-slate-900/80 p-8 space-y-6">
                {/* For who */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-white/5 pb-5">
                  {plan.forWho}
                </p>

                {/* Includes */}
                <div>
                  <p className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">Incluye</p>
                  <ul className="space-y-2.5">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200 font-medium">
                        <Checkmark className="text-emerald-500 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI usage */}
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {plan.ai}
                  </div>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-300/60 pl-6">{plan.aiOverage}</p>
                </div>

                {/* Support */}
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {plan.support}
                </div>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-900 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20 text-white shadow-md"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overage and custom note */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Sin IA ilimitada",
              desc: "Cada plan incluye un volumen razonable. Si lo superas, cobramos solo el exceso a tarifa fija. Transparent y predecible.",
            },
            {
              icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              title: "Escala cuando lo necesites",
              desc: "Puedes cambiar de plan en cualquier momento. El cloud crece con tu negocio sin migraciones costosas.",
            },
            {
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              title: "Propuesta a medida",
              desc: "¿Necesitas algo diferente? Diseñamos un plan personalizado. Sin corsés ni paquetes que no encajan.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200/50 dark:border-white/10">
              <div className="flex-shrink-0 size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* FAQ note */}
        <motion.p
          className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Todos los precios son orientativos y se ajustan al alcance del proyecto. IVA no incluido.{" "}
          <button onClick={scrollToContact} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            Contacta para un presupuesto exacto
          </button>
        </motion.p>
      </div>
    </section>
  );
}
