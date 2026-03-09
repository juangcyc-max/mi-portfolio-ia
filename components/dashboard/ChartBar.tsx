// components/dashboard/ChartBar.tsx

"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChartBarProps {
  value: number;
  label: string;
  index: number;
  maxValue: number;
  unit: string;
  isInView: boolean;
}

export default function ChartBar({ value, label, index, maxValue, unit, isInView }: ChartBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const heightPercent = (value / maxValue) * 100;
  
  // ✅ Determinar si es barra alta (≥50%) o baja (<50%)
  const isHighBar = heightPercent >= 50;

  // ✅ Colores según altura (solo se aplican al hover)
  const barColors = isHighBar
    ? {
        // 🏆 BARRA ALTA: Dorado metálico
        gradient: 'linear-gradient(180deg, #fbbf24 0%, #d97706 50%, #b45309 100%)',
        glow: '0 0 25px rgba(251, 191, 36, 0.6), inset 0 0 15px rgba(255,255,255,0.4)',
        label: '#fbbf24',
        border: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
      }
    : {
        // 📊 BARRA BAJA: Plateado metálico
        gradient: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 50%, #64748b 100%)',
        glow: '0 0 20px rgba(148, 163, 184, 0.5), inset 0 0 12px rgba(255,255,255,0.5)',
        label: '#94a3b8',
        border: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
      };

  return (
    <div 
      className="flex-1 flex flex-col items-center gap-3 relative h-full justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute -top-12 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg whitespace-nowrap z-30 shadow-xl pointer-events-none border border-slate-600"
      >
        {value}{unit}
      </motion.div>

      {/* Barra - TODAS GRISES por defecto */}
      <motion.div
        className="w-full rounded-t-lg relative overflow-hidden"
        initial={{ height: 0 }}
        animate={isInView ? { height: `${heightPercent}%` } : {}}
        transition={{ duration: 1, delay: 0.2 + index * 0.05, type: "spring", bounce: 0.3 }}
        style={{
          background: isHovered ? barColors.gradient : 'rgb(71 85 105)', // slate-600
          boxShadow: isHovered ? barColors.glow : 'none',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* ✅ EFECTO METÁLICO - Solo visible al hover */}
        {isHovered && (
          <>
            {/* Shine animado cruzando la barra */}
            <motion.div
              initial={{ x: '-150%', skewX: '-20deg' }}
              animate={{ x: '150%', skewX: '-20deg' }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.8) 55%, transparent 100%)',
                width: '50%',
              }}
            />
            
            {/* Reflejo superior */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
              }}
            />
            
            {/* Borde superior brillante (dorado o plateado según altura) */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" 
              style={{
                background: barColors.border
              }}
            />
          </>
        )}
      </motion.div>

      {/* Label - Gris por defecto, dorado/plateado al hover según altura */}
      <motion.span 
        className="text-xs font-bold transition-all duration-300"
        style={{
          color: isHovered ? barColors.label : '#64748b', // amber-400 / slate-400 / slate-500
          textShadow: isHovered ? `0 0 12px ${barColors.label}80` : 'none',
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}