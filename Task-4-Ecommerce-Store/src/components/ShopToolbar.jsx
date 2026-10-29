import React from 'react';
import { Search, ArrowUpDown, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import CategoryFilters from './CategoryFilters';
import { SORT_OPTIONS } from '../utils/api';

export default function ShopToolbar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  totalResults,
  categoryCounts,
  onResetFilters,
  isFiltered,
}) {
  return (
    <div id="collection" className="pt-12 pb-6 border-b border-ivory-200">
      {/* Top Header Row: Section Title and Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal-500">
              Curated Catalog
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal tracking-tight">
            The Collection
          </h2>
        </div>

        {/* Total Item Count & Reset Action */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-charcoal-600 bg-ivory-200/70 border border-ivory-300 px-3.5 py-1.5 rounded-full">
            Showing <strong className="text-charcoal-950 font-bold">{totalResults}</strong> {totalResults === 1 ? 'object' : 'objects'}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 hover:underline cursor-pointer"
              title="Reset all filters and search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Row: Category Filters + Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Category Filter Pills */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          categoryCounts={categoryCounts}
        />

        {/* Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Live Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, specs..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-ivory-300 rounded-full focus:outline-none focus:border-charcoal-500 focus:ring-1 focus:ring-charcoal-500 text-charcoal-900 placeholder:text-charcoal-400 transition-colors"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-1 cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative min-w-[180px]">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-ivory-300 rounded-full focus:outline-none focus:border-charcoal-500 focus:ring-1 focus:ring-charcoal-500 text-charcoal-900 font-medium cursor-pointer transition-colors"
                aria-label="Sort products by"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[10px] text-charcoal-400">▼</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
