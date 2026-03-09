// components/dashboard/ChartSection.tsx

"use client";

import { motion } from 'framer-motion';
import { ChartData } from '@/types/dashboard';
import ChartBar from './ChartBar';

interface ChartSectionProps {
  chart: ChartData;
  isInView: boolean;
  title?: string;
  subtitle?: string;
  changePercent?: number;
}

export default function ChartSection({ 
  chart, 
  isInView, 
  title = "Análisis de Crecimiento",
  subtitle = "Volumen de interacciones por mes",
  changePercent = 24.5
}: ChartSectionProps) {
  const maxValue = Math.max(...chart.values) * 1.2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
      // ✅ FONDO CORPORATIVO: Navy oscuro con borde sutil
      className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-lg relative"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          {/* ✅ Títulos en blanco para fondo oscuro */}
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        {/* ✅ Badge en dorado/ámbar en lugar de esmeralda */}
        <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold flex items-center gap-1 border border-amber-500/30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          +{changePercent}% vs Q1
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 sm:gap-2 h-56 relative group">
        {chart.values.map((value, index) => (
          <ChartBar
            key={index}
            value={value}
            label={chart.labels[index]}
            index={index}
            maxValue={maxValue}
            unit={chart.unit}
            isInView={isInView}
          />
        ))}
      </div>
    </motion.div>
  );
}