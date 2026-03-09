// lib/dashboard/data.ts

import { Metric, ChartData, DashboardState } from '@/types/dashboard';

/**
 * Configuración inicial de métricas corporativas.
 */
export const INITIAL_METRICS: Metric[] = [
  {
    id: 'visits',
    label: 'Visitas Únicas',
    value: 24500,
    suffix: '',
    icon: 'visits',
    // ✅ Tono corporativo: Azul índigo profundo (confianza)
    color: 'bg-indigo-600',
    description: 'Tráfico total de usuarios en la plataforma'
  },
  {
    id: 'conversion',
    label: 'Conversión Global',
    value: 3.8,
    suffix: '%',
    icon: 'conversion',
    // ✅ Tono corporativo: Cian oscuro (modernidad/tecnología)
    color: 'bg-cyan-600',
    description: 'Ratio de visitantes que completan el embudo'
  },
  {
    id: 'leads',
    label: 'Leads Cualificados (MQLs)',
    value: 847,
    suffix: '',
    icon: 'leads',
    // ✅ Tono corporativo: Pizarra oscuro (neutro, analítico y elegante)
    color: 'bg-slate-700',
    description: 'Contactos validados listos para el equipo comercial'
  },
  {
    id: 'roi',
    label: 'Retorno de Inversión (ROI)',
    value: 285,
    suffix: '%',
    icon: 'roi',
    // ✅ Tono corporativo: Esmeralda oscuro (éxito financiero)
    color: 'bg-emerald-600',
    description: 'Rendimiento financiero de las campañas activas'
  },
];

export const INITIAL_CHART: ChartData = {
  // Datos con una progresión de crecimiento más natural (no tan erráticos)
  values: [45, 52, 48, 61, 59, 72, 68, 81, 78, 92, 88, 105],
  // Etiquetas de meses más legibles
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  unit: 'k'
};

export const INITIAL_STATE: DashboardState = {
  metrics: INITIAL_METRICS,
  chart: INITIAL_CHART,
  isRefreshing: false,
  lastUpdated: null,
};

// --- Utilidades para generación de datos aleatorios ---

/** Genera un número decimal aleatorio entre un mínimo y un máximo */
const generateRandomDecimal = (min: number, max: number): number => {
  return Number((Math.random() * (max - min) + min).toFixed(1));
};

/** Genera un número entero con una variación controlada (ej. ±5% a ±15%) */
const generateFluctuatingValue = (baseValue: number, volatility: number = 0.15): number => {
  const minMultiplier = 1 - volatility;
  const maxMultiplier = 1 + volatility;
  const variation = Math.random() * (maxMultiplier - minMultiplier) + minMultiplier;
  return Math.floor(baseValue * variation);
};

/**
 * Genera nuevos datos aleatorios simulando una actualización en tiempo real.
 */
export const generateMockData = (state: DashboardState): DashboardState => {
  return {
    ...state,
    metrics: state.metrics.map(metric => {
      const isSmallPercentage = metric.suffix === '%' && metric.value < 100;

      return {
        ...metric,
        value: isSmallPercentage 
          ? generateRandomDecimal(3.0, 5.5) // Fluctuación más realista para conversión
          : generateFluctuatingValue(metric.value, 0.08) // Solo varía un ±8% para no ser brusco
      };
    }),
    chart: {
      ...state.chart,
      // ✅ LÓGICA MEJORADA: El gráfico ahora fluctúa basado en sus propios valores, 
      // creando un efecto de "respiración" en lugar de redibujarse al azar.
      values: state.chart.values.map(val => generateFluctuatingValue(val, 0.1))
    },
    lastUpdated: new Date(),
  };
};