import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../../utils/productService.js';

export default function MegaMenu({ category, open }) {
  const collections = getAllCollections();
  if (!category) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-full w-full bg-ink border-t border-gold-line shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-gold text-xs tracking-widest2 uppercase mb-4">Shop {category.name}</p>
              <ul className="space-y-3 text-ivory/80 text-sm">
                <li>
                  <Link to={`/shop/${category.slug}`} className="hover:text-gold-soft transition-colors">
                    All {category.name}
                  </Link>
                </li>
                <li>
                  <Link to={`/shop/${category.slug}?sort=newest`} className="hover:text-gold-soft transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to={`/shop/${category.slug}?best=true`} className="hover:text-gold-soft transition-colors">
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-gold text-xs tracking-widest2 uppercase mb-4">Collections</p>
              <ul className="space-y-3 text-ivory/80 text-sm">
                {collections.map((c) => (
                  <li key={c.id}>
                    <Link to={`/collections/${c.slug}`} className="hover:text-gold-soft transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block md:col-span-2">
              <Link to={`/shop/${category.slug}`} className="relative block aspect-[16/7] overflow-hidden group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-ink/30 flex items-end p-5">
                  <span className="text-ivory text-sm tracking-widest2 uppercase border-b border-gold pb-1">
                    Explore {category.name}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
