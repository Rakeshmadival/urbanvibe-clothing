import { Star } from 'lucide-react';
import SectionHeading from '../common/SectionHeading.jsx';

const reviews = [
  { name: 'Ananya R.', text: 'The fabric quality is genuinely premium and the fit is exactly as shown. My go-to for everyday wear now.', rating: 5 },
  { name: 'Rohit K.', text: 'Ordered via WhatsApp, super quick response, and the shirt fit perfectly. Will order again.', rating: 5 },
  { name: 'Priya M.', text: 'Bought the festive kurta set for my daughter — the detailing is beautiful for the price.', rating: 4 },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <SectionHeading eyebrow="Loved By Customers" title="What They're Saying" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.name} className="border border-gold-line p-7 bg-white/40">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < r.rating ? 'fill-gold text-gold' : 'text-ink/15'} />
              ))}
            </div>
            <p className="text-sm text-ink/80 mb-4 leading-relaxed">"{r.text}"</p>
            <p className="text-xs tracking-widest2 uppercase text-gold-deep">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
