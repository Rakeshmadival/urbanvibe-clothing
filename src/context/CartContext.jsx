import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const CartContext = createContext(null);

function lineId(productId, size, color) {
  return `${productId}__${size || 'na'}__${color || 'na'}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('uv_cart', []);

  const addToCart = (product, { size, color, qty = 1, image } = {}) => {
    const id = lineId(product.id, size, color);
    setItems((prev) => {
      const existing = prev.find((it) => it.lineId === id);
      if (existing) {
        return prev.map((it) =>
          it.lineId === id ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [
        ...prev,
        {
          lineId: id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: image || product.images?.[0],
          size,
          color,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((it) => it.lineId !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setItems((prev) => prev.map((it) => (it.lineId === id ? { ...it, qty } : it)));
  };

  const clearCart = () => setItems([]);

  const { subtotal, count } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        subtotal: acc.subtotal + it.price * it.qty,
        count: acc.count + it.qty,
      }),
      { subtotal: 0, count: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
