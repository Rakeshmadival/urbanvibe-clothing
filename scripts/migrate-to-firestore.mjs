// One-time setup script — seeds your Firestore database with the products,
// categories and collections that used to live in src/data/*.json, plus a
// starter settings doc. Safe to re-run; it overwrites by the same IDs each
// time rather than duplicating.
//
// Setup:
//   1. Firebase Console → Project Settings → Service Accounts → Generate new private key
//   2. Save the downloaded file as serviceAccountKey.json in the project root (already gitignored)
//   3. npm install firebase-admin --save-dev   (if not already installed)
//   4. node scripts/migrate-to-firestore.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf-8'));
} catch {
  console.error(
    '\n❌ serviceAccountKey.json not found in the project root.\n' +
      'Get it from: Firebase Console → Project Settings → Service Accounts → Generate new private key\n'
  );
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const { FieldValue } = admin.firestore;

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(__dirname, '..', relPath), 'utf-8'));
}

async function migrateProducts() {
  const products = readJson('src/data/products.json');
  const batch = db.batch();
  products.forEach((p) => {
    const { id, inStock, ...rest } = p;
    const status = inStock === false ? 'out-of-stock' : 'published';
    batch.set(db.collection('products').doc(id), {
      ...rest,
      status,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  console.log(`✅ Migrated ${products.length} products`);
}

async function migrateCategories() {
  const categories = readJson('src/data/categories.json');
  const batch = db.batch();
  categories.forEach((c) => {
    const { id, ...rest } = c;
    batch.set(db.collection('categories').doc(id), rest);
  });
  await batch.commit();
  console.log(`✅ Migrated ${categories.length} categories`);
}

async function migrateCollections() {
  const collections = readJson('src/data/collections.json');
  const batch = db.batch();
  collections.forEach((c) => {
    const { id, ...rest } = c;
    batch.set(db.collection('collections').doc(id), rest);
  });
  await batch.commit();
  console.log(`✅ Migrated ${collections.length} collections`);
}

async function seedSettings() {
  await db.doc('settings/store').set(
    {
      brandName: 'UrbanVibe',
      tagline: 'Dress Your Everyday',
      whatsappNumber: '919945369185',
      instagramHandle: '@urbanvibe.clothing',
      instagramUrl: 'https://instagram.com/urbanvibe.clothing',
      email: 'hello@urbanvibe.example',
      city: 'Bengaluru',
      currency: '₹',
      freeShippingThreshold: 999,
      codAvailable: true,
    },
    { merge: true }
  );
  console.log('✅ Seeded settings/store');
}

async function run() {
  console.log('Starting Firestore migration...\n');
  await migrateProducts();
  await migrateCategories();
  await migrateCollections();
  await seedSettings();
  console.log('\nDone! Your Firestore database is now seeded. Refresh the live site to see it pull from Firestore.');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
