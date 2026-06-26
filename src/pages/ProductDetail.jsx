import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import Seo from '../components/common/Seo.jsx';
import Price from '../components/common/Price.jsx';
import Button from '../components/common/Button.jsx';
import ImageGallery from '../components/product/ImageGallery.jsx';
import SizeSelector from '../components/product/SizeSelector.jsx';
import ColorSelector from '../components/product/ColorSelector.jsx';
import QuantityStepper from '../components/product/QuantityStepper.jsx';
import ProductRail from '../components/product/ProductRail.jsx';
import { getProductBySlug, getRelatedProducts, getProductsByIds } from '../utils/productService.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useRecentlyViewed } from '../context/RecentlyViewedContext.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { ids: recentIds, recordView } = useRecentlyViewed();

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      recordView(product.id);
      setSize(null);
      setColor(product.colors?.[0]?.name || null);
      setQty(1);
      setAdded(false);
      window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!product) return <Navigate to="/404" replace />;

  const related = getRelatedProducts(product, 4);
  const recentlyViewed = getProductsByIds(recentIds.filter((id) => id !== product.id)).slice(0, 4);
  const wished = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (product.sizes.length && !size) {
      alert('Please select a size');
      return;
    }
    addToCart(product, { size, color, qty, image: product.images[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <Seo title={product.name} description={product.description} />

      <p className="text-xs text-fog mb-6">
        <Link to="/shop" className="hover:text-gold-deep">Shop</Link> /{' '}
        <Link to={`/shop/${product.category}`} className="hover:text-gold-deep capitalize">{product.category}</Link> /{' '}
        <span className="text-ink">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        <ImageGallery images={product.images} name={product.name} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-serif italic text-3xl md:text-4xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-ink/15'} />
              ))}
            </div>
            <span className="text-xs text-fog">({product.reviewCount} reviews)</span>
          </div>

          <Price price={product.price} originalPrice={product.originalPrice} size="lg" />

          <p className="text-sm text-ink/70 leading-relaxed mt-5 mb-6">{product.description}</p>

          <div className="space-y-6 mb-6">
            <ColorSelector colors={product.colors} selected={color} onSelect={setColor} />
            <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
            <QuantityStepper qty={qty} onChange={setQty} />
          </div>

          {!product.inStock ? (
            <div className="bg-ink/5 text-center py-3 text-sm text-fog mb-4">Currently Out of Stock</div>
          ) : (
            <div className="flex gap-3 mb-6">
              <Button variant="primary" className="flex-1" onClick={handleAddToCart}>
                {added ? 'Added ✓' : 'Add to Cart'}
              </Button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={`px-4 border flex items-center justify-center transition-colors ${
                  wished ? 'border-rust text-rust' : 'border-ink/20 text-ink hover:border-ink'
                }`}
              >
                <Heart size={18} className={wished ? 'fill-rust' : ''} strokeWidth={1.5} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 text-center border-t border-ink/10 pt-5">
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={18} className="text-gold-deep" strokeWidth={1.5} />
              <span className="text-[11px] text-fog leading-tight">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw size={18} className="text-gold-deep" strokeWidth={1.5} />
              <span className="text-[11px] text-fog leading-tight">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={18} className="text-gold-deep" strokeWidth={1.5} />
              <span className="text-[11px] text-fog leading-tight">COD Available</span>
            </div>
          </div>

          <div className="mt-8 border-t border-ink/10">
            <div className="flex gap-6">
              {['description', 'fabric & care', 'delivery'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-3 text-xs tracking-widest2 uppercase border-b-2 transition-colors ${
                    tab === t ? 'border-gold text-ink' : 'border-transparent text-fog'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-5 text-sm text-ink/75 leading-relaxed">
              {tab === 'description' && <p>{product.description}</p>}
              {tab === 'fabric & care' && (
                <p>{product.fabric}. Hand wash or gentle machine wash cold. Do not bleach. Iron on low heat if needed.</p>
              )}
              {tab === 'delivery' && (
                <p>
                  Delivered in 3–6 business days across India. Cash on Delivery available. Order directly via
                  WhatsApp — no account needed.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ProductRail title="You May Also Like" products={related} />
      <ProductRail title="Recently Viewed" products={recentlyViewed} />
    </div>
  );
}
