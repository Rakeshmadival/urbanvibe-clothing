import { useParams, Navigate } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { getCollectionBySlug, getProductsByCollection } from '../utils/productService.js';

export default function CollectionDetail() {
  const { collectionSlug } = useParams();
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return <Navigate to="/404" replace />;

  const products = getProductsByCollection(collectionSlug);

  return (
    <div>
      <Seo title={collection.name} description={collection.tagline} />
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img src={collection.banner} alt={collection.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif italic text-4xl md:text-5xl text-ivory mb-2">{collection.name}</h1>
          <p className="text-ivory/80 text-sm">{collection.tagline}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <p className="text-fog text-sm mb-6">{products.length} products</p>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
