import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
  getAmountToFreeShipping,
  getCartCount,
} from '../utils/cartUtils';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) {
  // Handle keyboard Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Perform accurate calculations directly from current cart contents
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, tax, shipping);
  const amountToFreeShipping = getAmountToFreeShipping(subtotal);
  const totalItemsCount = getCartCount(cart);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col h-full animate-slide-in-right">
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-terracotta-500" />
              <h2 id="cart-drawer-heading" className="font-serif text-xl text-charcoal-950 font-normal">
                Your Shopping Bag
              </h2>
              {totalItemsCount > 0 && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700">
                  {totalItemsCount}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-charcoal-500 hover:text-charcoal-950 hover:bg-ivory-200 transition-colors cursor-pointer"
              aria-label="Close shopping bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6">
            {cart.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-ivory-100 flex items-center justify-center text-charcoal-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1 text-charcoal-400" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal-900 font-normal mb-2">
                  Your bag is empty
                </h3>
                <p className="text-sm text-charcoal-500 max-w-xs mb-8">
                  Looks like you haven't discovered anything yet. Explore our curated catalog of distinctive pieces.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-950 text-white text-xs sm:text-sm font-semibold hover:bg-terracotta-600 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Populated Items List */
              <div className="divide-y divide-ivory-200">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Summary & Checkout */}
          {cart.length > 0 && (
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              amountToFreeShipping={amountToFreeShipping}
              onProceedToCheckout={onProceedToCheckout}
              isEmpty={cart.length === 0}
            />
          )}

        </div>
      </div>
    </div>
  );
}

