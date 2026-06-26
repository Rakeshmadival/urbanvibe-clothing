import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Price from '../common/Price.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

export default function ProductCard({ product, index = 0 }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wished = isWishlisted(product.id);
  const [imgA, imgB] = product.images;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-sand">
        <img
          src={imgA}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {imgB && (
          <img
            src={imgB}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-ink text-ivory text-[10px] tracking-widest2 uppercase px-2.5 py-1">
            Sold Out
          </span>
        )}
        {product.inStock && product.newArrival && (
          <span className="absolute top-3 left-3 bg-gold text-ink text-[10px] tracking-widest2 uppercase px-2.5 py-1">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
          style={{ opacity: wished ? 1 : undefined }}
        >
          <Heart size={15} className={wished ? 'fill-rust text-rust' : 'text-ink'} strokeWidth={1.5} />
        </button>
      </Link>
      <Link to={`/product/${product.slug}`} className="block mt-3">
        <p className="text-sm text-ink/90 truncate">{product.name}</p>
        <div className="mt-1">
          <Price price={product.price} originalPrice={product.originalPrice} />
        </div>
      </Link>
    </motion.div>
  );
}
