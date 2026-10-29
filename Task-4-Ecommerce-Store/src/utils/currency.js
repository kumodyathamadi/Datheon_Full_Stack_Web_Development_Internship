/**
 * Uniform Currency Formatter for LORA FASHION
 * Ensures consistent two-decimal-place Sri Lankan Rupee (LKR) representation.
 */

const currencyFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format any numeric value into standard Sri Lankan price string (LKR XX.XX)
 * @param {number|string} amount 
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(numeric) || numeric === null || numeric === undefined) {
    return 'LKR 0.00';
  }
  return currencyFormatter.format(numeric).replace(/\u00A0/g, ' ');
}

export default formatCurrency;
