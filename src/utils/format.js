import { siteConfig } from '../config/siteConfig.js';

export function formatPrice(amount) {
  return `${siteConfig.currency}${Number(amount).toLocaleString('en-IN')}`;
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
