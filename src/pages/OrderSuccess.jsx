import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Seo from '../components/common/Seo.jsx';
import Button from '../components/common/Button.jsx';

export default function OrderSuccess() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <Seo title="Order Placed" />
      <CheckCircle2 size={56} className="text-gold mb-5" strokeWidth={1.3} />
      <h1 className="font-serif italic text-3xl md:text-4xl mb-3">Order Sent!</h1>
      <p className="text-fog text-sm mb-8">
        Your order details have been opened in WhatsApp — please hit send if it hasn't gone through automatically.
        We'll confirm availability and delivery details with you shortly.
      </p>
      <Button as={Link} to="/shop" variant="primary">
        Continue Shopping
      </Button>
    </div>
  );
}
