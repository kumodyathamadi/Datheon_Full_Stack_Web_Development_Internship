import React, { useState } from 'react';
import { ArrowDownRight, Compass, ShieldCheck, Truck, Sparkles, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { FREE_SHIPPING_THRESHOLD, USD_TO_LKR_RATE } from '../utils/cartUtils';

export default function HeroSection({ onExploreClick, featuredProduct, onQuickView }) {
  const [imageError, setImageError] = useState(false);

  // Use the verified PNG URL from FakeStoreAPI as default
  const displayImage = featuredProduct?.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png';
  const displayTitle = featuredProduct?.title || 'Fjallraven - Foldsack No. 1 Backpack';
  const displayPrice = featuredProduct?.price ? formatCurrency(featuredProduct.price) : formatCurrency(109.95 * USD_TO_LKR_RATE);

  const handleCardClick = () => {
    if (featuredProduct && onQuickView) {
      onQuickView(featuredProduct);
    } else {
      onExploreClick();
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-ivory-200 bg-ivory-100/60 pt-10 pb-14 sm:py-16">
      {/* Editorial Decorative Grid / Accent Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#181716_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-200/80 border border-ivory-300 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-charcoal-700">
                Curated Capsule Collection · 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-950 font-normal leading-[1.12] tracking-tight mb-6">
              Good design. <br />
              <span className="italic font-serif text-terracotta-600">Better finds.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-charcoal-600 max-w-xl font-normal leading-relaxed mb-8">
              Discover everyday essentials and distinctive pieces, thoughtfully selected for your next favourite find. From timeless outerwear and modern jewelry to precision audio.
            </p>

            {/* Call to Action & Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-charcoal-950 text-white rounded-full font-medium text-sm hover:bg-terracotta-600 transition-all duration-200 shadow-sm hover:shadow group cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta-500"
              >
                <span>Explore collection</span>
                <ArrowDownRight className="w-4 h-4 text-ivory-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <div className="text-xs text-charcoal-500 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Live catalog synced with FakeStoreAPI</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div 
              onClick={handleCardClick}
              className="relative rounded-2xl bg-white border border-ivory-300 p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group"
              title="Click to view product details"
            >
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500"></div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-charcoal-800">
                    Staff Selection
                  </span>
                </div>
                <span className="text-xs font-mono text-charcoal-500">
                  REF. FS-2026
                </span>
              </div>

              {/* Showcase Image with Editorial Tint */}
              <div className="relative h-60 sm:h-72 w-full my-4 rounded-xl bg-ivory-100/80 flex items-center justify-center p-6 overflow-hidden">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center text-charcoal-400 p-4 text-center">
                    <span className="text-3xl mb-2">🎒</span>
                    <span className="text-xs font-medium text-charcoal-600">{displayTitle}</span>
                  </div>
                ) : (
                  <img
                    src={displayImage}
                    alt={displayTitle}
                    onError={() => setImageError(true)}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-charcoal-900 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-ivory-300">
                  Everyday Carry
                </span>

                <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-950 text-white p-1.5 rounded-full shadow-sm text-xs">
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card Footer Details */}
              <div className="flex items-center justify-between pt-2">
                <div className="min-w-0 pr-3">
                  <h3 className="text-sm font-medium text-charcoal-900 truncate group-hover:text-terracotta-600 transition-colors">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5 truncate">Fits 15" Laptop · Water Resistant</p>
                </div>
                <span className="text-sm font-bold font-mono text-charcoal-950 flex-shrink-0">
                  {displayPrice}
                </span>
              </div>
            </div>

            {/* Floated Editorial Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-charcoal-900 text-white rounded-xl px-4 py-3 shadow-modal items-center gap-3 border border-charcoal-800">
              <Truck className="w-4 h-4 text-terracotta-500" />
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ivory-100">Fast Fulfillment</p>
                <p className="text-[10px] text-charcoal-400">Orders ship within 24 hours</p>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-ivory-300/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center text-charcoal-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-900">Curated Variety</p>
              <p className="text-[11px] text-charcoal-500">Selected for form and utility</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center text-charcoal-700">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-900">Complimentary Shipping</p>
              <p className="text-[11px] text-charcoal-500">Free delivery on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center text-charcoal-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-900">Verified Quality</p>
              <p className="text-[11px] text-charcoal-500">Honest ratings & reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center text-charcoal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-900">Transparent Pricing</p>
              <p className="text-[11px] text-charcoal-500">No hidden fees at checkout</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
