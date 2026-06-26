import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './db.js';

const PRODUCTS_COLLECTION = 'products';

// Generates a Firestore document ID without writing anything yet — lets the
// Add Product form upload images to the right Storage path *before* the
// product is actually saved/published.
export function generateProductId() {
  return doc(collection(db, PRODUCTS_COLLECTION)).id;
}

export async function saveProduct(productId, productData, { isNew }) {
  const ref = doc(db, PRODUCTS_COLLECTION, productId);
  if (isNew) {
    await setDoc(ref, { ...productData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, { ...productData, updatedAt: serverTimestamp() });
  }
}

// Live, unfiltered (includes drafts) products list — for admin use only.
// Kept separate from src/firebase/firestoreCache.js, which is the
// customer-facing, published-only cache used by productService.js.
export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, PRODUCTS_COLLECTION),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
        setProducts(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { products, loading, error };
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}
