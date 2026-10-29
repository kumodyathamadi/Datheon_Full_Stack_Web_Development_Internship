import React, { useEffect } from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, Printer, Sparkles, MapPin, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function OrderConfirmation({ order, onClose }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!order) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-heading"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-ivory-300 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Banner */}
        <div className="bg-charcoal-950 text-white p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta-400 font-semibold mb-1">
              Order Confirmed
            </span>

            <h2 id="confirmation-heading" className="font-serif text-3xl sm:text-4xl font-normal text-white mb-2">
              Thank you, {order.customer.fullName.split(' ')[0]}!
            </h2>

            <p className="text-sm text-ivory-300 max-w-md mx-auto">
              Your mock order has been successfully placed. We've reserved your items and generated your demo order manifest.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 bg-charcoal-900 border border-charcoal-800 rounded-full px-5 py-2 text-xs font-mono text-ivory-100">
              <span className="text-charcoal-400">Order Reference:</span>
              <strong className="text-terracotta-400 font-bold tracking-wider">{order.orderRef}</strong>
            </div>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-ivory-200 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-charcoal-500 block uppercase tracking-wider text-[10px]">Date</span>
                <span className="font-medium text-charcoal-900">{order.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-charcoal-500 block uppercase tracking-wider text-[10px]">Ship To</span>
                <span className="font-medium text-charcoal-900 block truncate">
                  {order.customer.address}, {order.customer.city} {order.customer.postalCode}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-charcoal-500 block uppercase tracking-wider text-[10px]">Method</span>
                <span className="font-medium text-charcoal-900 capitalize">
                  {order.customer.paymentMethod.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-3">
              Itemized Manifest ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </h4>

            <div className="divide-y divide-ivory-200">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-ivory-100 p-1.5 rounded-lg border border-ivory-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-charcoal-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-charcoal-500 font-mono">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs sm:text-sm font-bold text-charcoal-950 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-ivory-100/60 rounded-2xl p-4 border border-ivory-300 space-y-2 text-xs text-charcoal-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono">
                {order.shipping === 0 ? <strong className="text-emerald-700 uppercase">Free</strong> : formatCurrency(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="font-mono">{formatCurrency(order.tax)}</span>
            </div>
            <div className="pt-2 border-t border-ivory-300 flex justify-between text-sm font-bold text-charcoal-950">
              <span>Total Paid</span>
              <span className="font-mono text-base">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Educational Simulated Note */}
          <div className="text-center text-[11px] text-charcoal-500">
            This was a simulated transaction for testing LORA FASHION's e-commerce storefront. Your cart has been reset.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-ivory-200 bg-ivory-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-ivory-300 text-charcoal-700 hover:bg-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-charcoal-950 text-white hover:bg-terracotta-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <span>Return to Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

