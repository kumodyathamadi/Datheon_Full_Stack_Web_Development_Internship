import React from 'react';
import { ArrowRight, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';

export default function CartSummary({
  subtotal,
  tax,
  shipping,
  total,
  amountToFreeShipping,
  onProceedToCheckout,
  isEmpty,
}) {
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="bg-ivory-100/70 border-t border-ivory-300 p-5 sm:p-6 flex flex-col gap-4">
      {/* Free Shipping Progress Indicator */}
      {!isEmpty && (
        <div className="bg-white rounded-xl p-3 border border-ivory-300 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-charcoal-700">
              <Truck className="w-3.5 h-3.5 text-terracotta-500" />
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-terracotta-600 font-bold">{formatCurrency(amountToFreeShipping)}</strong> for <strong>Free Shipping</strong>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Unlocked Complimentary Shipping!
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-charcoal-500 font-semibold">
              {freeShippingProgress}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                amountToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-terracotta-500'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Calculations Breakdown */}
      <div className="flex flex-col gap-2 text-xs sm:text-sm text-charcoal-600">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-charcoal-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <span>Estimated Shipping</span>
            <span className="text-[10px] text-charcoal-400 font-mono">(threshold: {formatCurrency(FREE_SHIPPING_THRESHOLD)})</span>
          </span>
          <span className="font-mono font-medium">
            {shipping === 0 ? (
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
                Free
              </span>
            ) : (
              <span className="text-charcoal-900">{formatCurrency(shipping)}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <span>Estimated Sales Tax</span>
            <span className="text-[10px] text-charcoal-400 font-mono">(8%)</span>
          </span>
          <span className="font-mono font-medium text-charcoal-900">
            {formatCurrency(tax)}
          </span>
        </div>

        {/* Final Total */}
        <div className="pt-3 border-t border-ivory-300 flex justify-between items-baseline">
          <div>
            <span className="font-serif text-base sm:text-lg font-bold text-charcoal-950 block">
              Estimated Total
            </span>
            <span className="text-[10px] text-charcoal-500">Includes all applicable taxes & shipping</span>
          </div>
          <span className="font-mono text-xl sm:text-2xl font-bold text-charcoal-950">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <button
        type="button"
        onClick={onProceedToCheckout}
        disabled={isEmpty}
        className={`w-full py-3.5 px-6 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
          isEmpty
            ? 'bg-ivory-300 text-charcoal-400 cursor-not-allowed'
            : 'bg-charcoal-950 text-white hover:bg-terracotta-600 active:scale-98 shadow-md'
        }`}
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Safe Shopping Guarantee */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-charcoal-400">
        <ShieldCheck className="w-3.5 h-3.5 text-charcoal-400" />
        <span>Simulated demo checkout · No real payment charged</span>
      </div>
    </div>
  );
}

