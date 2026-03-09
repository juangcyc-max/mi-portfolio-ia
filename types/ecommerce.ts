// types/ecommerce.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  badge?: string;
  sizes: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface EcommerceContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: Feature[];
  categories: string[];
}