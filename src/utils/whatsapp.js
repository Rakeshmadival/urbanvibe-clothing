import { siteConfig } from '../config/siteConfig.js';
import { formatPrice } from './format.js';

export function buildWhatsAppOrderUrl({ customer, items, subtotal }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const lines = [];

  lines.push(`*New Order — UrbanVibe*`);
  lines.push('');
  lines.push(`*Name:* ${customer.name}`);
  lines.push(`*Phone:* ${customer.phone}`);
  lines.push(`*Address:* ${customer.address}`);
  lines.push('');
  lines.push(`*Order Details:*`);

  items.forEach((it, idx) => {
    const variant = [it.size && `Size: ${it.size}`, it.color && `Color: ${it.color}`]
      .filter(Boolean)
      .join(', ');
    lines.push(`${idx + 1}. ${it.name}${variant ? ` (${variant})` : ''} x${it.qty} — ${formatPrice(it.price * it.qty)}`);
    if (it.image) {
      lines.push(`   Photo: ${origin}${it.image}`);
    }
  });

  lines.push('');
  lines.push(`*Subtotal:* ${formatPrice(subtotal)}`);
  lines.push(`*Payment:* COD / UPI — to be confirmed`);
  lines.push('');
  lines.push(`Please confirm availability. Thank you for shopping UrbanVibe! 🖤`);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function buildWhatsAppGeneralUrl(message) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
