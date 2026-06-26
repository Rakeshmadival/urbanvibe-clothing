import Seo from '../components/common/Seo.jsx';

export default function ReturnsPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <Seo title="Returns & Exchanges" />
      <h1 className="font-serif italic text-4xl mb-8">Returns &amp; Exchanges</h1>
      <div className="prose text-ink/80 text-sm leading-relaxed space-y-5">
        <h2 className="font-medium text-ink text-base">Return Window</h2>
        <p>We accept returns and exchanges within 7 days of delivery, provided the item is unused, unwashed, and has its original tags attached.</p>
        <h2 className="font-medium text-ink text-base mt-6">How to Initiate</h2>
        <p>Message us on WhatsApp with your order details and reason for return. We'll guide you through the pickup or exchange process.</p>
        <h2 className="font-medium text-ink text-base mt-6">Refunds</h2>
        <p>Once the returned item is received and checked, refunds are processed to your original payment method within 5–7 business days. COD orders are refunded via UPI.</p>
        <h2 className="font-medium text-ink text-base mt-6">Non-Returnable Items</h2>
        <p>Innerwear and customized/festive-embroidered pieces marked as final sale cannot be returned for hygiene and customization reasons.</p>
      </div>
    </div>
  );
}
