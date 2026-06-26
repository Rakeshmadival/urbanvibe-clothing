import ProductCard from './ProductCard.jsx';

export default function ProductRail({ title, products }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="py-12">
      {title && <h3 className="font-serif italic text-2xl mb-6">{title}</h3>}
      <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
        {products.map((p, i) => (
          <div key={p.id} className="min-w-[170px] sm:min-w-[220px] snap-start">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
