import React, { useEffect } from 'react';
import { X, Sparkles, Feather, Code2, ShieldCheck, Heart } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';
import { formatCurrency } from '../utils/currency';

export default function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-ivory-300 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-ivory-100/70 border-b border-ivory-300 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-charcoal-500">
                Brand Philosophy
              </span>
            </div>
            <h2 id="about-modal-title" className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
              About LORA FASHION
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-charcoal-500 hover:text-charcoal-950 hover:bg-ivory-200 transition-colors cursor-pointer"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-charcoal-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-serif text-lg text-charcoal-950 mb-2 flex items-center gap-2">
              <Feather className="w-4 h-4 text-terracotta-500" />
              <span>Objects Worth Discovering</span>
            </h3>
            <p>
              LORA FASHION was conceived as an antidote to disposable mass commerce. We celebrate thoughtful design, tactile materials, and pieces that endure beyond fleeting trends. Whether it's an enduring everyday backpack, a sculptural piece of gold jewelry, or precision audio gear, every object is selected for its harmony of form and utility.
            </p>
          </div>

          <div className="bg-ivory-50 rounded-2xl p-5 border border-ivory-200">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-charcoal-900 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-terracotta-500" />
              <span>Technical Craft & Transparency</span>
            </h4>
            <p className="text-xs text-charcoal-600 mb-3">
              This application is engineered as a responsive, high-performance storefront demonstrating production-grade frontend architecture:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-charcoal-600">
              <li><strong>Live API:</strong> Catalog dynamically retrieved from <code className="bg-white px-1 py-0.5 rounded border border-ivory-300">fakestoreapi.com</code>.</li>
              <li><strong>Category Normalization:</strong> Seamlessly maps API categories including jewelry and apparel.</li>
              <li><strong>Deterministic Badging:</strong> Badges like <em>Best Rated</em> and <em>Popular Pick</em> are computed from actual ratings and counts.</li>
              <li><strong>Zero-Drift Cart Calculations:</strong> Subtotals, 8% sales tax, and {formatCurrency(FREE_SHIPPING_THRESHOLD)} free shipping thresholds are computed dynamically from line items.</li>
              <li><strong>Resilient Storage:</strong> Cart state persists across refreshes using defensive <code className="bg-white px-1 py-0.5 rounded border border-ivory-300">localStorage</code> parsing.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-charcoal-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated Demonstration Storefront</span>
            </h4>
            <p className="text-xs text-charcoal-500">
              LORA FASHION is an educational demonstration project. No real payment gateways are connected, and no actual financial transactions or order fulfillments take place.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-ivory-50 border-t border-ivory-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-charcoal-950 text-white text-xs sm:text-sm font-semibold hover:bg-terracotta-600 transition-colors cursor-pointer"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

