import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/venues', label: 'Venues' },
  { to: '/booking', label: 'Booking' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function NavBar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 text-slate-100 md:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
          <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm uppercase tracking-[0.25em] text-slate-950 shadow-glass">
            Elite
          </span>
          Event Hub
        </Link>

        <nav className={`hidden items-center gap-6 md:flex`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-emerald-300 ${isActive ? 'text-emerald-300' : 'text-slate-300'} `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300 focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Sign In
          </Link>

          <button className="md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 px-6 pb-5">
          <div className="flex flex-col gap-3 pt-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 transition ${isActive ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/5'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
