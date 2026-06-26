import { Link } from 'react-router-dom';
import { Package, CheckCircle2, FileEdit, AlertTriangle, ShoppingBag, Plus } from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { useAdminProducts } from '../../firebase/adminProducts.js';
import { useAdminOrders } from '../../firebase/ordersService.js';
import { formatPrice } from '../../utils/format.js';

export default function AdminDashboard() {
  const { products, loading: productsLoading } = useAdminProducts();
  const { orders, loading: ordersLoading } = useAdminOrders();

  const published = products.filter((p) => p.status === 'published').length;
  const drafts = products.filter((p) => p.status === 'draft').length;
  const outOfStock = products.filter((p) => p.status === 'out-of-stock').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif italic text-3xl">Dashboard</h1>
          <p className="text-fog text-sm mt-1">A quick look at your store right now.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-ink text-ivory px-4 py-2.5 text-sm tracking-wide hover:bg-charcoal"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard icon={Package} label="Total Products" value={productsLoading ? '—' : products.length} accent />
        <StatCard icon={CheckCircle2} label="Published" value={productsLoading ? '—' : published} />
        <StatCard icon={FileEdit} label="Drafts" value={productsLoading ? '—' : drafts} />
        <StatCard icon={AlertTriangle} label="Out of Stock" value={productsLoading ? '—' : outOfStock} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={ordersLoading ? '—' : orders.length} />
      </div>

      <div className="bg-white border border-ink/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="text-sm font-medium">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-gold-deep hover:underline">
            View all
          </Link>
        </div>
        {ordersLoading ? (
          <p className="px-5 py-6 text-sm text-fog">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="px-5 py-6 text-sm text-fog">No orders yet — they'll show up here as customers check out.</p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div>
                  <p className="font-medium">{o.customer?.name || 'Unknown'}</p>
                  <p className="text-fog text-xs">{o.items?.length || 0} item(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatPrice(o.subtotal || 0)}</span>
                  <StatusBadge status={o.status || 'new'} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
