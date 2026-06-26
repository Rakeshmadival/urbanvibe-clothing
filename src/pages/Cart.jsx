import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Seo from '../components/common/Seo.jsx';
import Button from '../components/common/Button.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';
import { siteConfig } from '../config/siteConfig.js';

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center min-h-[50vh]">
        <Seo title="Your Cart" />
        <p className="text-fog mb-6">Your bag is empty.</p>
        <Button as={Link} to="/shop" variant="primary">
          Start Shopping
        </Button>
      </div>
    );
  }

  const eligibleForFreeShipping = subtotal >= siteConfig.freeShippingThreshold;

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <Seo title="Your Cart" />
      <h1 className="font-serif italic text-3xl md:text-4xl mb-8">Your Bag</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <ul className="divide-y divide-ink/10">
            {items.map((it) => (
              <li key={it.lineId} className="flex gap-4 py-5">
                <img src={it.image} alt={it.name} className="w-24 h-28 object-cover flex-shrink-0" loading="lazy" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{it.name}</p>
                      <p className="text-xs text-fog mt-1">{[it.size, it.color].filter(Boolean).join(' / ')}</p>
                    </div>
                    <button onClick={() => removeFromCart(it.lineId)} className="text-fog hover:text-rust">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-ink/15">
                      <button onClick={() => updateQty(it.lineId, it.qty - 1)} className="p-2 hover:bg-ink/5">
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm">{it.qty}</span>
                      <button onClick={() => updateQty(it.lineId, it.qty + 1)} className="p-2 hover:bg-ink/5">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-medium">{formatPrice(it.price * it.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-ink/10 p-6 h-fit">
          <h2 className="text-xs tracking-widest2 uppercase mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-fog">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-fog">Shipping</span>
            <span>{eligibleForFreeShipping ? 'Free' : 'Calculated at checkout'}</span>
          </div>
          {!eligibleForFreeShipping && (
            <p className="text-xs text-gold-deep mb-4">
              Add {formatPrice(siteConfig.freeShippingThreshold - subtotal)} more for free shipping
            </p>
          )}
          <div className="border-t border-ink/10 pt-4 flex justify-between mb-5">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
          </div>
          <Button variant="primary" className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
