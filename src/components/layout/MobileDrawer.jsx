import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllCategories, getAllCollections } from '../../utils/productService.js';

export default function MobileDrawer({ open, onClose }) {
  const categories = getAllCategories();
  const collections = getAllCollections();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            className="fixed left-0 top-0 h-full w-[82%] max-w-sm bg-ink z-[80] flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ivory/10">
              <span className="font-display text-xl text-ivory tracking-wide">MENU</span>
              <button onClick={onClose} aria-label="Close menu" className="text-ivory">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-gold text-xs tracking-widest2 uppercase mb-3">Shop by Category</p>
              <ul className="mb-8">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/shop/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 border-b border-ivory/10 text-ivory text-base"
                    >
                      {c.name}
                      <ChevronRight size={16} className="text-gold" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="flex items-center justify-between py-3 border-b border-ivory/10 text-ivory text-base"
                  >
                    Shop All
                    <ChevronRight size={16} className="text-gold" />
                  </Link>
                </li>
              </ul>

              <p className="text-gold text-xs tracking-widest2 uppercase mb-3">Collections</p>
              <ul className="mb-8">
                {collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/collections/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 border-b border-ivory/10 text-ivory text-base"
                    >
                      {c.name}
                      <ChevronRight size={16} className="text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3 text-ivory/70 text-sm">
                <li>
                  <Link to="/wishlist" onClick={onClose}>
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={onClose}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={onClose}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" onClick={onClose}>
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
