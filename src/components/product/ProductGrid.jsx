import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, columns = 4 }) {
  const colClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-fog">
        <p>No products match your filters right now.</p>
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-2 ${colClass} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
