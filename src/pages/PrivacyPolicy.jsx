import Seo from '../components/common/Seo.jsx';
import { siteConfig } from '../config/siteConfig.js';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <Seo title="Privacy Policy" />
      <h1 className="font-serif italic text-4xl mb-8">Privacy Policy</h1>
      <div className="prose text-ink/80 text-sm leading-relaxed space-y-5">
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
        <p>
          {siteConfig.brandName} ("we", "us") respects your privacy. This page explains what information we
          collect when you shop with us and how it's used.
        </p>
        <h2 className="font-medium text-ink text-base mt-6">Information We Collect</h2>
        <p>
          When you place an order via WhatsApp, we collect the name, phone number and delivery address you provide
          to fulfil that order. We do not require account creation, and we do not collect payment card details on
          this website.
        </p>
        <h2 className="font-medium text-ink text-base mt-6">How We Use It</h2>
        <p>Your details are used only to process and deliver your order, and to communicate with you about it.</p>
        <h2 className="font-medium text-ink text-base mt-6">Local Storage</h2>
        <p>
          Your cart, wishlist and recently viewed items are stored only in your browser's local storage to make
          browsing easier — this data is never transmitted to us until you place an order.
        </p>
        <h2 className="font-medium text-ink text-base mt-6">Contact</h2>
        <p>Questions about this policy can be sent to {siteConfig.email}.</p>
      </div>
    </div>
  );
}
