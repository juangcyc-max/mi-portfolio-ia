// components/ecommerce/HeroSection.tsx

"use client";

import { motion } from 'framer-motion';
import { ECOMMERCE_CONTENT } from '@/lib/ecommerce/data';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-[#FF6B4A]/5">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#FF6B4A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-[#4ECDC4]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 rounded-full text-sm font-semibold text-[#FF6B4A] mb-6">
              <span className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-pulse" />
              {ECOMMERCE_CONTENT.hero.badge}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3436] mb-6 leading-tight">
              {ECOMMERCE_CONTENT.hero.title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {word === 'inteligencia' || word === 'IA' ? (
                    <span className="text-[#4ECDC4]">
                      {word}
                      {i < arr.length - 1 ? ' ' : ''}
                    </span>
                  ) : word === 'perfeccionado' ? (
                    <span className="text-[#FF6B4A]">
                      {word}
                      {i < arr.length - 1 ? ' ' : ''}
                    </span>
                  ) : (
                    <span>{word} </span>
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              {ECOMMERCE_CONTENT.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center px-8 py-4 bg-[#FF6B4A] hover:bg-[#ff5733] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#FF6B4A]/30">
                {ECOMMERCE_CONTENT.hero.ctaPrimary}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-[#2D3436] text-[#2D3436] hover:bg-[#2D3436] hover:text-white font-semibold rounded-xl transition-all">
                {ECOMMERCE_CONTENT.hero.ctaSecondary}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6 sm:gap-8">
              <div>
                <div className="text-3xl font-bold text-[#2D3436]">10K+</div>
                <div className="text-sm text-gray-500">Clientes felices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2D3436]">500+</div>
                <div className="text-sm text-gray-500">Productos únicos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2D3436]">4.9</div>
                <div className="text-sm text-gray-500">Valoración</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                alt="Fashion IA - Moda con inteligencia artificial"
                className="w-full h-auto object-cover"
              />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl px-6 py-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4ECDC4] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2D3436]">IA en acción</div>
                    <div className="text-xs text-gray-500">Recomendaciones personalizadas</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-6 -right-6 w-full h-full border-2 border-[#FF6B4A]/20 rounded-2xl" />
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full border-2 border-[#4ECDC4]/20 rounded-2xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}