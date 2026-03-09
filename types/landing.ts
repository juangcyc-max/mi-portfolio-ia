// types/landing.ts

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface Metric {
  value: string;
  label: string;
}

export interface LandingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  metrics: Metric[];
  features: Feature[];
  pricing: PricingPlan[];
}