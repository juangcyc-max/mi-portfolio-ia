// types/dashboard.ts

export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  description?: string;
}

export interface ChartData {
  values: number[];
  labels: string[];
  unit: string;
}

export interface DashboardState {
  metrics: Metric[];
  chart: ChartData;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

export type ThemeColor = 
  | 'from-emerald-500 to-cyan-500'
  | 'from-cyan-500 to-blue-500'
  | 'from-blue-500 to-purple-500'
  | 'from-purple-500 to-emerald-500';