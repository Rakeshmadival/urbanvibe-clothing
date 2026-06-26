import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';
import Button from '../common/Button.jsx';

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-ivory z-[80] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
              <h2 className="font-display text-xl tracking-wide">YOUR BAG ({items.length})</h2>
              <button onClick={onClose} aria-label="Close cart">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <p className="text-fog mb-4">Your bag is empty.</p>
                  <Button variant="primary" onClick={onClose} as={Link} to="/shop">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((it) => (
                    <li key={it.lineId} className="flex gap-4">
                      <img src={it.image} alt={it.name} className="w-20 h-24 object-cover flex-shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{it.name}</p>
                        <p className="text-xs text-fog mt-0.5">
                          {[it.size, it.color].filter(Boolean).join(' / ')}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-ink/15">
                            <button
                              onClick={() => updateQty(it.lineId, it.qty - 1)}
                              className="p-1.5 hover:bg-ink/5"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm">{it.qty}</span>
                            <button
                              onClick={() => updateQty(it.lineId, it.qty + 1)}
                              className="p-1.5 hover:bg-ink/5"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(it.price * it.qty)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(it.lineId)}
                        aria-label="Remove item"
                        className="text-fog hover:text-rust self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/10">
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-fog">Subtotal</span>
                  <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
