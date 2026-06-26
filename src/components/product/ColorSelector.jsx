export default function ColorSelector({ colors, selected, onSelect }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium mb-2">
        Color {selected && <span className="text-fog font-normal">— {selected}</span>}
      </p>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c.name}
            title={c.name}
            onClick={() => onSelect(c.name)}
            className={`w-9 h-9 rounded-full border-2 transition-all ${
              selected === c.name ? 'border-gold-deep scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }}
          />
        ))}
      </div>
    </div>
  );
}
