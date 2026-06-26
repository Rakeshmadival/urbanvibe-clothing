import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import FiltersSidebar, { PRICE_BANDS } from '../components/product/FiltersSidebar.jsx';
import SortDropdown, { applySort } from '../components/product/SortDropdown.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { getAllProducts, getProductsByCategory, getCategoryBySlug } from '../utils/productService.js';

const emptyFilters = { sizes: [], colors: [], priceBands: [], inStockOnly: false, onSaleOnly: false };

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState(searchParams.get('sort') === 'newest' ? 'newest' : 'popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const baseProducts = categorySlug ? getProductsByCategory(categorySlug) : getAllProducts();
  const bestOnly = searchParams.get('best') === 'true';

  const filtered = useMemo(() => {
    let list = baseProducts;
    if (bestOnly) list = list.filter((p) => p.bestSeller);
    if (filters.sizes.length) list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length)
      list = list.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
    if (filters.priceBands.length) {
      list = list.filter((p) =>
        filters.priceBands.some((label) => {
          const band = PRICE_BANDS.find((b) => b.label === label);
          return band && p.price >= band.min && p.price < band.max;
        })
      );
    }
    if (filters.inStockOnly) list = list.filter((p) => p.inStock);
    if (filters.onSaleOnly) list = list.filter((p) => p.originalPrice > p.price);
    return applySort(list, sort);
  }, [baseProducts, filters, sort, bestOnly]);

  const title = category ? category.name : 'Shop All';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <Seo title={title} description={`Shop ${title} at UrbanVibe Clothing — premium everyday fashion.`} />

      <div className="mb-8">
        <h1 className="font-serif italic text-3xl md:text-5xl mb-2">{title}</h1>
        <p className="text-fog text-sm">{filtered.length} products</p>
      </div>

      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="text-xs tracking-widest2 uppercase border border-ink px-4 py-2"
        >
          {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
          <FiltersSidebar products={baseProducts} filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-1">
          <div className="hidden md:flex justify-end mb-6">
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
