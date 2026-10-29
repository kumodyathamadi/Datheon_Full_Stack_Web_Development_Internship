import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatCategoryLabel } from '../utils/api';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="flex gap-4 py-4 border-b border-ivory-200 last:border-b-0 items-center">
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-ivory-100 rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-ivory-200 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Info & Controls */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-semibold block">
              {formatCategoryLabel(item.category)}
            </span>
            <h4 className="text-xs sm:text-sm font-medium text-charcoal-900 line-clamp-1 leading-snug">
              {item.title}
            </h4>
          </div>

          {/* Remove Action */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-charcoal-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
            title="Remove item"
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Unit Price */}
        <p className="text-xs text-charcoal-500 font-mono mt-0.5">
          {formatCurrency(item.price)} each
        </p>

        {/* Quantity Controls & Line Item Subtotal */}
        <div className="flex items-center justify-between mt-3">
          {/* Stepper */}
          <div className="inline-flex items-center border border-ivory-300 rounded-full bg-ivory-50 px-1 py-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-600 hover:bg-white transition-colors cursor-pointer text-xs"
              aria-label={`Decrease quantity of ${item.title}`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-charcoal-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-600 hover:bg-white transition-colors cursor-pointer text-xs"
              aria-label={`Increase quantity of ${item.title}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Line Subtotal */}
          <span className="font-mono text-sm font-bold text-charcoal-950">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

