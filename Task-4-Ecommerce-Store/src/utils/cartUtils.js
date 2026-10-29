/**
 * Cart Utilities and Calculation Engine for LORA FASHION Storefront
 * Implements strict, verifiable, deterministic calculation policies in Sri Lankan Rupees (LKR).
 * Exchange rate: 1 USD = 332.40 LKR
 */

export const USD_TO_LKR_RATE = 332.40;
export const FREE_SHIPPING_THRESHOLD = Math.round(75.0 * USD_TO_LKR_RATE * 100) / 100; // 24,930.00 LKR
export const STANDARD_SHIPPING_FEE = Math.round(5.99 * USD_TO_LKR_RATE * 100) / 100; // 1,991.08 LKR
export const TAX_RATE = 0.08; // 8% sales tax
export const CART_STORAGE_KEY = 'lora_fashion_cart_v2';
export const LEGACY_STORAGE_KEY = 'lora_fashion_cart_v1';

/**
 * Calculates cart subtotal by summing unit price * quantity for all valid items.
 * @param {Array} cart - Array of cart items
 * @returns {number} Subtotal rounded to 2 decimal places
 */
export function calculateSubtotal(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  const rawSubtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const qty = Math.max(0, parseInt(item.quantity, 10) || 0);
    return sum + price * qty;
  }, 0);
  return Math.round(rawSubtotal * 100) / 100;
}

/**
 * Calculates simulated sales tax (8% of subtotal).
 * @param {number} subtotal 
 * @returns {number} Tax rounded to 2 decimal places
 */
export function calculateTax(subtotal) {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

/**
 * Calculates shipping fee.
 * Empty cart = LKR 0.00
 * Subtotal >= LKR 75 = Free (LKR 0.00)
 * Subtotal < LKR 75 = LKR 5.99
 * @param {number} subtotal 
 * @returns {number} Shipping fee
 */
export function calculateShipping(subtotal) {
  if (!subtotal || subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return STANDARD_SHIPPING_FEE;
}

/**
 * Calculates final total = subtotal + tax + shipping.
 * @param {number} subtotal 
 * @param {number} tax 
 * @param {number} shipping 
 * @returns {number} Total rounded to 2 decimal places
 */
export function calculateTotal(subtotal, tax, shipping) {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round((subtotal + tax + shipping) * 100) / 100;
}

/**
 * Returns total number of individual items in the cart (sum of quantities).
 * @param {Array} cart 
 * @returns {number}
 */
export function getCartCount(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((count, item) => {
    return count + Math.max(0, parseInt(item.quantity, 10) || 0);
  }, 0);
}

/**
 * Calculates amount remaining until complimentary free shipping.
 * @param {number} subtotal 
 * @returns {number}
 */
export function getAmountToFreeShipping(subtotal) {
  if (!subtotal || subtotal <= 0) return FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  return remaining > 0 ? Math.round(remaining * 100) / 100 : 0;
}

/**
 * Adds a product to cart. If already present, increments quantity by 1.
 * @param {Array} cart 
 * @param {Object} product 
 * @param {number} [quantityToAdd=1]
 * @returns {Array} New cart array
 */
export function addItemToCart(cart, product, quantityToAdd = 1) {
  if (!product || product.id === undefined) return cart;
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    const updated = [...cart];
    const currentQty = updated[existingIndex].quantity || 1;
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: currentQty + quantityToAdd,
    };
    return updated;
  }

  return [
    ...cart,
    {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: Math.max(1, quantityToAdd),
    },
  ];
}

/**
 * Updates the quantity of a cart item. If quantity <= 0, removes the item.
 * @param {Array} cart 
 * @param {number|string} productId 
 * @param {number} newQuantity 
 * @returns {Array}
 */
export function updateItemQuantity(cart, productId, newQuantity) {
  const qty = parseInt(newQuantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity: qty } : item
  );
}

/**
 * Removes an item from the cart by its product ID.
 * @param {Array} cart 
 * @param {number|string} productId 
 * @returns {Array}
 */
export function removeItemFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

/**
 * Safely loads persisted cart from localStorage.
 * Defensive against corrupted JSON or non-array structures.
 * @returns {Array}
 */
export function loadCartFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const isV2 = window.localStorage.getItem(CART_STORAGE_KEY);
    const stored = isV2 || window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Validate each item structure and convert legacy USD prices if loaded from legacy store
    return parsed
      .filter(
        (item) =>
          item &&
          item.id !== undefined &&
          typeof item.price === 'number' &&
          item.quantity > 0
      )
      .map((item) => {
        if (!isV2 && item.price < 1000) {
          return {
            ...item,
            price: Math.round(item.price * USD_TO_LKR_RATE * 100) / 100,
          };
        }
        return item;
      });
  } catch (error) {
    console.warn('LORA FASHION: Failed to parse stored cart, resetting to empty.', error);
    return [];
  }
}

/**
 * Safely writes cart to localStorage.
 * @param {Array} cart 
 */
export function saveCartToStorage(cart) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('LORA FASHION: Failed to persist cart to localStorage', error);
  }
}
