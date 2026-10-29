import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
  getCartCount,
  getAmountToFreeShipping,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from '../src/utils/cartUtils.js';

import {
  formatCurrency
} from '../src/utils/currency.js';

import {
  matchesCategory,
  getProductBadge,
  processCatalog,
  formatCategoryLabel,
  fetchProducts,
} from '../src/utils/api.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== RUNNING LORA FASHION STOREFRONT VERIFICATION SUITE ===\n');

// 1. Currency Formatting
console.log('Test Group: Currency Formatting');
assert(formatCurrency(109.95) === 'LKR 109.95', 'Formats standard price');
assert(formatCurrency(0) === 'LKR 0.00', 'Formats zero as LKR 0.00');
assert(formatCurrency('22.3') === 'LKR 22.30', 'Parses string float to two decimals');
assert(formatCurrency(null) === 'LKR 0.00', 'Safe fallback for null');
assert(formatCurrency(undefined) === 'LKR 0.00', 'Safe fallback for undefined');

// 2. Cart Calculations
console.log('\nTest Group: Cart Calculations Engine');
const sampleCart = [
  { id: 1, title: 'Item 1', price: 6648.00, quantity: 2 }, // 20.00 USD * 332.40 = 6648.00 * 2 = 13296.00
  { id: 2, title: 'Item 2', price: 5152.20, quantity: 1 }, // 15.50 USD * 332.40 = 5152.20
];
const subtotal1 = calculateSubtotal(sampleCart);
assert(subtotal1 === 18448.20, `Subtotal calculated: ${subtotal1} === 18448.20`);

const tax1 = calculateTax(subtotal1);
assert(tax1 === 1475.86, `Tax (8% of 18448.20): ${tax1} === 1475.86`);

const shipping1 = calculateShipping(subtotal1);
assert(shipping1 === 1991.08, `Shipping (< LKR 24930.00 threshold): ${shipping1} === 1991.08`);

const total1 = calculateTotal(subtotal1, tax1, shipping1);
assert(total1 === 21915.14, `Total (18448.20 + 1475.86 + 1991.08): ${total1} === 21915.14`);

const count1 = getCartCount(sampleCart);
assert(count1 === 3, `Total item count (sum of quantities): ${count1} === 3`);

const remainingForFree1 = getAmountToFreeShipping(subtotal1);
assert(remainingForFree1 === 6481.80, `Amount to free shipping: ${remainingForFree1} === 6481.80`);

// 3. Free Shipping Threshold Test
console.log('\nTest Group: Free Shipping Threshold (LKR 24,930.00+)');
const highValueCart = [
  { id: 3, title: 'Luxury Bag', price: 26592.00, quantity: 1 }
];
const subtotalHigh = calculateSubtotal(highValueCart);
assert(subtotalHigh === 26592.00, 'Subtotal LKR 26592.00');
assert(calculateShipping(subtotalHigh) === 0, 'Shipping is Free (LKR 0.00) for subtotal >= 24930.00');
assert(getAmountToFreeShipping(subtotalHigh) === 0, 'Amount to free shipping is 0 when met');

// Empty cart policy
assert(calculateSubtotal([]) === 0, 'Empty cart subtotal is 0');
assert(calculateTax(0) === 0, 'Empty cart tax is 0');
assert(calculateShipping(0) === 0, 'Empty cart shipping is 0');
assert(calculateTotal(0, 0, 0) === 0, 'Empty cart total is 0');
assert(getCartCount([]) === 0, 'Empty cart count is 0');

// 4. Cart Operations
console.log('\nTest Group: Cart Operations & Immutability');
let myCart = [];
myCart = addItemToCart(myCart, { id: 10, title: 'Headphones', price: 50, image: 'test.jpg', category: 'electronics' }, 1);
assert(myCart.length === 1 && myCart[0].quantity === 1, 'Adding new item adds entry with quantity 1');

myCart = addItemToCart(myCart, { id: 10, title: 'Headphones', price: 50 }, 2);
assert(myCart.length === 1 && myCart[0].quantity === 3, 'Adding same item increments existing quantity (1 + 2 = 3)');

myCart = updateItemQuantity(myCart, 10, 2);
assert(myCart[0].quantity === 2, 'Updating quantity sets exact quantity');

myCart = updateItemQuantity(myCart, 10, 0);
assert(myCart.length === 0, 'Setting quantity to 0 removes the item');

myCart = addItemToCart(myCart, { id: 20, title: 'Watch', price: 100 }, 1);
myCart = removeItemFromCart(myCart, 20);
assert(myCart.length === 0, 'Explicit removeItemFromCart deletes item');

