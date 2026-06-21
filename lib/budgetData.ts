export type ProjectType = "landing" | "corporate" | "ecommerce" | "ia" | "app_movil" | "agente_voz";

export type Features = {
  seo: boolean;
  chatbot: boolean;
  analytics: boolean;
  cms: boolean;
  multilingual: boolean;
  aiIntegration: boolean;
};

export interface BudgetRange { min: number; max: number }

// Aligned with Planes section: Lanzamiento 990€ | Negocio 2.490€ | Empresa 4.990€+
export const PROJECT_PRICES: Record<ProjectType, BudgetRange> = {
  landing:    { min: 990,  max: 1990 },
  corporate:  { min: 2490, max: 4490 },
  ecommerce:  { min: 3500, max: 7990 },
  ia:         { min: 4990, max: 12000 },
  app_movil:  { min: 2500, max: 6000 },
  agente_voz: { min: 2000, max: 4000 },
};

export const FEATURE_PRICES: Record<keyof Features, number> = {
  seo:           400,
  chatbot:       600,
  analytics:     300,
  cms:           500,
  multilingual:  450,
  aiIntegration: 1000,
};

export const MONTHLY_FEE: Record<ProjectType, number> = {
  landing:    79,
  corporate:  149,
  ecommerce:  149,
  ia:         299,
  app_movil:  100,
  agente_voz: 150,
};

export const IVA_RATE = 0.21;
