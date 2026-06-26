import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAdminProducts, deleteProduct } from '../../firebase/adminProducts.js';
import { deleteImageByUrl } from '../../firebase/productImages.js';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatPrice } from '../../utils/format.js';

export default function AdminProducts() {
  const { products, loading } = useAdminProducts();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = !query || p.name?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await Promise.all((pendingDelete.images || []).map((url) => deleteImageByUrl(url)));
      await deleteProduct(pendingDelete.id);
      showToast(`${pendingDelete.name} deleted.`, 'success');
    } catch (err) {
      showToast(`Couldn't delete product: ${err.message}`, 'error');
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif italic text-3xl">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-ink text-ivory px-4 py-2.5 text-sm tracking-wide hover:bg-charcoal"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 border border-ink/20 px-3 py-2 bg-white flex-1 min-w-[200px]">
          <Search size={15} className="text-fog" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-ink/20 px-3 py-2 text-sm bg-white outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white border border-ink/10 overflow-x-auto">
        {loading ? (
          <p className="px-5 py-8 text-sm text-fog text-center">Loading products…</p>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-8 text-sm text-fog text-center">
            {products.length === 0 ? 'No products yet — add your first one.' : 'No products match your search.'}
          </p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-fog border-b border-ink/10">
                <th className="px-5 py-3 font-normal">Product</th>
                <th className="px-5 py-3 font-normal">Category</th>
                <th className="px-5 py-3 font-normal">Price</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || '/images/products/placeholder.svg'}
                        alt=""
                        className="w-10 h-12 object-cover bg-sand flex-shrink-0"
                      />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-ink/70">{p.category}</td>
                  <td className="px-5 py-3">{formatPrice(p.price || 0)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status || 'draft'} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/admin/products/${p.id}/edit`} className="text-gold-deep hover:text-gold" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => setPendingDelete(p)} className="text-fog hover:text-rust" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this product?"
        message={`"${pendingDelete?.name}" will be permanently removed from your store and Firestore. This can't be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