// 5. Category Mapping & Normalization
console.log('\nTest Group: Category Normalization');
assert(formatCategoryLabel('jewelery') === 'Jewelry', 'Formats "jewelery" -> "Jewelry"');
assert(formatCategoryLabel('electronics') === 'Electronics', 'Formats "electronics" -> "Electronics"');
assert(formatCategoryLabel("men's clothing") === "Men's Apparel", "Formats men's clothing");
assert(formatCategoryLabel("women's clothing") === "Women's Apparel", "Formats women's clothing");

const mockProdJewelry = { id: 1, category: 'jewelery', title: 'Gold Ring' };
const mockProdElectronics = { id: 2, category: 'electronics', title: 'Hard Drive' };
const mockProdMensCloth = { id: 3, category: "men's clothing", title: 'Jacket' };
const mockProdWomensCloth = { id: 4, category: "women's clothing", title: 'Dress' };

assert(matchesCategory(mockProdJewelry, 'jewelry') === true, 'Jewelry matches "jewelery"');
assert(matchesCategory(mockProdJewelry, 'electronics') === false, 'Jewelry does not match electronics');
assert(matchesCategory(mockProdElectronics, 'electronics') === true, 'Electronics matches electronics');
assert(matchesCategory(mockProdMensCloth, 'clothing') === true, 'Clothing matches men\'s clothing');
assert(matchesCategory(mockProdWomensCloth, 'clothing') === true, 'Clothing matches women\'s clothing');
assert(matchesCategory(mockProdElectronics, 'all') === true, 'All category matches every product');

// 6. Badging Logic (Deterministic & Transparent)
console.log('\nTest Group: Badging Logic');
const badgeBest = getProductBadge({ rating: { rate: 4.8, count: 50 }, price: 100 });
assert(badgeBest && badgeBest.text === 'Best Rated', 'rating >= 4.5 gets "Best Rated"');

const badgePop = getProductBadge({ rating: { rate: 3.9, count: 320 }, price: 100 });
assert(badgePop && badgePop.text === 'Popular Pick', 'count >= 250 gets "Popular Pick"');

const badgeVal = getProductBadge({ rating: { rate: 4.2, count: 50 }, price: 25.00 * 332.40 });
assert(badgeVal && badgeVal.text === 'Great Value', 'price <= 35 USD equivalent and rate >= 4.0 gets "Great Value"');

const badgeNone = getProductBadge({ rating: { rate: 3.5, count: 30 }, price: 150.00 * 332.40 });
assert(badgeNone === null, 'Average items receive no artificial badge');

// 7. Filtering & Sorting
console.log('\nTest Group: Catalog Processing (Search + Filter + Sort)');
const testCatalog = [
  { id: 1, title: 'Leather Jacket', category: "men's clothing", price: 120, rating: { rate: 4.2 } },
  { id: 2, title: 'Cotton T-Shirt', category: "women's clothing", price: 25, rating: { rate: 4.7 } },
  { id: 3, title: 'Silver Pendant', category: 'jewelery', price: 95, rating: { rate: 4.9 } },
  { id: 4, title: '4K Monitor', category: 'electronics', price: 300, rating: { rate: 4.5 } },
];

const clothingOnly = processCatalog(testCatalog, { category: 'clothing' });
assert(clothingOnly.length === 2, 'Clothing filter retrieves both men and women items');

const searchInClothing = processCatalog(testCatalog, { category: 'clothing', searchQuery: 'jacket' });
assert(searchInClothing.length === 1 && searchInClothing[0].id === 1, 'Search + category filter work conjunctively');

const sortedPriceAsc = processCatalog(testCatalog, { sort: 'price-asc' });
assert(sortedPriceAsc[0].price === 25 && sortedPriceAsc[3].price === 300, 'Price Ascending order correct');

const sortedRatingDesc = processCatalog(testCatalog, { sort: 'rating-desc' });
assert(sortedRatingDesc[0].rating.rate === 4.9, 'Highest Rated order correct');

// 8. Live FakeStoreAPI Network Test
console.log('\nTest Group: Live FakeStoreAPI Integration');
try {
  const liveProducts = await fetchProducts();
  assert(Array.isArray(liveProducts), 'API response is an array');
  assert(liveProducts.length > 0, `Catalog loaded with ${liveProducts.length} items`);
  const first = liveProducts[0];
  assert(first.id !== undefined && first.title && first.price !== undefined && first.image, 'Product schema valid');
  console.log(`  Sample live product: "${first.title}" - ${formatCurrency(first.price)}`);
} catch (e) {
  console.error('API network test skipped or errored:', e.message);
}

console.log(`\n========================================`);
console.log(`TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}

