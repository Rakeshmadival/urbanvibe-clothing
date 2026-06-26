import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { searchProducts } from '../../utils/productService.js';
import { formatPrice } from '../../utils/format.js';

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useLocalStorage('uv_recent_searches', []);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = debouncedQuery.trim() ? searchProducts(debouncedQuery).slice(0, 6) : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
  }, [open]);

  const commitSearch = (q) => {
    if (!q.trim()) return;
    setRecent((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, 6));
    onClose();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm"
        >
          <div className="max-w-3xl mx-auto px-6 pt-24 md:pt-32">
            <div className="flex items-center justify-between mb-8">
              <form
                className="flex-1 flex items-center gap-3 border-b border-gold-line pb-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  commitSearch(query);
                }}
              >
                <SearchIcon size={20} className="text-gold" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dresses, shirts, kids wear..."
                  className="flex-1 bg-transparent text-ivory text-lg placeholder-ivory/40 outline-none font-body"
                />
              </form>
              <button onClick={onClose} aria-label="Close search" className="ml-6 text-ivory hover:text-gold-soft">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {!debouncedQuery && recent.length > 0 && (
              <div className="mb-8">
                <p className="text-gold text-xs tracking-widest2 uppercase mb-3">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => commitSearch(r)}
                      className="px-4 py-1.5 border border-ivory/20 text-ivory/70 text-sm rounded-full hover:border-gold hover:text-gold-soft transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {debouncedQuery && results.length === 0 && (
              <p className="text-ivory/60 text-sm">No products found for "{debouncedQuery}". Try a different term.</p>
            )}

            {results.length > 0 && (
              <div className="space-y-1">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={() => commitSearch(debouncedQuery)}
                    className="flex items-center gap-4 py-3 border-b border-ivory/10 hover:bg-ivory/5 px-2 transition-colors"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-14 h-16 object-cover" loading="lazy" />
                    <div className="flex-1">
                      <p className="text-ivory text-sm">{p.name}</p>
                      <p className="text-ivory/50 text-xs capitalize">{p.category}</p>
                    </div>
                    <span className="text-gold-soft text-sm">{formatPrice(p.price)}</span>
                  </Link>
                ))}
                <button
                  onClick={() => commitSearch(debouncedQuery)}
                  className="mt-4 text-xs tracking-widest2 uppercase text-gold-soft hover:text-gold border-b border-gold pb-1"
                >
                  View all results
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
