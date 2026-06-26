# UrbanVibe Clothing

A premium, fully responsive e-commerce frontend (React + Vite + Tailwind CSS + Framer Motion) with a
**Firebase-backed admin panel**: real Firestore database, Firebase Auth login, Firebase Storage image
uploads. Orders are still placed via WhatsApp (no payment gateway). Products you publish in the admin
panel appear on the live site instantly, in real time, with no redeploy.

---

## ⚠️ Read this before you do anything else

This project **will not work until you create a real Firebase project and connect it** — that part
can only be done by you, with your own Google account. I can't create cloud infrastructure on your
behalf, and I have no way to test against a live Firebase project from my end either, so the steps
below are written carefully, but you're the one running them for the first time. Budget ~20–30
focused minutes for this the first time.

## Part 1 — Create your Firebase project (one-time, ~10 min)

1. Go to **https://console.firebase.google.com** → **Add project** → name it (e.g. `urbanvibe-clothing`) → finish the wizard (Google Analytics is optional, skip it if unsure).
2. In your new project, click the **Web** icon (`</>`) to register a web app → name it anything → **do not** check "Firebase Hosting" → **Register app**.
3. Firebase shows you a `firebaseConfig` object with values like `apiKey`, `authDomain`, etc. **Keep this tab open**, you need these values in Part 2.
4. In the left sidebar:
   - **Build → Authentication** → **Get started** → **Sign-in method** tab → enable **Email/Password**.
   - **Build → Firestore Database** → **Create database** → start in **production mode** → pick a region close to your customers (e.g. `asia-south1` for India).
   - **Build → Storage** → **Get started** → production mode → same region.

## Part 2 — Connect this project to your Firebase project (~5 min)

1. Copy `.env.example` to a new file named `.env.local` in the project root.
2. Fill in every value from the `firebaseConfig` object you saw in step 3 above:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=urbanvibe-clothing.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=urbanvibe-clothing
   VITE_FIREBASE_STORAGE_BUCKET=urbanvibe-clothing.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. `.env.local` is already in `.gitignore` — never commit it or share it publicly.

## Part 3 — Deploy security rules (~5 min)

Without this, anyone could read/write your database directly. Run once:

```bash
npm install -g firebase-tools     # if you don't have it already
firebase login                    # opens a browser to sign in with the same Google account
firebase use --add                # pick your project, give it any alias e.g. "default"
firebase deploy --only firestore:rules,storage:rules
```

This uses the `firestore.rules` and `storage.rules` files already in this project (referenced by
`firebase.json`) — you don't need to write any rules yourself.

## Part 4 — Seed your database with the starter catalog (~5 min)

This loads the 16 starter products (with placeholder photos), 3 categories, and 3 collections into
Firestore, so the site isn't empty on first load.

1. Firebase Console → ⚙️ **Project Settings** → **Service Accounts** tab → **Generate new private key** → save the downloaded file as `serviceAccountKey.json` in this project's root folder (already gitignored — never commit it).
2. Run:
   ```bash
   npm install
   node scripts/migrate-to-firestore.mjs
   ```
3. You should see `✅ Migrated 16 products`, etc.

From this point on, **`products.json` is no longer used by the live app** — it only exists as the
one-time seed source for the script above. All real data lives in Firestore.

## Part 5 — Create your admin login (~2 min)

There's no public sign-up page (on purpose — see Security below). Create your own admin account:

Firebase Console → **Authentication** → **Users** tab → **Add user** → enter your email + a strong
password. That's it — this is now your login at `/admin/login`.

## Part 6 — Run it

```bash
npm run dev
```

- Customer site: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin/login` → log in with the email/password from Part 5

For production:
```bash
npm run build
```
Drag the resulting `dist` folder onto Netlify exactly like before. **Set the same environment
variables from `.env.local` in Netlify's Site settings → Environment variables** — Netlify doesn't
read your local `.env.local` file, you have to add them there too.

---

## How the admin panel works

```
/admin/login        Firebase Auth email/password sign-in
/admin/dashboard     Stats overview (products by status, recent orders)
/admin/products      Search/filter all products, edit or delete
/admin/products/new  Add a product — drag-drop multiple photos, set price,
                     sizes, colors, collections, status, New Arrival / Featured toggles
