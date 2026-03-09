// lib/dashboard/utils.ts

// Formatear números grandes (1247 → "1.2K")
export const formatNumber = (value: number, suffix: string = ''): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K${suffix}`;
  return `${value}${suffix}`;
};

// Calcular porcentaje de cambio
export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 100;
  return Number(((current - previous) / previous * 100).toFixed(1));
};

// Generar ID único para keys de React
export const generateId = (prefix: string): string => 
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;