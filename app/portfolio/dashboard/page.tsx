// app/portfolio/dashboard/page.tsx

"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDashboardData, useCursorLight } from '@/lib/dashboard/hooks';
import { DashboardIcon } from '@/lib/dashboard/icons';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import ChartSection from '@/components/dashboard/ChartSection';

export default function DashboardDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  
  const { metrics, chart, isRefreshing, refreshData } = useDashboardData();
  const { handleMouseMove, backgroundStyle } = useCursorLight();

  return (
    // ✅ FONDO CORPORATIVO: slate-800/700
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Efecto de luz sutil siguiendo el cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-5"
        style={{ 
          background: backgroundStyle 
        }}
      />
      
      {/* Overlay de textura sutil (patrón de puntos dorados) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Header fijo con estilo corporativo */}
      <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-xl border-b border-slate-600/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <DashboardIcon className="w-6 h-6 text-amber-400 drop-shadow-sm" />
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">SaaS Analytics Pro</h1>
              <p className="text-xs text-slate-400 font-medium">Dashboard Empresarial</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10" ref={containerRef}>
        
        <DashboardHeader 
          onRefresh={refreshData} 
          isRefreshing={isRefreshing}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              delay={index * 0.1}
              isInView={isInView}
            />
          ))}
        </div>

        <ChartSection 
          chart={chart} 
          isInView={isInView}
        />

        {/* ✅ CALL TO ACTION - SOBRO PERO VISIBLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/#contacto"
            className="group relative inline-flex items-center gap-3 
              bg-slate-700/80 
              hover:bg-slate-700 
              text-white 
              px-8 py-4 rounded-xl font-semibold 
              transition-all duration-300 
              hover:scale-[1.02] 
              border border-amber-500/40 hover:border-amber-400
              shadow-md hover:shadow-amber-500/20"
          >
            Hablemos de tu arquitectura frontend
            <motion.svg 
              className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
            
            {/* ✅ Glow sutil dorado al hover (no intrusivo) */}
            <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </a>
          <p className="mt-4 text-sm text-slate-500">
            Demo interactiva • Sin compromiso
          </p>
        </motion.div>

      </main>
    </div>
  );
}