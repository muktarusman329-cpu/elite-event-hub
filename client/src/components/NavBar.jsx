import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { mainNavItems } from '../config/navigation';
import NavLinkItem from './nav/NavLinkItem';
import NavDropdown from './nav/NavDropdown';
import UserMenuDropdown from './nav/UserMenuDropdown';
import MobileNavDrawer from './nav/MobileNavDrawer';

function NavBar({ minimal = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          boxShadow: scrolled ? '0 4px 24px rgba(15, 23, 42, 0.08)' : '0 0 0 rgba(0,0,0,0)',
        }}
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? 'border-slate-200/80 bg-white/95' : 'border-transparent bg-white'
        } backdrop-blur-md`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:h-[72px] lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-md shadow-blue-600/25">
              EE
            </span>
            {!minimal && (
              <span className="hidden flex-col sm:flex">
                <span className="text-base font-semibold tracking-tight text-slate-900">Elite Event Hub</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Premium venues
                </span>
              </span>
            )}
          </Link>

          {!minimal && (
            <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
              {mainNavItems.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} label={item.label} items={item.children} />
                ) : (
                  <NavLinkItem key={item.to} to={item.to} label={item.label} end={item.end} />
                )
              )}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <UserMenuDropdown />
            ) : (
              !minimal && (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600 sm:inline-flex"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-lg sm:inline-flex"
                  >
                    Create account
                  </Link>
                </>
              )
            )}

            {!minimal && (
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
</div>
</div>
      </motion.header>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} onLogout={logout} />
    </>
  );
}

export default NavBar;
