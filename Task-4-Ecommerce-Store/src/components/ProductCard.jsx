import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatCategoryLabel, getProductBadge } from '../utils/api';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const badge = getProductBadge(product);

  const handleAdd = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  return (
    <article 
      className="group relative flex flex-col bg-white rounded-2xl border border-ivory-300 hover:border-charcoal-400/60 shadow-subtle hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image Container with Fixed Ratio and Object-Fit Contain */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square bg-ivory-100/70 p-6 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* Transparent Deterministic Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs border ${
            badge.type === 'editorial'
              ? 'bg-charcoal-900 text-ivory-100 border-charcoal-800'
              : badge.type === 'popular'
              ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {badge.text}
          </span>
        )}

        {/* Quick View Floating Pill on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-white/90 text-charcoal-800 hover:text-terracotta-600 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          title="Quick preview product"
          aria-label={`Quick view ${product.title}`}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Product Image with Fallback */}
        {imageError ? (
          <div className="flex flex-col items-center justify-center text-charcoal-400 text-center p-4">
            <span className="text-2xl mb-1">🖼️</span>
            <span className="text-[11px] font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] uppercase tracking-widest text-charcoal-500 font-semibold truncate">
            {formatCategoryLabel(product.category)}
          </span>

          {product.rating && (
            <div className="flex items-center gap-1 flex-shrink-0 text-xs text-charcoal-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.rate.toFixed(1)}</span>
              <span className="text-charcoal-400 text-[10px]">({product.rating.count})</span>
            </div>
          )}
        </div>

        {/* Title (Gracefully Truncated with Full Title in title attribute) */}
        <h3 
          onClick={() => onQuickView(product)}
          title={product.title}
          className="font-medium text-sm text-charcoal-900 group-hover:text-terracotta-600 transition-colors line-clamp-2 leading-snug cursor-pointer mb-3"
        >
          {product.title}
        </h3>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-ivory-200 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-medium">Price</span>
            <span className="font-mono text-base sm:text-lg font-bold text-charcoal-950">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-xs ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-charcoal-900 text-white hover:bg-terracotta-600 active:scale-95'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
