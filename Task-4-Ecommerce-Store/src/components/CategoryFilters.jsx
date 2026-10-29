import React from 'react';
import { CATEGORIES } from '../utils/api';

export default function CategoryFilters({ 
  selectedCategory, 
  onSelectCategory,
  categoryCounts = {} 
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none" role="tablist" aria-label="Product categories">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = categoryCounts[cat.id];

        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-charcoal-950 text-white shadow-sm'
                : 'bg-white border border-ivory-300 text-charcoal-700 hover:border-charcoal-400 hover:text-charcoal-950 hover:bg-ivory-100'
            }`}
          >
            <span>{cat.label}</span>
            {typeof count === 'number' && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-charcoal-800 text-ivory-200' : 'bg-ivory-200 text-charcoal-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
