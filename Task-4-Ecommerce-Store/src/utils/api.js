/**
 * FakeStoreAPI integration and Catalog Data Processing
 * LORA FASHION — Objects Worth Discovering
 */

export const API_BASE_URL = 'https://fakestoreapi.com';

// Official Exchange Rate: 1 USD = 332.40 LKR (Sri Lankan Rupee)
export const USD_TO_LKR_RATE = 332.40;

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'electronics', label: 'Electronics' },
];

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured / Default' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating-desc', label: 'Highest Rated' },
];

/**
 * Fetch all products from FakeStoreAPI and convert prices to LKR
 * @returns {Promise<Array>} Array of product objects
 */
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Catalog request failed with status: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid catalog format received from API');
    }
    // Convert USD prices into Sri Lankan Rupees (LKR)
    return data.map((product) => ({
      ...product,
      price: Math.round(product.price * USD_TO_LKR_RATE * 100) / 100,
      originalUsdPrice: product.price,
    }));
  } catch (error) {
    console.error('LORA FASHION API Error:', error);
    throw error;
  }
}

/**
 * Formats API category name into an editorial-friendly label
 * Maps "jewelery" -> "Jewelry"
 * @param {string} apiCategory 
 * @returns {string} Polished display string
 */
export function formatCategoryLabel(apiCategory) {
  if (!apiCategory) return '';
  const lower = apiCategory.toLowerCase().trim();
  if (lower === 'jewelery') return 'Jewelry';
  if (lower === 'electronics') return 'Electronics';
  if (lower === "men's clothing") return "Men's Apparel";
  if (lower === "women's clothing") return "Women's Apparel";
  
  // Generic capitalizer
  return apiCategory
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Determines whether a product matches the selected user-facing category.
 * Handles the mapping:
 * - 'all' -> true
 * - 'electronics' -> apiCategory === 'electronics'
 * - 'jewelry' -> apiCategory === 'jewelery'
 * - 'clothing' -> apiCategory === "men's clothing" || apiCategory === "women's clothing"
 * @param {Object} product 
 * @param {string} selectedCategoryId 
 * @returns {boolean}
 */
export function matchesCategory(product, selectedCategoryId) {
  if (!selectedCategoryId || selectedCategoryId === 'all') return true;
  
  const category = (product.category || '').toLowerCase().trim();

  switch (selectedCategoryId) {
    case 'electronics':
      return category === 'electronics';
    case 'jewelry':
      return category === 'jewelery';
    case 'clothing':
      return category === "men's clothing" || category === "women's clothing";
    default:
      return true;
  }
}

/**
 * Derives a transparent, deterministic badge from real product data.
 * Rules:
 * - "Best Rated" if rating.rate >= 4.5
 * - "Popular Pick" if rating.count >= 200
 * - "Great Value" if price <= 30.00 and rating.rate >= 4.0
 * @param {Object} product 
 * @returns {{ text: string, type: string } | null}
 */
export function getProductBadge(product) {
  if (!product) return null;
  const rate = product.rating?.rate || 0;
  const count = product.rating?.count || 0;
  const price = product.price || 0;

  if (rate >= 4.5) {
    return { text: 'Best Rated', type: 'editorial' };
  }
  if (count >= 250) {
    return { text: 'Popular Pick', type: 'popular' };
  }
  if (price <= 35 * USD_TO_LKR_RATE && rate >= 4.0) {
    return { text: 'Great Value', type: 'value' };
  }
  return null;
}

/**
 * Filters and sorts catalog items based on criteria.
 * Search and category filters operate conjunctively.
 * @param {Array} products 
 * @param {Object} filters 
 * @param {string} filters.category - Selected category id ('all', 'clothing', etc.)
 * @param {string} filters.searchQuery - Raw search string
 * @param {string} filters.sort - Sort identifier
 * @returns {Array} Filtered and sorted products
 */
export function processCatalog(products, { category = 'all', searchQuery = '', sort = 'featured' }) {
  if (!Array.isArray(products)) return [];

  const query = searchQuery.trim().toLowerCase();

  // 1. Filter by category AND search query
  let result = products.filter((product) => {
    // Category check
    const categoryMatch = matchesCategory(product, category);
    if (!categoryMatch) return false;

    // Search query check (title and description)
    if (query) {
      const titleMatch = (product.title || '').toLowerCase().includes(query);
      const descMatch = (product.description || '').toLowerCase().includes(query);
      const catMatch = (product.category || '').toLowerCase().includes(query);
      return titleMatch || descMatch || catMatch;
    }

    return true;
  });

  // 2. Sort results
  result = [...result]; // Shallow copy before sorting

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rating-desc':
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      break;
    case 'featured':
    default:
      // Retain original FakeStore API catalog order
      result.sort((a, b) => a.id - b.id);
      break;
  }

  return result;
}
