"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response || data.error || "Sin respuesta");
    } catch (error) {
      setResponse("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!supabase) {
      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setContactSent(false), 5000);
      return;
    }

    try {
      const { error } = await supabase
        .from("contacts")
        .insert({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        });

      if (error) throw error;

      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      
      setTimeout(() => setContactSent(false), 5000);
    } catch (error: any) {
      console.error("Error enviando contacto:", error.message);
      alert("Error al enviar. Inténtalo de nuevo.");
    }
  };

  // Animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-['Public_Sans',sans-serif]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Mindbridge IA
              </span>
            </div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#servicios" className="hover:text-emerald-500 transition-colors">Servicios</a>
              <a href="#tecnologias" className="hover:text-emerald-500 transition-colors">Tecnologías</a>
              <a href="#demo" className="hover:text-emerald-500 transition-colors">Demo</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="#contacto" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                className="flex flex-col gap-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit"
                  variants={fadeInUp}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Disponible para Proyectos
                </motion.div>

                <motion.h1 
                  className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white"
                  variants={fadeInUp}
                >
                  MINDBRIDGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">IA</span>
                </motion.h1>

                <motion.p 
                  className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
                  variants={fadeInUp}
                >
                  Desarrollo Web y Automatizaciones con IA Integrada para Empresas. Soluciones de vanguardia que transforman la productividad.
                </motion.p>

                {/* Bio Card */}
                <motion.div 
                  className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-slate-200 dark:border-slate-800 shadow-xl"
                  variants={fadeInUp}
                >
                  <div className="size-20 rounded-full overflow-hidden border-2 border-emerald-500/30 shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">JG</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">Juan Gutiérrez de la Concha de la Cuesta</h3>
                    <p className="text-emerald-500 text-sm font-semibold mb-2">Especialista en Web + IA</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Impulsando la innovación tecnológica a través de arquitecturas modernas y modelos de lenguaje avanzados.
                    </p>
                  </div>
                </motion.div>

                <motion.div className="flex flex-wrap gap-4 pt-4" variants={fadeInUp}>
                  <a href="#demo" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                    Empezar Proyecto
                  </a>
                  <a href="#servicios" className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md px-8 py-4 rounded-xl font-bold dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Ver Servicios
                  </a>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-video lg:aspect-square border border-slate-800 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🤖</div>
                      <p className="text-slate-400">IA + Desarrollo Web</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="servicios">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3" variants={fadeInUp}>
                Nuestra Experticia
              </motion.p>
              <motion.h2 className="text-3xl md:text-4xl font-black dark:text-white mb-6" variants={fadeInUp}>
                Servicios Especializados
              </motion.h2>
              <motion.p className="text-slate-600 dark:text-slate-400" variants={fadeInUp}>
                Combinamos el poder de la Inteligencia Artificial con el desarrollo web de alto rendimiento para escalar tu negocio.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Desarrollo Web Profesional",
                  description: "Sitios modernos, rápidos y optimizados con Next.js y React. Enfoque en performance y experiencia de usuario excepcional.",
                  icon: "💻",
                  features: ["SEO Optimizado", "Responsive Design"]
                },
                {
                  title: "Integración de IA",
                  description: "Implementación de modelos de lenguaje (LLMs) y visión artificial adaptados a las necesidades específicas de tu sector.",
                  icon: "🧠",
                  features: ["Modelos Personalizados", "RAG & Vector DBs"]
                },
                {
                  title: "Automatizaciones",
                  description: "Optimización de flujos de trabajo mediante agentes inteligentes que ejecutan tareas repetitivas de forma autónoma.",
                  icon: "⚡",
                  features: ["Workflow Automation", "Agentes IA Autónomos"]
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <div className="size-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold dark:text-white mb-4">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="text-emerald-500">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-24" id="tecnologias">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h3 
              className="text-2xl font-black dark:text-white mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Stack Tecnológico de Vanguardia
            </motion.h3>
            <motion.div 
              className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "HuggingFace", "React", "Node.js", "PostgreSQL", "Python", "OpenAI API"].map((tech, index) => (
                <motion.span
                  key={index}
                  className="px-6 py-3 rounded-xl bg-white/5 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-default"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="demo">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h3 className="text-3xl font-black dark:text-white mb-4" variants={fadeInUp}>
                Prueba nuestra IA
              </motion.h3>
              <motion.p className="text-slate-600 dark:text-slate-400" variants={fadeInUp}>
                Interactúa con un prototipo de nuestro asistente inteligente.
              </motion.p>
            </motion.div>

            <motion.div 
              className="max-w-2xl mx-auto bg-white/5 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[500px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="size-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-bold dark:text-white">Mindbridge Assistant v1.0</span>
              </div>

              {/* Messages area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none text-sm dark:text-slate-300">
                    Hola, soy el asistente de Mindbridge IA. ¿En qué puedo ayudarte hoy con tu proyecto tecnológico?
                  </div>
                </div>
                
                {response && (
                  <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="bg-emerald-500 p-3 rounded-2xl rounded-tr-none text-sm text-white">
                      {message}
                    </div>
                  </div>
                )}
                
                {response && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none text-sm dark:text-slate-300">
                      {response}
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <textarea
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none pr-12 dark:text-white placeholder-slate-500"
                    placeholder="Escribe tu pregunta aquí..."
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                  >
                    {loading ? '⏳' : '➤'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24" id="contacto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.h3 className="text-4xl font-black dark:text-white mb-6" variants={fadeInUp}>
                  ¿Tienes un proyecto en mente?
                </motion.h3>
                <motion.p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed" variants={fadeInUp}>
                  Estamos listos para ayudarte a integrar la IA en tu negocio y construir la plataforma web que necesitas. Cuéntanos más sobre tus objetivos.
                </motion.p>
                
                <motion.div className="space-y-6" variants={fadeInUp}>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <span>✉️</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Escríbenos</p>
                      <p className="font-bold dark:text-white">contacto@mindbridge.ia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                      <span>📍</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Ubicación</p>
                      <p className="font-bold dark:text-white">Madrid, España</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {contactSent ? (
                  <motion.div 
                    className="p-4 bg-emerald-500/20 text-emerald-400 rounded-lg mb-4 border border-emerald-500/30 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    ✅ Mensaje enviado correctamente. Te responderé pronto.
                  </motion.div>
                ) : (
                  <form onSubmit={sendContact} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Nombre</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                          placeholder="Tu nombre"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                          placeholder="tu@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Mensaje</label>
                      <textarea
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white min-h-[120px]"
                        placeholder="¿Cómo podemos ayudarte?"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                    >
                      Enviar Mensaje
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-black dark:text-white uppercase tracking-tighter">
                Mindbridge IA
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-emerald-500 transition-colors">Desarrollo Web</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">IA Generativa</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Automatización</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Consultoría Tech</a>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Mindbridge IA. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Privacidad</a>
              <a href="#" className="hover:underline">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}