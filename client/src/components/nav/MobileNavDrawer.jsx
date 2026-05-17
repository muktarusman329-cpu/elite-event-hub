import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NavLinkItem from './NavLinkItem';
import { mainNavItems } from '../../config/navigation';

function MobileNavDrawer({ open, onClose, user, onLogout }) {
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[90] flex h-full w-[min(100vw,320px)] flex-col bg-white shadow-2xl lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <span className="text-lg font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
              {mainNavItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <p className="px-1 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <NavLinkItem
                        key={child.to}
                        to={child.to}
                        label={child.label}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                ) : (
                  <NavLinkItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    end={item.end}
                    onClick={onClose}
                  />
                )
              )}
            </nav>

            <div className="border-t border-slate-100 p-6 space-y-3">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={onClose}
                    className="block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-md"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="block w-full rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full rounded-full border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-md"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNavDrawer;
