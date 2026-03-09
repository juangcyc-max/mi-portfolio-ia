// lib/landing/data.ts

import { LandingContent } from '@/types/landing';

export const LANDING_CONTENT: LandingContent = {
  hero: {
    badge: 'Plataforma de Marketing IA',
    title: 'Campañas que transforman tu negocio',  // ✅ NUEVO TÍTULO
    subtitle: 'Optimiza, escala y automatiza tu publicidad digital con inteligencia artificial. Resultados medibles desde el primer día.',
    ctaPrimary: 'Comenzar prueba gratuita',
    ctaSecondary: 'Ver demostración',
  },
  metrics: [
    { value: '50M+', label: 'Impresiones gestionadas' },
    { value: '12.5%', label: 'Tasa de conversión promedio' },
    { value: '340%', label: 'ROI promedio clientes' },
    { value: '98%', label: 'Retención anual' },
  ],
  features: [
    {
      id: 'targeting',
      icon: 'target',
      title: 'Segmentación Inteligente',
      description: 'Algoritmos de machine learning que identifican y optimizan tu audiencia ideal en tiempo real.',
    },
    {
      id: 'automation',
      icon: 'zap',
      title: 'Automatización de Campañas',
      description: 'Gestión automática de bids, presupuestos y creatividades. Ahorra 20+ horas semanales.',
    },
    {
      id: 'analytics',
      icon: 'chart',
      title: 'Analytics Avanzado',
      description: 'Dashboards en tiempo real, attribution modeling y reportes ejecutivos automáticos.',
    },
  ],
  pricing: [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      description: 'Para startups y equipos pequeños',
      features: [
        '5 campañas activas',
        '10K impresiones/mes',
        'Analytics básico',
        'Soporte por email',
        'API access limitado',
      ],
      cta: 'Iniciar prueba',
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      description: 'Para equipos en crecimiento',
      features: [
        'Campañas ilimitadas',
        '100K impresiones/mes',
        'Analytics avanzado',
        'Automatización IA',
        'Soporte prioritario 24/7',
        'API access completo',
      ],
      cta: 'Iniciar prueba',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Personalizado',
      description: 'Solución corporativa a medida',
      features: [
        'Todo ilimitado',
        'Impresiones personalizadas',
        'White-label disponible',
        'Dedicated account manager',
        'SLA garantizado 99.9%',
        'Integraciones custom',
      ],
      cta: 'Contactar ventas',
      popular: false,
    },
  ],
};

// Helper para obtener contenido
export const getLandingContent = (): LandingContent => LANDING_CONTENT;