import Seo from '../components/common/Seo.jsx';
import { siteConfig } from '../config/siteConfig.js';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Seo title="About Us" description="The story behind UrbanVibe Clothing." />
      <p className="text-gold-deep text-xs tracking-widest2 uppercase mb-3">Our Story</p>
      <h1 className="font-serif italic text-4xl md:text-5xl mb-8">About {siteConfig.brandName}</h1>
      <div className="prose text-ink/80 text-sm leading-relaxed space-y-5">
        <p>
          UrbanVibe Clothing started in {siteConfig.city} with a simple idea — everyday fashion shouldn't mean
          choosing between style and comfort. We design pieces for women, men and kids that feel as good as they
          look, at prices that make sense.
        </p>
        <p>
          Every product is picked for fabric quality and fit first. No filler, no fast-fashion compromises — just
          pieces you'll actually reach for, season after season.
        </p>
        <p>
          We keep ordering simple too. No accounts, no clutter — browse, pick what you love, and place your order
          directly with us on WhatsApp. A real person on the other end, every time.
        </p>
      </div>
    </div>
  );
}
