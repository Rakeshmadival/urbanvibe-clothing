import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';
import Button from '../common/Button.jsx';

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();

    // Wait until drawer animation finishes
    setTimeout(() => {
      navigate('/checkout');
    }, 350);
  };

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
              <h2 className="font-display text-xl tracking-wide">
                YOUR BAG ({items.length})
              </h2>

              <button onClick={onClose}>
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-fog mb-4">Your bag is empty.</p>

                  <Button
                    as={Link}
                    to="/shop"
                    variant="primary"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((it) => (
                    <li key={it.lineId} className="flex gap-4">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-20 h-24 object-cover"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{it.name}</p>

                        <p className="text-xs text-fog">
                          {[it.size, it.color].filter(Boolean).join(' / ')}
                        </p>

                        <div className="flex justify-between mt-2">
                          <div className="flex items-center border">
                            <button
                              className="p-2"
                              onClick={() =>
                                updateQty(it.lineId, it.qty - 1)
                              }
                            >
                              <Minus size={14} />
                            </button>

                            <span className="px-3">{it.qty}</span>

                            <button
                              className="p-2"
                              onClick={() =>
                                updateQty(it.lineId, it.qty + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <span>
                            {formatPrice(it.price * it.qty)}
                          </span>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(it.lineId)}>
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t">
                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>

                  <span className="font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCheckout}
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