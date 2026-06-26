import { useState } from 'react';

const SIZE_GUIDE_ROWS = [
  { size: 'XS', chest: '32-33"', waist: '24-25"' },
  { size: 'S', chest: '34-35"', waist: '26-27"' },
  { size: 'M', chest: '36-37"', waist: '28-29"' },
  { size: 'L', chest: '38-40"', waist: '30-32"' },
  { size: 'XL', chest: '41-43"', waist: '33-35"' },
  { size: 'XXL', chest: '44-46"', waist: '36-38"' },
];

export default function SizeSelector({ sizes, selected, onSelect }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const isClothingSize = sizes.some((s) => SIZE_GUIDE_ROWS.some((r) => r.size === s));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Size</p>
        {isClothingSize && (
          <button onClick={() => setGuideOpen((v) => !v)} className="text-xs underline text-fog hover:text-gold-deep">
            Size Guide
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`min-w-[44px] px-3 py-2 text-sm border transition-colors ${
              selected === s ? 'border-ink bg-ink text-ivory' : 'border-ink/20 hover:border-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {guideOpen && (
        <table className="w-full text-xs mt-3 border-t border-ink/10 pt-2">
          <thead>
            <tr className="text-left text-fog">
              <th className="py-1">Size</th>
              <th className="py-1">Chest</th>
              <th className="py-1">Waist</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((r) => (
              <tr key={r.size} className="border-t border-ink/5">
                <td className="py-1.5">{r.size}</td>
                <td className="py-1.5">{r.chest}</td>
                <td className="py-1.5">{r.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
