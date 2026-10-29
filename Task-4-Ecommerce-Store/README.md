# LORA FASHION — Objects Worth Discovering
### Creative, Premium E-Commerce Storefront

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FakeStoreAPI](https://img.shields.io/badge/API-FakeStoreAPI-0ea5e9?style=flat)](https://fakestoreapi.com/)
[![Tests](https://img.shields.io/badge/Tests-45%2F45%20Passed-10B981?style=flat)]()

**LORA FASHION** is a boutique editorial e-commerce shopping experience engineered with React, Vite, Tailwind CSS, and FakeStoreAPI. Inspired by contemporary retail monographs and independent design studios, LORA FASHION rejects generic cookie-cutter templates in favor of a warm, tactile aesthetic with refined typography, rich micro-interactions, and genuine cart and checkout functionality.

---

## 1. Visual & Editorial Identity

- **Color Palette:** Warm ivory and soft cream backgrounds (`#FAF8F5`, `#FCFAF7`), deep charcoal typography (`#181716`), and a restrained burnt-orange terracotta accent (`#C85A32`).
- **Typography:** Editorial serif headings (*Playfair Display*) paired with clean, modern sans-serif body (*Plus Jakarta Sans*) and monospaced accents (*JetBrains Mono*).
- **Product Display:** Square image containers with `object-fit: contain` on neutral backgrounds, ensuring products with varying aspect ratios render cleanly without unwanted distortion or cropping.
- **Micro-Interactions:** Smooth slide-out cart drawer from the right, quick-view preview modal, lively live badge animations, interactive add-to-cart toast notifications, and tactile hover states.

---

## 2. Key Architecture & Features

### A. Dynamic API Integration & Normalization
- Fetches real-time catalog from `https://fakestoreapi.com/products` via an asynchronous service module (`src/utils/api.js`).
- **Category Mapping:**
  - **Clothing** merges both `men's clothing` and `women's clothing` from the API.
  - **Jewelry** maps to `jewelery` internally while cleanly displaying "Jewelry" throughout the UI.
  - **Electronics** maps directly to `electronics`.
  - **All Products** renders the complete catalog.
- **Deterministic Badges:** Badges are derived purely from transparent product data rules (never randomized or fake):
  - `Best Rated`: Products with customer rating $\ge 4.5$.
  - `Popular Pick`: Products with $\ge 250$ customer reviews.
  - `Great Value`: Products under $\$35.00$ with customer rating $\ge 4.0$.

### B. Live Search & Sorting Engine
- Search operates in conjunction with active category filters (e.g. searching "jacket" while inside "Clothing" surfaces only clothing jackets).
- Sorting options include:
  - *Featured / Default Order* (retains API index)
  - *Price: Low to High*
  - *Price: High to Low*
  - *Highest Rated*

### C. Persistent Shopping Cart Drawer
- Persistent slide-out drawer from the right with a dimmed, blurred backdrop.
- Live cart badge on the navigation bar that dynamically reflects total quantity across all items.
- Line items include thumbnail, full title, category label, unit price, quantity increment/decrement controls, and line subtotal.
- **Decrement Policy:** Decrementing an item with quantity 1 safely removes the item from the cart.
- **Persistence:** Synchronized in real-time with `localStorage` (`lora_fashion_cart_v2`) using defensive parsing and automated legacy price migration.
- **Currency Conversion:** All catalog prices dynamically converted from FakeStoreAPI (USD) at the exchange rate:
  $$\text{1 USD} = \text{332.40 LKR}$$

### D. Cart Calculation Engine
All totals are recalculated deterministically from raw line items without accumulated floating-point rounding errors:
- **Subtotal:** $\sum (\text{unit price} \times \text{quantity})$.
- **Sales Tax:** Exactly $8\%$ ($0.08$) of subtotal.
- **Shipping Policy:**
  - Free standard shipping for subtotals $\ge \text{LKR } 24,930.00$ ($\$75.00 \times 332.40$).
  - Flat rate of $\text{LKR } 1,991.08$ ($\$5.99 \times 332.40$) for non-empty carts under threshold.
  - $\text{LKR } 0.00$ for an empty cart.
- **Progress Bar:** Real-time visual progress bar tracking how close the user is to complimentary shipping.
- **Uniform Currency Formatter:** Standardized two-decimal Sri Lankan Rupee format (`LKR XX.XX`) via `Intl.NumberFormat`.

### E. Simulated Checkout & Order Confirmation
- Prevents checkout when the cart is empty.
- Displays an itemized order summary, sales tax, shipping fee, and estimated total in LKR.
- Collects customer shipping details (Full name, Email, Street address, City, ZIP / Postal code).
- Real-time client-side field validation with contextual error alerts.
- Simulated payment methods (Demo Card, Apple Pay, Pay on Delivery).
- Generates a unique order reference code (e.g. `LORA-839210`).
- Confirmation modal displays full order manifest, shipping destination, timestamp, print receipt action, and returns user to catalog.
- Empties cart and local storage immediately upon successful order submission.

### F. Accessibility & Responsiveness
- Full keyboard support: `Escape` key closes modals and drawers, visible focus rings on interactive elements.
- ARIA landmarks, dialog roles, and accessible labels throughout.
- Built-in `prefers-reduced-motion` compliance.
- Responsive breakpoints tested from narrow 320px mobile up to 1440px+ ultra-wide desktop displays.

---

## 3. Project Structure

```
Task-4-Ecommerce-Store/
├── index.html                   # HTML entry point with Google Fonts
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Custom theme colors, fonts & keyframes
├── vite.config.js               # Vite build configuration
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application orchestrator & state
│   ├── index.css                # Base stylesheet & Tailwind directives
│   ├── components/
│   │   ├── Navbar.jsx           # Editorial header, live search & cart badge
│   │   ├── HeroSection.jsx      # Editorial banner & featured selection
│   │   ├── ShopToolbar.jsx      # Header controls, search & sort bar
│   │   ├── CategoryFilters.jsx  # Category tab pills with dynamic counts
│   │   ├── ProductGrid.jsx      # Responsive grid, skeleton & empty states
│   │   ├── ProductCard.jsx      # Fixed-ratio card with badges & quick actions
│   │   ├── ProductQuickView.jsx # Detailed product modal with specs & description
│   │   ├── CartDrawer.jsx       # Persistent slide-out shopping bag
│   │   ├── CartItem.jsx         # Line item with quantity stepper
│   │   ├── CartSummary.jsx      # Free shipping progress & financial totals
│   │   ├── CheckoutModal.jsx    # Simulated checkout form & validation
│   │   ├── OrderConfirmation.jsx# Post-purchase receipt & manifest
│   │   ├── AboutModal.jsx       # Brand narrative & technical disclosure
│   │   ├── ToastNotification.jsx# Feedback pill when adding items to bag
│   │   └── Footer.jsx           # Editorial footer & newsletter form
│   └── utils/
│       ├── api.js               # FakeStoreAPI fetcher, mapping & filters
│       ├── cartUtils.js         # Calculation engine & storage persistence
│       └── currency.js          # Unified two-decimal currency formatter
└── test/
    └── verifyAll.test.mjs       # Automated 45-point verification suite
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the project directory
cd Task-4-Ecommerce-Store

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
The app will run locally at `http://localhost:3000` (or the next available port).

### Running Verification Tests
```bash
# Run the 45-test automated verification suite
npm test
```

### Production Build
```bash
# Compile optimized bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Demonstration Disclaimer

LORA FASHION is an educational storefront demonstration. All product records are supplied dynamically by [FakeStoreAPI](https://fakestoreapi.com/). No real payment credentials are collected, stored, or processed, and no real merchant orders are placed.

