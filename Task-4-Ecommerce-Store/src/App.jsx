import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ShopToolbar from './components/ShopToolbar';
import ProductGrid from './components/ProductGrid';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmation from './components/OrderConfirmation';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

import { 
  fetchProducts, 
  processCatalog, 
  matchesCategory 
} from './utils/api';
import {
  loadCartFromStorage,
  saveCartToStorage,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  getCartCount,
} from './utils/cartUtils';

export default function App() {
  // 1. Catalog API State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Filter, Search & Sort State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // 3. Cart State (Initialized from localStorage)
  const [cart, setCart] = useState(() => loadCartFromStorage());

  // 4. Modal & Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // 5. Toast Feedback State
  const [toast, setToast] = useState(null);

  // Initial Data Fetch
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Sync Cart changes to localStorage
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => addItemToCart(prev, product, quantity));
    setToast({
      id: Date.now(),
      title: product.title,
    });
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCart((prev) => updateItemQuantity(prev, productId, quantity));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => removeItemFromCart(prev, productId));
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderData) => {
    // Clear cart and local storage
    setCart([]);
    setIsCheckoutOpen(false);
    setCompletedOrder(orderData);
  };

  // Filtered & Sorted Catalog using memoization
  const processedProducts = useMemo(() => {
    return processCatalog(products, {
      category: selectedCategory,
      searchQuery,
      sort: sortOption,
    });
  }, [products, selectedCategory, searchQuery, sortOption]);

  // Category item counts for filter badges
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      clothing: products.filter((p) => matchesCategory(p, 'clothing')).length,
      jewelry: products.filter((p) => matchesCategory(p, 'jewelry')).length,
      electronics: products.filter((p) => matchesCategory(p, 'electronics')).length,
    };
  }, [products]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('featured');
  };

  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '' || sortOption !== 'featured';

  const cartTotalCount = getCartCount(cart);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
      
      {/* Primary Navigation */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <HeroSection
          featuredProduct={products.length > 0 ? products[0] : null}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onExploreClick={() => {
            const collectionEl = document.getElementById('collection');
            if (collectionEl) {
              collectionEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Collection Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls: Heading, Category Filters, Search & Sort */}
          <ShopToolbar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            totalResults={processedProducts.length}
            categoryCounts={categoryCounts}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />

          {/* Dynamic Products Grid with States */}
          <ProductGrid
            products={processedProducts}
            isLoading={isLoading}
            error={error}
            onRetry={loadCatalog}
            onResetFilters={handleResetFilters}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Simulated Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Screen */}
      {completedOrder && (
        <OrderConfirmation
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      {/* Brand & Technical Philosophy Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Toast Notification */}
      <ToastNotification
        toast={toast}
        onDismiss={() => setToast(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}

