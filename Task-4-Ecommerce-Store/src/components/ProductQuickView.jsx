import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Truck, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatCategoryLabel, getProductBadge } from '../utils/api';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';

export default function ProductQuickView({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const badge = getProductBadge(product);

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-modal border border-ivory-300 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-ivory-200 text-charcoal-700 hover:text-charcoal-950 transition-colors shadow-xs cursor-pointer"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Container */}
        <div className="w-full md:w-1/2 bg-ivory-100 p-8 flex items-center justify-center relative min-h-[280px] md:min-h-full">
          {badge && (
            <span className={`absolute top-4 left-4 z-10 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${
              badge.type === 'editorial'
                ? 'bg-charcoal-900 text-ivory-100 border-charcoal-800'
                : badge.type === 'popular'
                ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {badge.text}
            </span>
          )}
          <img
            src={product.image}
            alt={product.title}
            className="max-h-72 max-w-full object-contain filter drop-shadow-sm"
          />
        </div>

        {/* Right: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {/* Category */}
          <span className="text-xs uppercase tracking-widest text-charcoal-500 font-semibold mb-2">
            {formatCategoryLabel(product.category)}
          </span>

          {/* Full Title */}
          <h2 id="quick-view-title" className="font-serif text-xl sm:text-2xl text-charcoal-950 font-normal leading-snug mb-3">
            {product.title}
          </h2>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4 text-xs text-charcoal-700 font-medium">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating.rate)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-ivory-300'
                    }`}
                  />
                ))}
              </div>
              <span>{product.rating.rate.toFixed(1)} / 5.0</span>
              <span className="text-charcoal-400">({product.rating.count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <span className="font-mono text-2xl font-bold text-charcoal-950">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Full Description */}
          <div className="mb-6 flex-1">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-1.5">
              Description
            </h4>
            <p className="text-sm text-charcoal-700 leading-relaxed max-h-36 overflow-y-auto pr-2">
              {product.description}
            </p>
          </div>

          {/* Action Row: Quantity + Add to Bag */}
          <div className="pt-4 border-t border-ivory-200 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-ivory-300 rounded-full bg-ivory-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-white transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-charcoal-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-700 hover:bg-white transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdding}
                className={`flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                  isAdding
                    ? 'bg-emerald-600 text-white'
                    : 'bg-charcoal-950 text-white hover:bg-terracotta-600 active:scale-98'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `(${quantity})` : ''} to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Original catalog item</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

