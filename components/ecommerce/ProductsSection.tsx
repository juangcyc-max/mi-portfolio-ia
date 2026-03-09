// components/ecommerce/ProductsSection.tsx

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/ecommerce';
import { PRODUCTS } from '@/lib/ecommerce/data';
import { useCart } from '@/lib/ecommerce/hooks';

interface ProductsSectionProps {
  onAddToWishlist: (product: Product) => void;  // ✅ Recibe Product completo
  isInWishlist: (productId: string) => boolean;
}

export default function ProductsSection({ onAddToWishlist, isInWishlist }: ProductsSectionProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

  const handleAddToCart = (product: Product) => {
    const size = selectedSize[product.id] || product.sizes[0];
    addToCart(product, size);
  };

  return (
    <section id="ropa" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D3436] mb-4">
            Nuestra <span className="text-[#FF6B4A]">Colección</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Piezas seleccionadas por inteligencia artificial para tu estilo único
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-[#FF6B4A]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6B4A]/10">
                
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ${
                      product.badge.includes('-') || product.badge === 'Ofertas'
                        ? 'bg-[#FF6B4A] text-white'
                        : product.badge === 'Nuevo'
                        ? 'bg-[#4ECDC4] text-white'
                        : 'bg-[#2D3436] text-white'
                    }`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button - ✅ Envía product completo */}
                  <button
                    onClick={() => onAddToWishlist(product)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isInWishlist(product.id)
                        ? 'bg-[#FF6B4A] text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-[#FF6B4A] hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full py-3 bg-[#2D3436] hover:bg-[#FF6B4A] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.inStock ? 'Añadir al carrito' : 'Agotado'}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Category */}
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-[#2D3436] mt-1 mb-2">
                    {product.name}
                  </h3>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.sizes.slice(0, 4).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize({ ...selectedSize, [product.id]: size })}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                          selectedSize[product.id] === size
                            ? 'border-[#FF6B4A] bg-[#FF6B4A] text-white'
                            : 'border-gray-300 text-gray-600 hover:border-[#FF6B4A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#2D3436]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-8 py-4 border-2 border-[#2D3436] text-[#2D3436] hover:bg-[#2D3436] hover:text-white font-semibold rounded-xl transition-all">
            Ver toda la colección
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}