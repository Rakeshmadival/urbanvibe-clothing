import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Seo from '../components/common/Seo.jsx';
import { siteConfig } from '../config/siteConfig.js';

const faqs = [
  { q: 'How do I place an order?', a: 'Add items to your cart, go to checkout, fill in your name, phone and address, then tap "Place Order on WhatsApp". Your order details open in WhatsApp — just hit send.' },
  { q: 'Do I need to create an account?', a: 'No. You can browse, add to cart, and order directly via WhatsApp without signing up for anything.' },
  { q: 'What payment methods are accepted?', a: siteConfig.codAvailable ? 'Cash on Delivery and UPI are both accepted. We confirm the easiest option with you on WhatsApp.' : 'UPI payment is accepted, confirmed with you on WhatsApp.' },
  { q: 'How long does delivery take?', a: 'Most orders are delivered within 3–6 business days across India.' },
  { q: 'Can I return or exchange an item?', a: 'Yes, within 7 days of delivery as long as the item is unused with tags intact. See our Returns & Exchanges page for details.' },
  { q: 'How do I know my size will fit?', a: 'Each product page has a Size Guide link next to the size selector with measurements for every size.' },
];

export default function FAQs() {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
      <Seo title="FAQs" description="Frequently asked questions about UrbanVibe Clothing." />
      <h1 className="font-serif italic text-4xl mb-10 text-center">Frequently Asked Questions</h1>
      <div className="divide-y divide-ink/10">
        {faqs.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium pr-4">{f.q}</span>
              <ChevronDown
                size={18}
                className={`text-gold-deep flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && <p className="text-sm text-ink/70 pb-5 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
