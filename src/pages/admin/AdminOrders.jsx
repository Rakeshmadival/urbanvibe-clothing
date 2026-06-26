import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAdminOrders } from '../../firebase/ordersService.js';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { formatPrice } from '../../utils/format.js';

export default function AdminOrders() {
  const { orders, loading } = useAdminOrders();
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <h1 className="font-serif italic text-3xl mb-8">Orders</h1>

      <div className="bg-white border border-ink/10">
        {loading ? (
          <p className="px-5 py-8 text-sm text-fog text-center">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="px-5 py-8 text-sm text-fog text-center">
            No orders yet — they'll appear here automatically as customers check out.
          </p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {orders.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm"
                >
                  <div>
                    <p className="font-medium">{o.customer?.name || 'Unknown'}</p>
                    <p className="text-fog text-xs mt-0.5">{o.customer?.phone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-fog text-xs hidden sm:inline">
                      {o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString('en-IN') : '—'}
                    </span>
                    <span className="font-medium">{formatPrice(o.subtotal || 0)}</span>
                    <StatusBadge status={o.status || 'new'} />
                    {expanded === o.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {expanded === o.id && (
                  <div className="px-5 pb-5 text-sm">
                    <p className="text-fog text-xs mb-3">{o.customer?.address}</p>
                    <ul className="space-y-2">
                      {(o.items || []).map((it, i) => (
                        <li key={i} className="flex justify-between text-ink/80">
                          <span>
                            {it.name} {[it.size, it.color].filter(Boolean).join(' / ')} × {it.qty}
                          </span>
                          <span>{formatPrice((it.price || 0) * (it.qty || 1))}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
