import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ qty, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Quantity</p>
      <div className="flex items-center border border-ink/20 w-fit">
        <button onClick={() => onChange(Math.max(1, qty - 1))} className="p-3 hover:bg-ink/5" aria-label="Decrease quantity">
          <Minus size={14} />
        </button>
        <span className="px-5 text-sm">{qty}</span>
        <button onClick={() => onChange(qty + 1)} className="p-3 hover:bg-ink/5" aria-label="Increase quantity">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