/admin/orders        Every order placed at checkout, read-only
```

Publishing a product (status = "Published") makes it appear on the live site **immediately, for
every visitor already browsing**, no refresh needed — it's a real-time Firestore listener, not a
cache that updates on next page load.

**Product status:**
- `Draft` — hidden everywhere on the customer site. Use this while you're still adding photos/details.
- `Published` — fully visible and orderable.
- `Out of Stock` — still visible and browsable (so customers know it exists), shows a "Sold Out" badge, can't be added to cart.

**Featured / New Arrival toggles** — these map directly to the homepage rails that already existed
(Best Sellers and New Arrivals respectively), so checking them is what makes a product show up there.

## Security model — what's protected and how

- Firestore & Storage **rules require a signed-in user for any write** (add/edit/delete products,
  upload/delete images). Reads are public, since this is a storefront everyone needs to browse.
- There's deliberately **no public sign-up page** — the only way to get an admin account is you
  creating it manually in the Firebase Console (Part 5). Since no one else can create an account,
  "signed in" and "is the admin" are the same thing here.
- This is the right level of security for a one-person or small-team store. If you ever bring on
  multiple staff with different permission levels, the next step up is Firebase custom claims
  (role-based access) — not needed for launch.
- Orders can be **created** by anyone (customers aren't logged in when they check out), but can only
  be **read or modified** by a signed-in admin — so a stranger can place an order but can't see or
  tamper with anyone else's order data.

## What I could not do for you (and why)

I don't have a Google account to create your Firebase project with, and my sandbox can't reach
Firebase's servers at all (it's restricted to package registries like npm/PyPI for installing
dependencies) — so none of this was testable against a *live* Firebase backend on my end. What I
could and did do: install the real `firebase` SDK locally, write every file against its actual API,
and run a full production build to confirm there are no syntax/import errors anywhere in the new
code. The remaining risk is purely "does it behave correctly against your real Firebase project,"
which only becomes testable once you complete Parts 1–5 above. If something doesn't work as
expected once it's connected, paste me the exact error and I'll fix it fast.

## Architecture notes (if you're curious how this avoided a redesign)

- `src/utils/productService.js` still exports the exact same functions (`getAllProducts`,
  `getProductBySlug`, etc.) every existing page/component already called — only their *internals*
  changed, from reading a JSON import to reading a live cache.
- `src/firebase/firestoreCache.js` is that cache: a real-time Firestore listener keeps it fresh, and
  `src/components/FirestoreSyncProvider.jsx` (wrapping just the customer-facing routes) re-renders
  the page whenever it updates — which is what makes new products "just appear" without you touching
  any component code.
- The admin panel is a fully separate route tree (`/admin/*`) with its own layout — it shares the
  data layer but none of the customer-facing chrome, styling, or animations were touched.
- Firebase Auth/Storage code is only ever loaded when you actually visit an `/admin/*` route — it's
  excluded from what regular customers download, so the storefront stays fast.

## Known scope cuts (so nothing is mysterious)

- **No Categories/Collections admin UI yet** — they're in Firestore now (`categories`, `collections`
  collections) and the storefront reads them live, but editing them today still means editing
  `src/data/categories.json` / `collections.json` and re-running the migration script. Given the
  site only has 3 fixed categories, this wasn't worth building yet — happy to add it if you want it.
- **No Settings admin page** — the `settings/store` Firestore document gets created by the migration
  script, but the live site still reads contact info from `src/config/siteConfig.js`, not Firestore.
  Building the page without wiring the site to actually read from it would just be confusing, so I
  left it out rather than ship something half-connected.
- **SPA-level SEO only** — no server-side rendering, so search crawlers see the same initial HTML on
  every route. Not a blocker for launch, just worth knowing.

## Project structure

```
src/
  firebase/       app.js (init), db.js / auth.js / storageClient.js (split for bundle size),
                  firestoreCache.js (customer-facing live cache), adminProducts.js,
                  productImages.js, ordersService.js, settingsService.js
  context/        AdminAuthContext, ToastContext, Cart/Wishlist/RecentlyViewed (unchanged)
  components/
    admin/        AdminLayout, AdminProtectedRoute, ImageDropzone, StatusBadge, etc.
    layout/       CustomerLayout (extracted, same chrome as before) + existing Navbar/Footer/etc.
  pages/
    admin/        AdminLogin, AdminDashboard, AdminProducts, AdminProductForm, AdminOrders
    (everything else — unchanged from before)
  data/           products.json / categories.json / collections.json — now only used as the
                  one-time seed source for scripts/migrate-to-firestore.mjs, not by the live app
scripts/
  migrate-to-firestore.mjs   one-time Firestore seeding script (Part 4)
firestore.rules / storage.rules / firebase.json   security rules (Part 3)
```
