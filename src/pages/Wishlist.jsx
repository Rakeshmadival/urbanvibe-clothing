import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/common/Button.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getProductsByIds } from '../utils/productService.js';

export default function Wishlist() {
  const { ids } = useWishlist();
  const products = getProductsByIds(ids);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[50vh]">
      <Seo title="Wishlist" description="Your saved favorites at UrbanVibe Clothing." />
      <h1 className="font-serif italic text-3xl md:text-4xl mb-8">Your Wishlist</h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-fog mb-5">Nothing saved yet — tap the heart on any product to add it here.</p>
          <Button as={Link} to="/shop" variant="primary">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
