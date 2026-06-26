import { formatPrice, discountPercent } from '../../utils/format.js';

export default function Price({ price, originalPrice, size = 'md' }) {
  const discount = discountPercent(price, originalPrice);
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base';
  const subSize = size === 'lg' ? 'text-base' : 'text-sm';
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-semibold ${textSize}`}>{formatPrice(price)}</span>
      {discount > 0 && (
        <>
          <span className={`line-through text-fog ${subSize}`}>{formatPrice(originalPrice)}</span>
          <span className="text-rust text-xs font-medium">{discount}% OFF</span>
        </>
      )}
    </div>
  );
}
