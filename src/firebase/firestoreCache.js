import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './db.js';
import { firebaseConfigured } from './app.js';

// Why this file exists:
// Every existing page/component calls productService.js functions
// synchronously during render (e.g. `getAllProducts()` directly in JSX),
// exactly like it did with the old products.json import. Firestore reads
// are asynchronous, so instead of refactoring every component to handle
// loading states, we keep a live, synchronously-readable cache here. A
// real-time onSnapshot listener keeps it fresh; a thin provider higher up
// the tree re-renders on every update, which naturally cascades down and
// re-runs every component's existing `getAllProducts()` call with fresh
// data — no component code changes required, and new admin-published
// products appear instantly across every open tab.

export const cache = {
  products: [],
  categories: [],
  collections: [],
  ready: { products: false, categories: false, collections: false },
};

let listeners = [];

export function subscribeToCacheChanges(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

function normalizeProduct(docSnap) {
  const data = docSnap.data();
  const status = data.status || 'published';
  return {
    id: docSnap.id,
    ...data,
    status,
    inStock: status !== 'out-of-stock',
    images: data.images && data.images.length ? data.images : ['/images/products/placeholder.svg'],
    sizes: data.sizes || [],
    colors: data.colors || [],
    collections: data.collections || [],
    rating: data.rating ?? 4.5,
    reviewCount: data.reviewCount ?? 0,
  };
}

let unsubscribers = [];

export function initFirestoreSync() {
  if (!firebaseConfigured) {
    cache.ready = { products: true, categories: true, collections: true };
    return () => {};
  }

  unsubscribers.forEach((u) => u());

  const productsUnsub = onSnapshot(
    collection(db, 'products'),
    (snap) => {
      cache.products = snap.docs.map(normalizeProduct).filter((p) => p.status !== 'draft');
      cache.ready.products = true;
      notify();
    },
    (err) => {
      console.error('[UrbanVibe] products listener failed:', err);
      cache.ready.products = true;
      notify();
    }
  );

  const categoriesUnsub = onSnapshot(
    collection(db, 'categories'),
    (snap) => {
      cache.categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cache.ready.categories = true;
      notify();
    },
    (err) => {
      console.error('[UrbanVibe] categories listener failed:', err);
      cache.ready.categories = true;
      notify();
    }
  );

  const collectionsUnsub = onSnapshot(
    collection(db, 'collections'),
    (snap) => {
      cache.collections = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cache.ready.collections = true;
      notify();
    },
    (err) => {
      console.error('[UrbanVibe] collections listener failed:', err);
      cache.ready.collections = true;
      notify();
    }
  );

  unsubscribers = [productsUnsub, categoriesUnsub, collectionsUnsub];
  return () => unsubscribers.forEach((u) => u());
}

export function isCacheReady() {
  return cache.ready.products && cache.ready.categories && cache.ready.collections;
}
