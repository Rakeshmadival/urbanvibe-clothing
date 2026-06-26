import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './db.js';
import { firebaseConfigured } from './app.js';

const ORDERS_COLLECTION = 'orders';

export async function createOrder({ customer, items, subtotal }) {
  if (!firebaseConfigured) return null; // graceful no-op if Firebase isn't set up yet
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      customer,
      items,
      subtotal,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    // Never block checkout/WhatsApp on this — order is still placed via WhatsApp either way.
    console.warn('[UrbanVibe] Could not save order to Firestore:', err.message);
    return null;
  }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, ORDERS_COLLECTION),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { orders, loading };
}
