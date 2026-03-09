// lib/dashboard/hooks.ts

import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, useMotionTemplate } from 'framer-motion';
import { Metric, DashboardState } from '@/types/dashboard';
import { generateMockData, INITIAL_STATE } from './data';

// Hook para animación de números
export const useNumberAnimation = (targetValue: number, duration = 1500) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  const animate = useCallback(() => {
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValue(
        targetValue < 10 
          ? Number((targetValue * easeOut).toFixed(1))
          : Math.floor(targetValue * easeOut)
      );

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return { animatedValue, animate };
};

// Hook para gestión del estado del dashboard
export const useDashboardData = () => {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);

  const refreshData = useCallback(() => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    
    setTimeout(() => {
      setState(generateMockData);
    }, 1500);
  }, []);

  return {
    ...state,
    refreshData,
    setIsRefreshing: (value: boolean) => 
      setState(prev => ({ ...prev, isRefreshing: value }))
  };
};

// Hook para efecto de luz siguiendo el cursor
export const useCursorLight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  const backgroundStyle = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(16, 185, 129, 0.15),
      transparent 80%
    )
  `;

  return { handleMouseMove, backgroundStyle };
};