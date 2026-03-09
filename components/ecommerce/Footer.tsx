// components/ecommerce/Footer.tsx

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/logo-fashion-ia.png" 
                alt="Fashion IA" 
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Moda impulsada por inteligencia artificial. Tu estilo único, perfeccionado con tecnología.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {['instagram', 'facebook', 'twitter', 'tiktok'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-[#FF6B4A] rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tienda</h3>
            <ul className="space-y-3">
              {['Nuevo', 'Ropa', 'Accesorios', 'Zapatos', 'Ofertas'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {['Envíos', 'Devoluciones', 'Tallas', 'FAQ', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Suscríbete para recibir ofertas exclusivas y novedades.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B4A] transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff5733] text-white font-semibold rounded-lg transition-all"
              >
                Suscribirme
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © 2024 Fashion IA. Demo de portfolio.
            </p>

            {/* Payment Methods */}
            <div className="flex gap-3">
              {['visa', 'mastercard', 'paypal', 'apple'].map((payment) => (
                <div
                  key={payment}
                  className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400 uppercase">{payment}</span>
                </div>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                Privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                Términos
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                Cookies
              </Link>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}