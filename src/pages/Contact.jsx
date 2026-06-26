import { MessageCircle, Mail, Instagram, MapPin } from 'lucide-react';
import Seo from '../components/common/Seo.jsx';
import Button from '../components/common/Button.jsx';
import { siteConfig } from '../config/siteConfig.js';
import { buildWhatsAppGeneralUrl } from '../utils/whatsapp.js';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
      <Seo title="Contact Us" description="Get in touch with UrbanVibe Clothing." />
      <p className="text-gold-deep text-xs tracking-widest2 uppercase mb-3">We'd Love to Hear From You</p>
      <h1 className="font-serif italic text-4xl md:text-5xl mb-10">Contact Us</h1>

      <div className="space-y-5 mb-10 text-left max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <MessageCircle size={18} className="text-gold-deep flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm">WhatsApp: +{siteConfig.whatsappNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gold-deep flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm">{siteConfig.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Instagram size={18} className="text-gold-deep flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm">{siteConfig.instagramHandle}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-gold-deep flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm">{siteConfig.city}, India</span>
        </div>
      </div>

      <Button
        as="a"
        href={buildWhatsAppGeneralUrl('Hi UrbanVibe! I have a question about an order.')}
        target="_blank"
        rel="noreferrer"
        variant="primary"
      >
        Message Us on WhatsApp
      </Button>
    </div>
  );
}
