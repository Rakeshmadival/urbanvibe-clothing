import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout() {
  const { logout, user } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:flex-col w-60 bg-ink text-ivory flex-shrink-0">
        <div className="px-6 py-6 border-b border-ivory/10">
          <span className="font-display text-xl tracking-wide">
            <span className="text-ivory">URBAN</span>
            <span className="text-gold ml-1">VIBE</span>
          </span>
          <p className="text-[10px] tracking-widest2 uppercase text-ivory/40 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded ${
                  isActive ? 'bg-gold text-ink' : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'
                }`
              }
            >
              <item.icon size={17} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-5 border-t border-ivory/10 space-y-1">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/70 hover:text-gold-soft">
            <ExternalLink size={16} strokeWidth={1.5} />
            View Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/70 hover:text-rust">
            <LogOut size={16} strokeWidth={1.5} />
            Log Out
          </button>
          {user?.email && <p className="px-3 pt-2 text-[11px] text-ivory/30 truncate">{user.email}</p>}
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ink text-ivory flex items-center justify-between px-4 h-14">
        <span className="font-display text-lg tracking-wide">
          <span className="text-ivory">URBAN</span>
          <span className="text-gold ml-1">VIBE</span>
        </span>
        <button onClick={() => setMobileNavOpen((v) => !v)}>{mobileNavOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {mobileNavOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-ink text-ivory border-t border-ivory/10 px-3 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm rounded ${isActive ? 'bg-gold text-ink' : 'text-ivory/70'}`
              }
            >
              <item.icon size={17} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/70">
            <LogOut size={16} strokeWidth={1.5} />
            Log Out
          </button>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-5 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
