import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  CreditCard,
  Bell,
  LogOut,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSocketStore } from '../../store/useSocketStore';
import { cn } from '../../lib/utils';

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/halls', label: 'Halls', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
];

const userLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/bookings', label: 'My bookings', icon: CalendarDays },
  { to: '/dashboard/profile', label: 'Profile', icon: Users },
];

function DashboardLayout({ variant = 'user', notifications = [] }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const disconnectSocket = useSocketStore((s) => s.disconnectSocket);
  const navigate = useNavigate();
  const links = variant === 'admin' ? adminLinks : userLinks;

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/90 p-5">
      <motion.div layout className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Elite Event Hub</p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          {variant === 'admin' ? 'Admin Console' : 'My Dashboard'}
        </h2>
        <p className="mt-1 truncate text-sm text-slate-400">{user?.email}</p>
      </motion.div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );

  return (
    <motion.div layout className="min-h-[calc(100vh-80px)] bg-slate-950">
      <div className="mx-auto flex max-w-[1600px]">
        <div className="hidden w-64 shrink-0 lg:block">{sidebar}</div>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/80"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute left-0 top-0 h-full w-72">{sidebar}</div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:px-8">
            <button
              type="button"
              className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center justify-end gap-3">
              <motion.div layout className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                    {notifications.length}
                  </span>
                )}
              </motion.div>
              <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 sm:inline">
                Live sync on
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardLayout;
