"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Productos ficticios con "recomendación IA"
const products = [
  { id: 1, name: "Camiseta Basic Premium", price: 29.99, category: "tops", image: "👕", aiScore: 95 },
  { id: 2, name: "Jeans Slim Fit", price: 59.99, category: "bottoms", image: "👖", aiScore: 88 },
  { id: 3, name: "Chaqueta Denim", price: 89.99, category: "outerwear", image: "🧥", aiScore: 92 },
  { id: 4, name: "Zapatillas Urban", price: 79.99, category: "shoes", image: "👟", aiScore: 90 },
  { id: 5, name: "Bolso Minimal", price: 49.99, category: "accessories", image: "👜", aiScore: 87 },
  { id: 6, name: "Gafas de Sol", price: 39.99, category: "accessories", image: "🕶️", aiScore: 85 },
];

export default function EcommerceDemo() {
  const [cart, setCart] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [aiRecommendation, setAiRecommendation] = useState("Basado en tu navegación, te recomendamos estos productos 🔥");

  const addToCart = (id: number) => {
    setCart([...cart, id]);
    const messages = [
      "¡Buena elección! Otros usuarios también compraron...",
      "Excelente gusto. Te podría interesar...",
      "Producto añadido. Tu estilo se está definiendo...",
    ];
    setAiRecommendation(messages[Math.floor(Math.random() * messages.length)]);
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const total = cart.reduce((sum, id) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      
      {/* Header Demo */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛍️</span>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Fashion IA Store</h1>
              <p className="text-xs text-slate-500">Demo: Recomendaciones con IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            
            <Link
              href="/#portfolio"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500"
            >
              ← Volver al Portfolio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* IA Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">IA Recommendation Engine</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{aiRecommendation}</p>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "tops", "bottoms", "outerwear", "shoes", "accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {product.image}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {product.aiScore}% match
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{product.category}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-emerald-500">
                    €{product.price}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carrito Flotante */}
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total del carrito</p>
                <p className="text-2xl font-black text-emerald-500">€{total.toFixed(2)}</p>
              </div>
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                Checkout →
              </button>
            </div>
          </motion.div>
        )}

        {/* Tech Stack Info */}
        <div className="mt-16 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            🔧 Tecnologías usadas en esta demo
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "React State", "Tailwind CSS", "Framer Motion", "IA Recommendation Logic"].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            ¿Quieres una tienda similar para tu negocio? <Link href="/#contacto" className="text-emerald-500 font-bold hover:underline">Contacta conmigo</Link>
          </p>
        </div>

      </main>
    </div>
  );
}