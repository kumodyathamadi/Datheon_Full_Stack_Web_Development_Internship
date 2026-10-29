import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles, Compass, Info } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';
import { formatCurrency } from '../utils/currency';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  onOpenAbout, 
  searchQuery, 
  setSearchQuery,
  onSelectCategory 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Monitor scroll state for slight shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId, category = null) => {
    setMobileMenuOpen(false);
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Editorial Announcement Banner */}
      <aside aria-label="Store Announcement" className="bg-charcoal-950 text-ivory-200 text-xs py-2 px-4 text-center tracking-wider uppercase font-medium flex items-center justify-center gap-2 border-b border-charcoal-800">
        <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
        <span>Complimentary domestic shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
        <span className="hidden md:inline text-charcoal-500">•</span>
        <span className="hidden md:inline text-charcoal-400">Curated objects for mindful living</span>
      </aside>

      {/* Main Navbar */}
      <nav 
        className={`w-full transition-all duration-200 ${
          isScrolled 
            ? 'bg-ivory-50/95 backdrop-blur-md shadow-subtle border-b border-ivory-300' 
            : 'bg-ivory-50 border-b border-ivory-200'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile Menu Trigger & Desktop Nav Links */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-charcoal-800 hover:text-terracotta-600 transition-colors focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-lg cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
                <button
                  onClick={() => handleNavClick('collection')}
                  className="text-charcoal-700 hover:text-terracotta-600 transition-colors cursor-pointer"
                >
                  Shop Catalog
                </button>
                <button
                  onClick={() => handleNavClick('collection', 'clothing')}
                  className="text-charcoal-600 hover:text-terracotta-600 transition-colors cursor-pointer"
                >
                  Clothing
                </button>
                <button
                  onClick={() => handleNavClick('collection', 'jewelry')}
                  className="text-charcoal-600 hover:text-terracotta-600 transition-colors cursor-pointer"
                >
                  Jewelry
                </button>
                <button
                  onClick={() => handleNavClick('collection', 'electronics')}
                  className="text-charcoal-600 hover:text-terracotta-600 transition-colors cursor-pointer"
                >
                  Electronics
                </button>
                <button
                  onClick={onOpenAbout}
                  className="text-charcoal-500 hover:text-charcoal-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About LORA FASHION</span>
                </button>
              </div>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex flex-col items-center cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-medium text-charcoal-950 uppercase">
                LORA FASHION
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-charcoal-500 -mt-0.5 font-medium">
                Objects Worth Discovering
              </span>
            </div>

            {/* Right: Search & Cart Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Toggle / Input */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center bg-white border border-ivory-300 rounded-full px-3 py-1.5 shadow-sm transition-all w-48 sm:w-64">
                    <Search className="w-4 h-4 text-charcoal-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search objects..."
                      autoFocus
                      className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-charcoal-900 placeholder:text-charcoal-400"
                    />
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="text-charcoal-400 hover:text-charcoal-700 p-0.5 rounded cursor-pointer"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      const shopElem = document.getElementById('collection');
                      if (shopElem) shopElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 text-charcoal-700 hover:text-terracotta-600 hover:bg-ivory-200/50 rounded-full transition-colors cursor-pointer"
                    aria-label="Open search input"
                    title="Search catalog"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Shopping Bag Button with Live Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 text-charcoal-900 hover:text-terracotta-600 hover:bg-ivory-200/50 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer flex items-center gap-1.5"
                aria-label={`Open shopping cart, ${cartCount} items in bag`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-charcoal-800">
                  Bag
                </span>

                {/* Real-time Badge */}
                {cartCount > 0 && (
                  <span 
                    key={cartCount}
                    className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-terracotta-500 rounded-full animate-badge-pulse shadow-sm"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-ivory-100 border-b border-ivory-300 px-6 py-5 animate-fade-in">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <button
                onClick={() => handleNavClick('collection')}
                className="text-left text-charcoal-800 hover:text-terracotta-600 py-1.5 transition-colors cursor-pointer"
              >
                All Products
              </button>
              <button
                onClick={() => handleNavClick('collection', 'clothing')}
                className="text-left text-charcoal-800 hover:text-terracotta-600 py-1.5 transition-colors cursor-pointer"
              >
                Clothing & Apparel
              </button>
              <button
                onClick={() => handleNavClick('collection', 'jewelry')}
                className="text-left text-charcoal-800 hover:text-terracotta-600 py-1.5 transition-colors cursor-pointer"
              >
                Jewelry & Gems
              </button>
              <button
                onClick={() => handleNavClick('collection', 'electronics')}
                className="text-left text-charcoal-800 hover:text-terracotta-600 py-1.5 transition-colors cursor-pointer"
              >
                Electronics & Audio
              </button>
              <div className="pt-3 border-t border-ivory-300 flex items-center justify-between">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="text-sm text-charcoal-600 hover:text-charcoal-900 flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  <span>About LORA FASHION</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
