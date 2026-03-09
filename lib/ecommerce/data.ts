// lib/ecommerce/data.ts

import { EcommerceContent, Product } from '@/types/ecommerce';

export const ECOMMERCE_CONTENT: EcommerceContent = {
  hero: {
    badge: 'Moda impulsada por IA',
    title: 'Tu estilo, perfeccionado con inteligencia artificial',
    subtitle: 'Descubre prendas seleccionadas por algoritmos que entienden tu gusto único. Moda personalizada para la era digital.',
    ctaPrimary: 'Explorar colección',
    ctaSecondary: 'Ver cómo funciona',
  },
  features: [
    {
      icon: 'sparkles',
      title: 'Recomendaciones IA',
      description: 'Nuestros algoritmos analizan tus preferencias para sugerirte prendas perfectas.',
    },
    {
      icon: 'truck',
      title: 'Envío Gratis',
      description: 'En pedidos superiores a $50. Entrega rápida y seguimiento en tiempo real.',
    },
    {
      icon: 'refresh',
      title: 'Devoluciones Fáciles',
      description: '30 días para cambios y devoluciones sin preguntas. Tu satisfacción garantizada.',
    },
  ],
  categories: ['Nuevo', 'Ropa', 'Accesorios', 'Zapatos', 'Ofertas'],
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chaqueta Denim Oversized',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Ropa',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500', // ✅ CORREGIDA
    badge: '-30%',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Camiseta Básica Premium',
    price: 34.99,
    category: 'Ropa',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Jeans Slim Fit',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Ropa',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500',
    badge: 'Bestseller',
    sizes: ['28', '30', '32', '34', '36'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Sneakers Urban Tech',
    price: 119.99,
    category: 'Zapatos',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500',
    sizes: ['38', '40', '42', '44'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Bolso Minimalista',
    price: 59.99,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
    sizes: ['Único'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Gafas de Sol Retro',
    price: 44.99,
    originalPrice: 64.99,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    badge: 'Nuevo',
    sizes: ['Único'],
    inStock: false,
  },
];

// Helper para obtener contenido
export const getEcommerceContent = (): EcommerceContent => ECOMMERCE_CONTENT;
export const getProducts = (): Product[] => PRODUCTS;