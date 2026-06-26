import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import Button from '../components/common/Button.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp.js';
import { createOrder } from '../firebase/ordersService.js';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^[0-9]{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim() || form.address.trim().length < 10) next.address = 'Please enter your full delivery address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);

    // Saved to Firestore for your records in /admin/orders. Never blocks
    // checkout — the order still goes through via WhatsApp even if this fails.
    await createOrder({ customer: form, items, subtotal });

    const url = buildWhatsAppOrderUrl({ customer: form, items, subtotal });
    window.open(url, '_blank');
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <Seo title="Checkout" />
      <h1 className="font-serif italic text-3xl md:text-4xl mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className={`w-full border px-4 py-3 text-sm outline-none ${errors.name ? 'border-rust' : 'border-ink/20 focus:border-ink'}`}
            />
            {errors.name && <p className="text-rust text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              className={`w-full border px-4 py-3 text-sm outline-none ${errors.phone ? 'border-rust' : 'border-ink/20 focus:border-ink'}`}
            />
            {errors.phone && <p className="text-rust text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Delivery Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House/flat no, street, area, city, state, pincode"
              rows={4}
              className={`w-full border px-4 py-3 text-sm outline-none resize-none ${errors.address ? 'border-rust' : 'border-ink/20 focus:border-ink'}`}
            />
            {errors.address && <p className="text-rust text-xs mt-1">{errors.address}</p>}
          </div>

          <p className="text-xs text-fog">
            Payment: Cash on Delivery or UPI — we'll confirm the easiest option with you on WhatsApp.
          </p>

          <Button type="submit" variant="primary" className="w-full" disabled={placing}>
            {placing ? 'Placing Order…' : 'Place Order on WhatsApp'}
          </Button>
          <p className="text-xs text-fog text-center">
            You'll be redirected to WhatsApp with your order details pre-filled. Just hit send.
          </p>
        </form>

        <div className="border border-ink/10 p-6 h-fit">
          <h2 className="text-xs tracking-widest2 uppercase mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((it) => (
              <li key={it.lineId} className="flex gap-3 text-sm">
                <img src={it.image} alt={it.name} className="w-12 h-14 object-cover flex-shrink-0" loading="lazy" />
                <div className="flex-1">
                  <p className="truncate">{it.name}</p>
                  <p className="text-fog text-xs">
                    {[it.size, it.color].filter(Boolean).join(' / ')} × {it.qty}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink/10 pt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
          </div>
          <Link to="/cart" className="text-xs text-fog hover:text-gold-deep underline block mt-4">
            Edit cart
          </Link>
        </div>
      </div>
    </div>
  );
}
