import { siteConfig } from '../config/siteConfig.js';
import { formatPrice } from './format.js';

export function buildWhatsAppOrderUrl({ customer, items, subtotal }) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';

  const orderId = `UV-${Date.now().toString().slice(-6)}`;

  const lines = [];

  lines.push('🛍️ *URBANVIBE CLOTHING*');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(`🆔 *Order ID:* ${orderId}`);
  lines.push(`📅 *Date:* ${new Date().toLocaleString()}`);
  lines.push('');
  lines.push('👤 *CUSTOMER DETAILS*');
  lines.push(`• Name : ${customer.name}`);
  lines.push(`• Phone : ${customer.phone}`);
  lines.push('• Address :');
  lines.push(customer.address);
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push('🛒 *ORDER ITEMS*');
  lines.push('');

  items.forEach((it, index) => {
    const image =
      it.image && it.image.startsWith('http')
        ? it.image
        : `${origin}${it.image}`;

    const productLink = `${origin}/product/${it.slug}`;

    lines.push(`*${index + 1}. ${it.name}*`);
    lines.push(`📏 Size : ${it.size || '-'}`);
    lines.push(`🎨 Color : ${it.color || '-'}`);
    lines.push(`🔢 Qty : ${it.qty}`);
    lines.push(`💵 Price : ${formatPrice(it.price)}`);
    lines.push(`💰 Total : ${formatPrice(it.price * it.qty)}`);
    lines.push(`🖼️ Image : ${image}`);
    lines.push(`🔗 Product : ${productLink}`);
    lines.push('');
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(`💳 *Subtotal:* ${formatPrice(subtotal)}`);
  lines.push('💵 *Payment:* COD / UPI');
  lines.push('');
  lines.push('✅ Please confirm this order with the customer.');
  lines.push('');
  lines.push('🖤 Thank you for shopping with UrbanVibe.');

  const text = encodeURIComponent(lines.join('\n'));

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function buildWhatsAppGeneralUrl(message) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}