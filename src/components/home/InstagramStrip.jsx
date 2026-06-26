import { Instagram } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig.js';

const tiles = [
  { emoji: '👗', bg: '#0a0a0a' },
  { emoji: '🧥', bg: '#1c1c1c' },
  { emoji: '👕', bg: '#2a2118' },
  { emoji: '🧵', bg: '#0a0a0a' },
  { emoji: '👜', bg: '#1c1c1c' },
  { emoji: '🩱', bg: '#2a2118' },
];

export default function InstagramStrip() {
  return (
    <section className="py-16 md:py-20 bg-ink text-center">
      <Instagram size={26} className="text-gold mx-auto mb-3" strokeWidth={1.5} />
      <p className="font-serif italic text-2xl text-ivory mb-1">Follow the Journey</p>
      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noreferrer"
        className="text-gold-soft text-sm hover:text-gold"
      >
        {siteConfig.instagramHandle}
      </a>

      <div className="grid grid-cols-3 sm:grid-cols-6 max-w-4xl mx-auto mt-10">
        {tiles.map((t, i) => (
          <a
            key={i}
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="aspect-square flex items-center justify-center text-3xl hover:opacity-80 transition-opacity"
            style={{ backgroundColor: t.bg }}
          >
            {t.emoji}
          </a>
        ))}
      </div>
    </section>
  );
}
