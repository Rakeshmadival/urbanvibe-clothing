import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllCategories } from '../../utils/productService.js';
import SectionHeading from '../common/SectionHeading.jsx';

export default function CategoryDoors() {
  const categories = getAllCategories();
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <SectionHeading eyebrow="Shop by Category" title="Find Your Vibe" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link to={`/shop/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="font-serif italic text-2xl text-ivory mb-1">{c.name}</p>
                <p className="text-ivory/70 text-sm mb-3">{c.description}</p>
                <span className="text-xs tracking-widest2 uppercase text-gold-soft border-b border-gold pb-1">
                  Shop Now
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
