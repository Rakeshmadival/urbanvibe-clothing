import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllCollections } from '../../utils/productService.js';

export default function CollectionBanner() {
  const collections = getAllCollections();
  return (
    <section className="py-16 md:py-24 bg-graphite">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif italic text-3xl md:text-5xl text-ivory">Curated Collections</h2>
          <Link to="/collections" className="text-xs tracking-widest2 uppercase text-gold-soft border-b border-gold pb-1 hidden sm:inline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {collections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden">
                <img
                  src={c.banner}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/35 transition-colors duration-300 flex flex-col items-center justify-center text-center px-4">
                  <p className="font-serif italic text-2xl text-ivory mb-1">{c.name}</p>
                  <p className="text-ivory/70 text-sm">{c.tagline}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
