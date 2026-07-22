import { Link } from 'react-router-dom';
import { Menu, Moon, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

import { mainnavItems } from '../config/navigation';

import NavLinkItem from './nav/NavLinkItem';
import NavDropdown from './nav/NavDropdown';
import UserMenuDropdown from './nav/UserMenuDropdown';
import MobileNavDrawer from './nav/MobileNavDrawer';

function NavBar({ minimal = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm transition $
${
  scrolled
    ? 'bg-slate-950/95 border-emerald-500/20'
    : 'bg-slate-950/85 border-white/10'
}`}
      >
       <div className="flex h-14 items-center gap-8 px-6 lg:h-[70px] lg:px-9">
          
         <Link
  to="/"
  className="flex shrink-0 items-center gap-3"
>
  <img
    src="https://res.cloudinary.com/dpintbnfc/image/upload/v1780594895/Untitled_design_1_hyvgxn.png"
  alt="Logo" width={40} height={40} className="h-8 w-8 rounded-full" /> 

  {!minimal && (
    <span className="hidden flex-col sm:flex">
      <span className="text-sm font-bold tracking-tight text-slate-100">
        Elite Event Hub
      </span>

      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Premium venues
      </span>
    </span>
  )}


</Link>

          {!minimal && (
            <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
              {mainnavItems.map((item) =>
                item.children ? (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    items={item.children}
                  />
                ) : (
                  <NavLinkItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    end={item.end}
                  />
                )
              )}
            </nav>
          )}
             <div className="flex items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunMedium className="h-4.5 w-4.5 text-emerald-400" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-cyan-400" />
              )}
            </button>

            {user ? (
              <UserMenuDropdown />
            ) : (
              !minimal && (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-emerald-400 sm:inline-flex"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:shadow-lg hover:scale-105 sm:inline-flex"
                  >
                    Create account
                  </Link>
                </>
              )
            )}

            {!minimal && (
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-emerald-500/40 hover:bg-slate-800 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={logout}
      />
    </>
  );
}

export default NavBar;