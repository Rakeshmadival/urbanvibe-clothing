const PRICE_BANDS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: Infinity },
];

export default function FiltersSidebar({ products, filters, setFilters }) {
  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(
    new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()
  );

  const toggle = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () =>
    setFilters({ sizes: [], colors: [], priceBands: [], inStockOnly: false, onSaleOnly: false });

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs tracking-widest2 uppercase text-ink">Filters</p>
        <button onClick={clearAll} className="text-xs text-fog hover:text-gold-deep underline">
          Clear all
        </button>
      </div>

      <div className="mb-7">
        <p className="text-sm font-medium mb-3">Price</p>
        <div className="space-y-2">
          {PRICE_BANDS.map((band) => (
            <label key={band.label} className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.priceBands.includes(band.label)}
                onChange={() => toggle('priceBands', band.label)}
                className="accent-gold-deep"
              />
              {band.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <p className="text-sm font-medium mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggle('sizes', size)}
              className={`px-3 py-1 text-xs border transition-colors ${
                filters.sizes.includes(size)
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-ink/20 text-ink/70 hover:border-ink'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <p className="text-sm font-medium mb-3">Color</p>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c.name}
              onClick={() => toggle('colors', c.name)}
              title={c.name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                filters.colors.includes(c.name) ? 'border-gold-deep scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => setFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
            className="accent-gold-deep"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={() => setFilters((p) => ({ ...p, onSaleOnly: !p.onSaleOnly }))}
            className="accent-gold-deep"
          />
          On sale only
        </label>
      </div>
    </aside>
  );
}

export { PRICE_BANDS };
