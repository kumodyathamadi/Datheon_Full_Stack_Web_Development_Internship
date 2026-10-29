import React, { useState } from 'react';
import { ArrowRight, Check, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';
import { formatCurrency } from '../utils/currency';

export default function Footer({ onSelectCategory, onOpenAbout }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const elem = document.getElementById('collection');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal-950 text-ivory-100 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-charcoal-800">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-col mb-4">
                <span className="font-serif text-3xl tracking-[0.2em] font-medium text-white uppercase">
                  LORA FASHION
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta-400 font-medium mt-0.5">
                  Objects Worth Discovering
                </span>
              </div>
              
              <p className="text-sm text-charcoal-400 max-w-sm leading-relaxed mb-6">
                An editorial storefront curating enduring everyday essentials, fine jewelry, contemporary apparel, and refined electronics. Designed with intention and tactile warmth.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-charcoal-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All catalog objects sourced live from FakeStoreAPI</span>
            </div>
          </div>

          {/* Quick Shop Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ivory-300 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('clothing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clothing & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('jewelry')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jewelry & Gems
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('electronics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Electronics & Tech
                </button>
              </li>
            </ul>
          </div>

          {/* Brand & Policies (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ivory-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-400">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Brand Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  API Architecture
                </button>
              </li>
              <li>
                <span className="text-charcoal-500 text-xs">
                  Free Shipping &gt; {formatCurrency(FREE_SHIPPING_THRESHOLD)}
                </span>
              </li>
              <li>
                <span className="text-charcoal-500 text-xs">
                  Simulated Checkout
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / The FORME Dispatch (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ivory-300 mb-2">
              The Dispatch
            </h4>
            <p className="text-xs text-charcoal-400 mb-4">
              Receive periodic dispatches on design stories, new catalog arrivals, and archival discoveries.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal-900 border border-charcoal-700 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-charcoal-500 focus:outline-none focus:border-terracotta-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full transition-colors cursor-pointer"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-terracotta-400 flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>Welcome to the LORA FASHION journal club.</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <div>
            © {new Date().getFullYear()} LORA FASHION Inc. · All rights reserved. Simulated storefront.
          </div>
        </div>

      </div>
    </footer>
  );
}

