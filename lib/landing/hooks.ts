// lib/landing/hooks.ts

import { useState, useCallback } from 'react';

// Hook para manejar el formulario de email
export const useEmailForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validación básica
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }

    setIsLoading(true);
    
    // Simular llamada a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Error al procesar tu solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const reset = useCallback(() => {
    setSubmitted(false);
    setError(null);
    setEmail('');
  }, []);

  return {
    email,
    setEmail,
    submitted,
    error,
    isLoading,
    handleSubmit,
    reset,
  };
};

// Hook para animaciones de scroll (opcional, para mejoras de UX)
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );
    
    observer.observe(node);
  }, [threshold]);

  return { ref, isVisible };
};