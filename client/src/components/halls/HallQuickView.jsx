import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock3, MapPin, ShieldCheck, Star, Users, X, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statusStyles } from '../../lib/normalizeHall';
import Button from '../ui/Button';

function HallQuickView({ hall, open, onClose }) {
  const [activeImage, setActiveImage] = useState(0);

  // Reset active image index whenever modal is opened with a new hall
  useEffect(() => {
    if (open) setActiveImage(0);
  }, [open, hall]);

  if (!hall) return null;

  const fallbackImage =
    'https://res-console.cloudinary.com/dpintbnfc/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/cGV4ZWxzLWJlcnRlbGxpZm90b2dyYWZpYS0xNjEyMDI0M19zYXJsano=/template_primary';

  // Secondary high-end venue setup images to create a mock venue image gallery
  const galleryImages = [
    hall.image || fallbackImage,
    'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585830/pexels-bertellifotografia-16120263_nvezew.jpg', // elegant interior table setup
    'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585820/pexels-introspectivedsgn-4061506_ydbita.jpg', // closeup of luxurious table decor
    'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585839/pexels-vidalbalielojrfotografia-14646749_yvowhe.jpg', // wide angle of a grand ballroom with chandeliers
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* MODAL */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-[70] w-[min(94vw,580px)] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2.5rem] border border-white/10 bg-[#070b19]/90 backdrop-blur-2xl p-0 shadow-2xl text-left scrollbar-hide"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* IMAGE GALLEY SECTION */}
            <div className="relative h-64 overflow-hidden bg-slate-900 select-none">
              <img
                src={galleryImages[activeImage]}
                alt={hall.name}
                className="h-full w-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-black/20" />

              {/* CLOSE */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-slate-950/60 border border-white/15 p-2 text-slate-300 shadow-md transition hover:bg-slate-900 hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* STATUS */}
              <span
                className={`absolute left-4 top-4 inline-flex rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-white/10 ${statusStyles(
                  hall.status
                )}`}
              >
                {hall.status}
              </span>
            </div>

            {/* GALLERY THUMBNAILS */}
            <div className="flex gap-2 px-6 -mt-8 relative z-10">
              {galleryImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-emerald-400 scale-105' : 'border-white/10 hover:border-slate-400'
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" onError={(e) => e.target.src = fallbackImage} />
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className="p-6 pt-5 space-y-5">
              {/* TITLE */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    {hall.name}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    {hall.location}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-xs font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {Number(hall.rating || 4.5).toFixed(1)}
                </div>
              </div>

              {/* STAT SPECS */}
              <div className="grid gap-3 grid-cols-3">
                <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-emerald-400">
                    <Users className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Capacity
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-white">
                    {Number(hall.capacity || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Max Guests
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-cyan-400">
                    <Clock3 className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Hourly
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-white">
                    ₦{Number(hall.hourlyRate || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Per Hour
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-teal-400">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Base Rate
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-white">
                    ₦{Number(hall.price || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Standard
                  </p>
                </div>
              </div>

              {/* SMART DYNAMIC PRICING */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      Dynamic Reservation Logic
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Pricing is recalculated in real-time based on duration, guests capacity tiers, and requested services like catering, decoration, DJ setup, and photography.
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs leading-relaxed text-slate-400">
                {hall.description}
              </p>

              {/* FEATURES */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(hall.features || []).map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-slate-900/80 border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* RESERVATION ACTION BUTTON */}
              <div className="pt-3">
                <Link to={`/booking?hall=${hall.id}`} onClick={onClose}>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold hover:shadow-glow-emerald px-6 py-3.5 rounded-xl transition hover:scale-[1.02] duration-200">
                    Book Venue Space
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default HallQuickView;
