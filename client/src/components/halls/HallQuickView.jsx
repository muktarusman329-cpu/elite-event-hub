import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statusStyles } from '../../lib/normalizeHall';

function HallQuickView({ hall, open, onClose }) {
  if (!hall) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${hall.image})` }}
            />
            <div className="relative p-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(hall.status)}`}
              >
                {hall.status}
              </span>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{hall.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {hall.location}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  {hall.capacity} guests
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {hall.rating?.toFixed(1)}
                </span>
                <span className="font-semibold text-blue-600">
                  ${hall.price?.toLocaleString()} <span className="font-normal text-slate-500">/ event</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{hall.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(hall.features || []).slice(0, 5).map((f) => (
                  <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {f}
                  </span>
                ))}
              </div>
              <Link
                to="/booking"
                onClick={onClose}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Book this hall
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default HallQuickView;
