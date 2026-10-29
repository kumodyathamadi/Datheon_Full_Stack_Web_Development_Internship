import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
} from '../utils/cartUtils';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'demo-card',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Lock body scroll
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

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, tax, shipping);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter a valid full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal / ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate order placement delay for realistic experience
    setTimeout(() => {
      const orderRef = `LORA-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderRef,
        customer: { ...formData },
        items: [...cart],
        subtotal,
        tax,
        shipping,
        total,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setIsSubmitting(false);
      onOrderSuccess(orderData);
    }, 1200);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-ivory-300 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-charcoal-500">
                Simulated Checkout
              </span>
            </div>
            <h2 id="checkout-modal-title" className="font-serif text-2xl text-charcoal-950 font-normal">
              Finalize Your Order
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-charcoal-500 hover:text-charcoal-950 hover:bg-ivory-200 transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/70 px-6 py-3 flex items-center gap-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Demo Storefront Notice:</strong> No real payment or financial details required. Your mock order will be simulated for testing.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Section: Customer Details */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal-600 mb-3">
              Shipping Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-ivory-50 focus:bg-white transition-colors focus:outline-none focus:ring-1 ${
                    errors.fullName
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-ivory-300 focus:border-charcoal-500 focus:ring-charcoal-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="eleanor@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-ivory-50 focus:bg-white transition-colors focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-ivory-300 focus:border-charcoal-500 focus:ring-charcoal-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="142 Mercer Street, Apt 4B"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-ivory-50 focus:bg-white transition-colors focus:outline-none focus:ring-1 ${
                    errors.address
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-ivory-300 focus:border-charcoal-500 focus:ring-charcoal-500'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* City */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-ivory-50 focus:bg-white transition-colors focus:outline-none focus:ring-1 ${
                    errors.city
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-ivory-300 focus:border-charcoal-500 focus:ring-charcoal-500'
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  placeholder="10012"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-ivory-50 focus:bg-white transition-colors focus:outline-none focus:ring-1 ${
                    errors.postalCode
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-ivory-300 focus:border-charcoal-500 focus:ring-charcoal-500'
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.postalCode}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Simulated Payment Options */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal-600 mb-3">
              Payment Simulation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                formData.paymentMethod === 'demo-card'
                  ? 'border-charcoal-900 bg-ivory-100/80 font-medium'
                  : 'border-ivory-300 hover:bg-ivory-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo-card"
                  checked={formData.paymentMethod === 'demo-card'}
                  onChange={() => handleInputChange('paymentMethod', 'demo-card')}
                  className="text-charcoal-900 focus:ring-terracotta-500"
                />
                <span className="text-xs text-charcoal-800">Simulated Card</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                formData.paymentMethod === 'demo-apple'
                  ? 'border-charcoal-900 bg-ivory-100/80 font-medium'
                  : 'border-ivory-300 hover:bg-ivory-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo-apple"
                  checked={formData.paymentMethod === 'demo-apple'}
                  onChange={() => handleInputChange('paymentMethod', 'demo-apple')}
                  className="text-charcoal-900 focus:ring-terracotta-500"
                />
                <span className="text-xs text-charcoal-800">Demo Apple Pay</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                formData.paymentMethod === 'demo-cod'
                  ? 'border-charcoal-900 bg-ivory-100/80 font-medium'
                  : 'border-ivory-300 hover:bg-ivory-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo-cod"
                  checked={formData.paymentMethod === 'demo-cod'}
                  onChange={() => handleInputChange('paymentMethod', 'demo-cod')}
                  className="text-charcoal-900 focus:ring-terracotta-500"
                />
                <span className="text-xs text-charcoal-800">Pay on Delivery</span>
              </label>
            </div>
          </div>

          {/* Section: Order Summary Recap */}
          <div className="bg-ivory-100/60 rounded-2xl p-4 border border-ivory-300 space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-600 mb-2">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h4>

            <div className="flex justify-between text-xs text-charcoal-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-charcoal-600">
              <span>Shipping</span>
              <span className="font-mono">
                {shipping === 0 ? <strong className="text-emerald-700 uppercase">Free</strong> : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-charcoal-600">
              <span>Sales Tax (8%)</span>
              <span className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <div className="pt-2 border-t border-ivory-300 flex justify-between text-sm font-bold text-charcoal-950">
              <span>Estimated Order Total</span>
              <span className="font-mono text-base">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className={`w-full py-4 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer ${
                isSubmitting
                  ? 'bg-charcoal-700 text-white cursor-wait'
                  : 'bg-charcoal-950 text-white hover:bg-terracotta-600 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-terracotta-400" />
                  <span>Processing Demo Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-ivory-300" />
                  <span>Place Demo Order ({formatCurrency(total)})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

