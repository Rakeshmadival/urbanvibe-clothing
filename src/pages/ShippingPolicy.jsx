import Seo from '../components/common/Seo.jsx';
import { siteConfig } from '../config/siteConfig.js';

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <Seo title="Shipping Policy" />
      <h1 className="font-serif italic text-4xl mb-8">Shipping Policy</h1>
      <div className="prose text-ink/80 text-sm leading-relaxed space-y-5">
        <h2 className="font-medium text-ink text-base">Delivery Timeline</h2>
        <p>Orders are typically delivered within 3–6 business days across India, depending on your location.</p>
        <h2 className="font-medium text-ink text-base mt-6">Shipping Charges</h2>
        <p>
          Free shipping on orders above {siteConfig.currency}{siteConfig.freeShippingThreshold}. A flat shipping
          fee applies on orders below this amount, confirmed with you on WhatsApp before dispatch.
        </p>
        <h2 className="font-medium text-ink text-base mt-6">Order Tracking</h2>
        <p>
          Since orders are confirmed over WhatsApp, we'll share tracking details directly in your chat once your
          order ships.
        </p>
        <h2 className="font-medium text-ink text-base mt-6">Delays</h2>
        <p>Occasional delays may happen due to courier or weather disruptions — we'll keep you posted if this affects your order.</p>
      </div>
    </div>
  );
}
