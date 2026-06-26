import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import IconButton from '../common/IconButton.jsx';
import MegaMenu from './MegaMenu.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';
import SearchOverlay from '../search/SearchOverlay.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { getAllCategories } from '../../utils/productService.js';

export default function Navbar() {
  const categories = getAllCategories();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { ids: wishlistIds } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-ink/95 backdrop-blur-md shadow-lg' : 'bg-ink'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <button className="md:hidden text-ivory" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <Logo className="md:flex-none" />

          <ul className="hidden md:flex items-center gap-8 ml-10">
            {categories.map((c) => (
              <li key={c.id} onMouseEnter={() => setActiveMenu(c.id)} className="relative py-2">
                <NavLink
                  to={`/shop/${c.slug}`}
                  className={({ isActive }) =>
                    `text-sm tracking-widest2 uppercase transition-colors ${
                      isActive ? 'text-gold-soft' : 'text-ivory hover:text-gold-soft'
                    }`
                  }
                >
                  {c.name}
                </NavLink>
              </li>
            ))}
            <li className="py-2">
              <NavLink
                to="/collections"
                className={({ isActive }) =>
                  `text-sm tracking-widest2 uppercase transition-colors ${
                    isActive ? 'text-gold-soft' : 'text-ivory hover:text-gold-soft'
                  }`
                }
              >
                Collections
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <IconButton icon={Search} label="Search" onClick={() => setSearchOpen(true)} />
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2 text-ivory hover:text-gold-soft transition-colors duration-200">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                </span>
              )}
            </Link>
            <IconButton icon={ShoppingBag} label="Cart" badge={count} onClick={() => setCartOpen(true)} />
          </div>
        </nav>

        {categories.map((c) => (
          <MegaMenu key={c.id} category={c} open={activeMenu === c.id} />
        ))}
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
