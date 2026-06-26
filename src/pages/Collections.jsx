import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import { getAllCollections } from '../utils/productService.js';

export default function Collections() {
  const collections = getAllCollections();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <Seo title="Collections" description="Browse UrbanVibe's curated seasonal collections." />
      <h1 className="font-serif italic text-4xl md:text-5xl mb-10 text-center">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((c) => (
          <Link key={c.id} to={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden">
            <img src={c.banner} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-ink/25 group-hover:bg-ink/40 transition-colors flex flex-col items-center justify-center text-center px-4">
              <p className="font-serif italic text-2xl text-ivory mb-1">{c.name}</p>
              <p className="text-ivory/70 text-sm">{c.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
