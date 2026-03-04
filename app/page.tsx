"use client";

import { useState } from "react";
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

    // Verificar si Supabase está configurado
    if (!supabase) {
      console.warn("Supabase no configurado, usando modo demo para contacto");
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

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Desarrollador Web con IA
        </h1>

        {/* Chat Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Prueba mi Asistente IA
          </h2>

          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Escribe tu pregunta sobre mis servicios..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Procesando..." : "Enviar"}
          </button>

          {response && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Respuesta:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Contacto
          </h2>

          {contactSent ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg mb-4">
              Mensaje enviado correctamente. Te responderé pronto.
            </div>
          ) : (
            <form onSubmit={sendContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Servicios: Desarrollo Web + Integración de IA + Marketing</p>
        </div>
      </div>
    </div>
  );
}