import React from 'react';
import ProductCard from './ProductCard';
import { AlertCircle, RefreshCw, SearchX, Sparkles } from 'lucide-react';

export default function ProductGrid({
  products,
  isLoading,
  error,
  onRetry,
  onResetFilters,
  onAddToCart,
  onQuickView,
}) {
  // 1. Loading State: Skeleton Cards
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 py-8"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-2xl border border-ivory-300 p-5 shadow-subtle animate-pulse"
          >
            <div className="w-full aspect-square bg-ivory-200/70 rounded-xl mb-4"></div>
            <div className="h-3 bg-ivory-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-ivory-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-ivory-200 rounded w-1/2 mb-6"></div>
            <div className="mt-auto pt-3 border-t border-ivory-200 flex justify-between items-center">
              <div className="h-5 bg-ivory-200 rounded w-16"></div>
              <div className="h-8 bg-ivory-200 rounded-xl w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State: API Failure
  if (error) {
    return (
      <div className="my-16 py-12 px-6 bg-white rounded-2xl border border-red-200 shadow-card text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl text-charcoal-950 font-normal mb-2">
          Unable to Load Catalog
        </h3>
        <p className="text-sm text-charcoal-600 mb-6 max-w-md mx-auto">
          We encountered an issue connecting to FakeStoreAPI ({error.message || 'Network error'}). Please verify your connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-900 text-white text-sm font-semibold hover:bg-terracotta-600 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // 3. Empty Search / Filter State
  if (!products || products.length === 0) {
    return (
      <div className="my-16 py-16 px-6 bg-white rounded-2xl border border-ivory-300 shadow-card text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-ivory-100 text-charcoal-500 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-charcoal-400" />
        </div>
        <h3 className="font-serif text-2xl text-charcoal-950 font-normal mb-2">
          No Objects Found
        </h3>
        <p className="text-sm text-charcoal-600 mb-6">
          No products match your current search query and category filters. Try adjusting your keywords or clearing active filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-charcoal-950 text-white text-xs sm:text-sm font-medium hover:bg-terracotta-600 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  // 4. Successful Products Grid
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 py-8"
      role="region"
      aria-label="Products collection"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

