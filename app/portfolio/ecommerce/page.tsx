// app/portfolio/ecommerce/page.tsx

"use client";

import EcommerceHeader from '@/components/ecommerce/EcommerceHeader';
import HeroSection from '@/components/ecommerce/HeroSection';
import ProductsSection from '@/components/ecommerce/ProductsSection';
import FeaturesSection from '@/components/ecommerce/FeaturesSection';
import CartSidebar from '@/components/ecommerce/CartSidebar';
import Footer from '@/components/ecommerce/Footer';
import { useCart, useWishlist } from '@/lib/ecommerce/hooks';
import { Product } from '@/types/ecommerce';

export default function EcommerceDemo() {
  const cart = useCart();
  const wishlist = useWishlist();

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Sidebar */}
      <CartSidebar />
      
      {/* Header */}
      <EcommerceHeader 
        cartCount={cart.cartCount}
        onCartClick={cart.toggleCart}
        wishlistCount={wishlist.items.length}
        onWishlistClick={() => console.log('Wishlist click')}
      />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Products Section */}
      <ProductsSection 
        onAddToWishlist={wishlist.toggleWishlist}  // ✅ Coincide con ProductsSectionProps
        isInWishlist={wishlist.isInWishlist}
      />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}