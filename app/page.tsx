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
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-4 py-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="text-center" variants={fadeInUp}>
          {/* Logo Placeholder */}
          <motion.div 
            className="mb-8 flex justify-center"
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <span className="text-6xl font-bold text-slate-900">M</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            MINDBRIDGE IA
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-6"
            variants={fadeInUp}
          >
            Desarrollo Web y Automatizaciones con IA Integrada para Empresas
          </motion.p>

          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-slate-700"
            variants={fadeInUp}
          >
            <p className="text-slate-400 text-lg">
              <span className="text-emerald-400 font-semibold">Juan Gutiérrez de la Concha de la Cuesta</span>
              <br />
              Especialista en Web + IA
            </p>
            <p className="text-slate-500 mt-4">
              Ayudo a emprendedores a automatizar sus procesos con soluciones web inteligentes. 
              Combino código limpio con inteligencia artificial para crear productos que escalan.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          variants={fadeInUp}
        >
          Servicios
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Desarrollo Web Profesional",
              description: "Sitios web modernos, rápidos y optimizados con las últimas tecnologías.",
              icon: "🌐"
            },
            {
              title: "Integración de IA",
              description: "Automatiza procesos y mejora la experiencia de usuario con inteligencia artificial.",
              icon: "🤖"
            },
            {
              title: "Automatizaciones",
              description: "Flujos de trabajo automatizados que ahorran tiempo y reducen errores.",
              icon: "⚡"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-slate-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          variants={fadeInUp}
        >
          Tecnologías
        </motion.h2>

        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={fadeInUp}
        >
          {["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "HuggingFace", "React", "Node.js", "PostgreSQL"].map((skill, index) => (
            <motion.span
              key={index}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full text-emerald-400 font-medium border border-emerald-500/30"
              variants={scaleIn}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(16, 185, 129, 0.3)" }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Chat Section */}
      <motion.section 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div 
          className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700"
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white">
            Prueba mi Asistente IA
          </h2>

          <div className="mb-4">
            <textarea
              className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500"
              rows={4}
              placeholder="Escribe tu pregunta sobre mis servicios..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/30"
          >
            {loading ? "Procesando..." : "Enviar"}
          </button>

          {response && (
            <motion.div 
              className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold text-emerald-400 mb-2">Respuesta:</h3>
              <p className="text-slate-300 whitespace-pre-wrap">{response}</p>
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div 
          className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700"
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white">
            Contacto
          </h2>

          {contactSent ? (
            <motion.div 
              className="p-4 bg-emerald-500/20 text-emerald-400 rounded-lg mb-4 border border-emerald-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Mensaje enviado correctamente. Te responderé pronto.
            </motion.div>
          ) : (
            <form onSubmit={sendContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Mensaje
                </label>
                <textarea
                  className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/30"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="container mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-slate-500">
          © {new Date().getFullYear()} MINDBRIDGE IA. Todos los derechos reservados.
        </p>
        <p className="text-slate-600 text-sm mt-2">
          Desarrollo Web + Integración de IA + Automatizaciones
        </p>
      </motion.footer>
    </div>
  );
}