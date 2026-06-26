import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react';
import ImageDropzone from '../../components/admin/ImageDropzone.jsx';
import { useAdminProducts, generateProductId, saveProduct } from '../../firebase/adminProducts.js';
import { uploadProductImage, deleteImageByUrl } from '../../firebase/productImages.js';
import { getAllCategories, getAllCollections } from '../../utils/productService.js';
import { subscribeToCacheChanges } from '../../firebase/firestoreCache.js';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  name: '',
  slug: '',
  category: 'women',
  collections: [],
  price: '',
  originalPrice: '',
  description: '',
  fabric: '',
  sizes: '',
  status: 'draft',
  newArrival: false,
  bestSeller: false,
};

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { products, loading: productsLoading } = useAdminProducts();
  const [, forceRerender] = useState(0);
  useEffect(() => subscribeToCacheChanges(() => forceRerender((n) => n + 1)), []);
  const categories = getAllCategories();
  const collectionsList = getAllCollections();

  const existing = useMemo(() => (isEdit ? products.find((p) => p.id === id) : null), [products, id, isEdit]);

  const [form, setForm] = useState(emptyForm);
  const [colors, setColors] = useState([{ name: '', hex: '#c8a96e' }]);
  const [images, setImages] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState(isEdit ? id : null);
  const [hydrated, setHydrated] = useState(!isEdit);

  // New product: reserve a Firestore ID immediately so images can upload
  // to the right Storage path before the product is actually published.
  useEffect(() => {
    if (!isEdit && !productId) {
      setProductId(generateProductId());
    }
  }, [isEdit, productId]);

  // Edit product: hydrate the form once the live product data arrives.
  useEffect(() => {
    if (isEdit && existing && !hydrated) {
      setForm({
        name: existing.name || '',
        slug: existing.slug || '',
        category: existing.category || 'women',
        collections: existing.collections || [],
        price: existing.price ?? '',
        originalPrice: existing.originalPrice ?? '',
        description: existing.description || '',
        fabric: existing.fabric || '',
        sizes: (existing.sizes || []).join(', '),
        status: existing.status || 'draft',
        newArrival: Boolean(existing.newArrival),
        bestSeller: Boolean(existing.bestSeller),
      });
      setColors(existing.colors?.length ? existing.colors : [{ name: '', hex: '#c8a96e' }]);
      setImages((existing.images || []).map((url) => ({ id: url, url })));
      setSlugTouched(true);
      setHydrated(true);
    }
  }, [isEdit, existing, hydrated]);

  if (isEdit && productsLoading && !hydrated) {
    return <p className="text-sm text-fog">Loading product…</p>;
  }
  if (isEdit && !productsLoading && !existing) {
    return (
      <div>
        <p className="text-sm text-fog mb-4">Product not found.</p>
        <Link to="/admin/products" className="text-sm text-gold-deep hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNameChange = (value) => {
    updateField('name', value);
    if (!slugTouched) updateField('slug', slugify(value));
  };

  const toggleCollection = (collectionId) => {
    setForm((prev) => ({
      ...prev,
      collections: prev.collections.includes(collectionId)
        ? prev.collections.filter((c) => c !== collectionId)
        : [...prev.collections, collectionId],
    }));
  };

  const handleAddFiles = (files) => {
    const newItems = files.map((file) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      file,
      uploading: false,
      progress: 0,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const handleRemoveImage = async (imgId) => {
    const img = images.find((i) => i.id === imgId);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
    if (img && !img.file) {
      // Already-uploaded image — clean it up from Storage too.
      await deleteImageByUrl(img.url);
    }
  };

  const addColorRow = () => setColors((prev) => [...prev, { name: '', hex: '#c8a96e' }]);
  const removeColorRow = (idx) => setColors((prev) => prev.filter((_, i) => i !== idx));
  const updateColorRow = (idx, field, value) =>
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      showToast('Name and price are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      // Upload any pending local files first.
      const uploadedImages = [...images];
      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];
        if (img.file) {
          setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, uploading: true } : p)));
          const url = await uploadProductImage(productId, img.file, (pct) => {
            setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, progress: pct } : p)));
          });
          uploadedImages[i] = { id: url, url };
          setImages((prev) => prev.map((p) => (p.id === img.id ? { id: url, url } : p)));
        }
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        category: form.category,
        collections: form.collections,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || 0,
        description: form.description.trim(),
        fabric: form.fabric.trim(),
        sizes: form.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        colors: colors.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), hex: c.hex })),
        images: uploadedImages.map((i) => i.url),
        status: form.status,
        newArrival: form.newArrival,
        bestSeller: form.bestSeller,
        rating: existing?.rating ?? 4.5,
        reviewCount: existing?.reviewCount ?? 0,
      };

      await saveProduct(productId, payload, { isNew: !isEdit });
      showToast(isEdit ? 'Product updated.' : 'Product saved.', 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(`Couldn't save product: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-fog hover:text-ink mb-5">
        <ArrowLeft size={15} /> Back to Products
      </Link>
      <h1 className="font-serif italic text-3xl mb-8">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Basic Details</h2>
          <div>
            <label className="text-sm font-medium block mb-1.5">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">URL Slug</label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField('slug', e.target.value);
              }}
              className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-ink/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-ink"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full border border-ink/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-ink"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Fabric &amp; Care</label>
            <input
              value={form.fabric}
              onChange={(e) => updateField('fabric', e.target.value)}
              placeholder="e.g. 100% Cotton"
              className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
        </section>

        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                required
                min="0"
                className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => updateField('originalPrice', e.target.value)}
                min="0"
                className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Variants</h2>
          <div>
            <label className="text-sm font-medium block mb-1.5">Sizes (comma separated)</label>
            <input
              value={form.sizes}
              onChange={(e) => updateField('sizes', e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Colors</label>
            <div className="space-y-2">
              {colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColorRow(idx, 'hex', e.target.value)}
                    className="w-9 h-9 border border-ink/20 cursor-pointer flex-shrink-0"
                  />
                  <input
                    value={c.name}
                    onChange={(e) => updateColorRow(idx, 'name', e.target.value)}
                    placeholder="Color name e.g. Olive"
                    className="flex-1 border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                  {colors.length > 1 && (
                    <button type="button" onClick={() => removeColorRow(idx)} className="text-fog hover:text-rust">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColorRow}
              className="mt-2 flex items-center gap-1.5 text-xs text-gold-deep hover:text-gold"
            >
              <Plus size={13} /> Add Color
            </button>
          </div>
        </section>

        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Collections</h2>
          <div className="flex flex-wrap gap-2">
            {collectionsList.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCollection(c.id)}
                className={`px-3 py-1.5 text-xs border transition-colors ${
                  form.collections.includes(c.id)
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/20 text-ink/70 hover:border-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Product Photos</h2>
          <ImageDropzone images={images} onAddFiles={handleAddFiles} onRemove={handleRemoveImage} />
        </section>

        <section className="bg-white border border-ink/10 p-6 space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-gold-deep">Visibility</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">New Arrival <span className="text-fog">— shows in homepage New Arrivals rail</span></span>
            <input
              type="checkbox"
              checked={form.newArrival}
              onChange={(e) => updateField('newArrival', e.target.checked)}
              className="w-5 h-5 accent-gold-deep"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Featured <span className="text-fog">— shows in homepage Best Sellers rail</span></span>
            <input
              type="checkbox"
              checked={form.bestSeller}
              onChange={(e) => updateField('bestSeller', e.target.checked)}
              className="w-5 h-5 accent-gold-deep"
            />
          </label>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-ink text-ivory px-6 py-3 text-sm tracking-widest2 uppercase hover:bg-charcoal disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Product'}
          </button>
          <Link to="/admin/products" className="px-6 py-3 text-sm border border-ink/20 hover:bg-ink/5">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
