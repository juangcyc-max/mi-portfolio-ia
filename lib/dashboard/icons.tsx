// lib/dashboard/icons.tsx
"use client";

import React from 'react';

// ============================================
// ICONOS SVG PROFESIONALES (Sin emojis)
// ============================================

export const EyeIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const TrendingUpIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const TargetIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
    <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
    <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
  </svg>
);

export const CurrencyIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const DashboardIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// ============================================
// SISTEMA DE ICONOS COMO BOTONES
// ============================================

// Tipo para los props de un botón de icono
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

// Componente reutilizable: Botón con icono
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, variant = 'ghost', size = 'md', active = false, className = "", ...props }, ref) => {
    
    // Estilos por variante
    const variants = {
      primary: "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/25",
      secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
      ghost: `bg-transparent hover:bg-slate-700/50 ${active ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}`
    };
    
    // Tamaños
    const sizes = {
      sm: "p-2 rounded-lg",
      md: "p-3 rounded-xl", 
      lg: "p-4 rounded-2xl"
    };

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        aria-label={label}
        title={label}
        {...props}
      >
        <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6'} />
        {size !== 'sm' && <span className="text-sm">{label}</span>}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

// ============================================
// MAPEO DE ICONOS POR ID (para usar en datos)
// ============================================

export const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  visits: EyeIcon,
  conversion: TrendingUpIcon,
  leads: TargetIcon,
  roi: CurrencyIcon,
  dashboard: DashboardIcon,
};

// Función helper para obtener icono por ID (usada en MetricCard)
export const getIcon = (iconId: string, className?: string) => {
  const IconComponent = ICONS[iconId] || DashboardIcon;
  return <IconComponent className={className} />;
};