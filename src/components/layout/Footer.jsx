import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import { siteConfig } from '../../config/siteConfig.js';
import { buildWhatsAppGeneralUrl } from '../../utils/whatsapp.js';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Frontend-only for now — stored locally as a queued list.
    // Once a backend exists, swap this for a real subscribe API call.
    const queued = JSON.parse(localStorage.getItem('uv_newsletter_queue') || '[]');
    localStorage.setItem('uv_newsletter_queue', JSON.stringify([...queued, email]));
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <Logo className="mb-4" />
          <p className="text-ivory/60 text-sm max-w-xs mb-5">
            Premium everyday fashion for women, men and kids. Designed in {siteConfig.city}, worn everywhere.
          </p>
          <div className="flex items-center gap-4">
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="text-ivory/70 hover:text-gold-soft">
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a href={buildWhatsAppGeneralUrl('Hi UrbanVibe! I have a question.')} target="_blank" rel="noreferrer" className="text-ivory/70 hover:text-gold-soft">
              <MessageCircle size={20} strokeWidth={1.5} />
            </a>
            <a href={`mailto:${siteConfig.email}`} className="text-ivory/70 hover:text-gold-soft">
              <Mail size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-gold text-xs tracking-widest2 uppercase mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li><Link to="/shop/women" className="hover:text-gold-soft">Women</Link></li>
            <li><Link to="/shop/men" className="hover:text-gold-soft">Men</Link></li>
            <li><Link to="/shop/kids" className="hover:text-gold-soft">Kids</Link></li>
            <li><Link to="/collections" className="hover:text-gold-soft">Collections</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-gold text-xs tracking-widest2 uppercase mb-4">Help</p>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li><Link to="/contact" className="hover:text-gold-soft">Contact Us</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-gold-soft">Shipping Policy</Link></li>
            <li><Link to="/returns-policy" className="hover:text-gold-soft">Returns &amp; Exchanges</Link></li>
            <li><Link to="/faqs" className="hover:text-gold-soft">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-gold text-xs tracking-widest2 uppercase mb-4">Stay in the Loop</p>
          <p className="text-ivory/60 text-sm mb-4">New arrivals, early access, festive drops.</p>
          {subscribed ? (
            <p className="text-gold-soft text-sm">You're on the list. 🖤</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-ivory/30 pb-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm placeholder-ivory/40 outline-none"
              />
              <button type="submit" className="text-xs tracking-widest2 uppercase text-gold-soft hover:text-gold">
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} {siteConfig.brandName} Clothing. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-gold-soft">Privacy Policy</Link>
            <Link to="/shipping-policy" className="hover:text-gold-soft">Shipping</Link>
            <Link to="/returns-policy" className="hover:text-gold-soft">Returns</Link>
            <span>COD &amp; UPI accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
