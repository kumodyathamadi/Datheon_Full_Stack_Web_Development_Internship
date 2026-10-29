import React, { useEffect } from 'react';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss, onOpenCart }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-in-right"
      role="status"
      aria-live="polite"
    >
      <div className="bg-charcoal-900 text-ivory-50 px-5 py-4 rounded-xl shadow-modal flex items-center gap-4 border border-charcoal-800">
        <div className="w-9 h-9 rounded-full bg-terracotta-500/20 text-terracotta-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-terracotta-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Added to Cart</p>
          <p className="text-sm font-medium text-ivory-100 truncate mt-0.5">
            {toast.title}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              onDismiss();
              onOpenCart();
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-terracotta-500 text-white hover:bg-terracotta-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
          </button>
          
          <button
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="text-charcoal-400 hover:text-ivory-100 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
