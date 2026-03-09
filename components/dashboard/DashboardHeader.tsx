// components/dashboard/DashboardHeader.tsx

"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  title?: string;
  highlightText?: string;
  description?: string;
}

export default function DashboardHeader({ 
  onRefresh, 
  isRefreshing, 
  title = "Métricas",
  highlightText = "en Tiempo Real",
  description = "Interactúa con los elementos para evaluar el rendimiento de la interfaz."
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      // Curva de animación más natural y fluida (estilo Apple/Stripe)
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} 
      className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 w-full"
    >
      <div className="flex flex-col gap-2">
        {/* ✅ Respetado el color sólido blanco y dorado, mejorado el tracking y el responsive */}
        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {title}
          {highlightText && (
            <span className="text-amber-400 ml-2">
              {highlightText}
            </span>
          )}
        </h3>
        <p className="text-slate-400/90 max-w-xl text-base md:text-lg leading-relaxed font-medium">
          {description}
        </p>
      </div>
      
      {/* Botones adaptables a móviles (columna en móvil, fila en escritorio) */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        
        {/* Enlace de volver convertido en un "Ghost Button" interactivo */}
        <Link
          href="/#portfolio"
          className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all duration-200"
        >
          {/* Animación del icono de flecha al hacer hover */}
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
            ←
          </span>
          Volver
        </Link>

        {/* Botón principal mejorado con glow, focus rings y mejores contrastes */}
        <motion.button
          whileHover={{ scale: isRefreshing ? 1 : 1.02 }}
          whileTap={{ scale: isRefreshing ? 1 : 0.98 }}
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`group relative flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isRefreshing 
              ? 'bg-slate-800/80 text-slate-500 border-slate-700/50 cursor-not-allowed shadow-none' 
              : 'bg-white text-slate-900 border-white hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]'}`}
        >
          <motion.svg 
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1, ease: "linear" }}
            // El icono cambia ligeramente de tono para darle más vida al diseño
            className={`w-4 h-4 ${isRefreshing ? 'text-slate-500' : 'text-amber-500 group-hover:text-amber-600 transition-colors'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          {isRefreshing ? 'Actualizando...' : 'Simular Datos'}
        </motion.button>
      </div>
    </motion.div>
  );
}