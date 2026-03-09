// components/dashboard/MetricCard.tsx

"use client";

import { motion } from 'framer-motion';
import { Metric } from '@/types/dashboard';
import { useNumberAnimation } from '@/lib/dashboard/hooks';
import { formatNumber } from '@/lib/dashboard/utils';
import { useEffect } from 'react';

// Importar iconos directamente (sin función helper compleja)
import { EyeIcon, TrendingUpIcon, TargetIcon, CurrencyIcon } from '@/lib/dashboard/icons';

interface MetricCardProps {
  metric: Metric;
  delay?: number;
  isInView: boolean;
}

// Mapeo simple de IDs a componentes
const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  visits: EyeIcon,
  conversion: TrendingUpIcon,
  leads: TargetIcon,
  roi: CurrencyIcon,
};

export default function MetricCard({ metric, delay = 0, isInView }: MetricCardProps) {
  const { animatedValue, animate } = useNumberAnimation(metric.value);

  useEffect(() => {
    if (isInView) {
      animate();
    }
  }, [isInView, animate]);

  // Obtener el componente del icono
  const IconComponent = ICON_MAP[metric.icon] || EyeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      // ✅ TARJETA CON ESTILO CORPORATIVO: Fondo navy oscuro, borde sutil
      className="group relative bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-all hover:border-amber-500/30"
    >
      {/* Icono SVG profesional con fondo dorado/azul */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-inner relative z-10`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>

      {/* Valor animado - Texto blanco para fondo oscuro */}
      <div className="text-3xl font-black text-white mb-1 relative z-10 flex items-baseline">
        {formatNumber(animatedValue)}
        {/* ✅ Suffix en dorado en lugar de esmeralda */}
        <span className="text-lg text-amber-400 ml-1 font-bold">{metric.suffix}</span>
      </div>

      {/* Label y descripción - Colores claros para fondo oscuro */}
      <p className="text-sm text-slate-300 font-medium relative z-10">
        {metric.label}
      </p>
      {metric.description && (
        <p className="text-xs text-slate-500 mt-1 relative z-10">
          {metric.description}
        </p>
      )}
      
      {/* ✅ Efecto hover: borde dorado sutil + glow ámbar */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-blue-500/0 group-hover:from-amber-500/5 group-hover:to-blue-500/5 transition-opacity duration-300" />
    </motion.div>
  );
}