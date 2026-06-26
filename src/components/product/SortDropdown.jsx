const OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-ink/20 text-sm px-3 py-2 bg-ivory outline-none cursor-pointer"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          Sort: {o.label}
        </option>
      ))}
    </select>
  );
}

export function applySort(products, sortValue) {
  const arr = [...products];
  switch (sortValue) {
    case 'newest':
      return arr.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    case 'price-low':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-high':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}
