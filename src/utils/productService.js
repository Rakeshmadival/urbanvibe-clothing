import { cache } from '../firebase/firestoreCache.js';

// Same exact function names/signatures as before, when this read from
// products.json. Now it reads from the live Firestore cache instead —
// every page/component that calls these functions needed zero changes.

export function getAllProducts() {
  return cache.products;
}

export function getProductBySlug(slug) {
  return cache.products.find((p) => p.slug === slug) || null;
}

export function getProductsByCategory(categorySlug) {
  return cache.products.filter((p) => p.category === categorySlug);
}

export function getProductsByCollection(collectionSlug) {
  return cache.products.filter((p) => p.collections?.includes(collectionSlug));
}

export function getNewArrivals(limit = 8) {
  return cache.products.filter((p) => p.newArrival).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return cache.products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getRelatedProducts(product, limit = 4) {
  return cache.products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getProductsByIds(ids) {
  return ids.map((id) => cache.products.find((p) => p.id === id)).filter(Boolean);
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return cache.products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
  );
}

export function getAllCategories() {
  return cache.categories;
}

export function getCategoryBySlug(slug) {
  return cache.categories.find((c) => c.slug === slug) || null;
}

export function getAllCollections() {
  return cache.collections;
}

export function getCollectionBySlug(slug) {
  return cache.collections.find((c) => c.slug === slug) || null;
}
