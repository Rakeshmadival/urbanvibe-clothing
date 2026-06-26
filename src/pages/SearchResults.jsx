import { useSearchParams } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { searchProducts } from '../utils/productService.js';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const results = searchProducts(q);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <Seo title={`Search: ${q}`} />
      <h1 className="font-serif italic text-3xl md:text-4xl mb-2">Search Results</h1>
      <p className="text-fog text-sm mb-8">
        {results.length} results for "{q}"
      </p>
      <ProductGrid products={results} />
    </div>
  );
}
