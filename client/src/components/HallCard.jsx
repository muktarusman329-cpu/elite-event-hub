import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Heart, MapPin, Star, Users } from 'lucide-react';
import { statusStyles } from '../lib/normalizeHall';
import HallQuickView from './halls/HallQuickView';

function HallCard({ hall, index = 0 }) {
  const [saved, setSaved] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const booked = hall.status === 'Fully Booked';
  const fallbackImage =
    'https://images.unsplash.com/photo-1519167758481-83f29da8c8a2?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        whileHover={{ y: -6 }}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1224]/50 backdrop-blur-md transition-all duration-300 hover:shadow-glow-emerald hover:border-emerald-500/20"
      >
        {/* IMAGE SECTION */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900/60">
          <motion.img
            src={hall.image || fallbackImage}
            alt={hall.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Status badge */}
          <span
            className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ring-1 ring-inset backdrop-blur-md ${statusStyles(hall.status)}`}
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {hall.status}
          </span>

          {/* Favourite */}
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-label={saved ? 'Remove from favourites' : 'Save hall'}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 border border-white/10 backdrop-blur-md shadow-md transition hover:scale-105 hover:text-rose-500 hover:border-rose-500/35"
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Quick view */}
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs font-bold text-slate-200 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-slate-800 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5 text-emerald-400" />
            Quick view
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-6">
          {/* Name, location, rating */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
                {hall.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                {hall.location}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {Number(hall.rating || 4.5).toFixed(1)}
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {hall.description}
          </p>

          {/* Capacity & Pricing */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 shadow-inner">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              {Number(hall.capacity).toLocaleString()} guests
            </span>

            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-white">
                ₦{Number(hall.price || 0).toLocaleString()}
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest"> base</span>
              </span>
              {Number(hall.hourlyRate) > 0 && (
                <span className="text-xs font-semibold text-cyan-400">
                  + ₦{Number(hall.hourlyRate).toLocaleString()}/hr
                </span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(hall.features || []).slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-auto flex gap-2 pt-5 border-t border-white/5 mt-5">
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-white"
            >
              Details
            </button>

            {booked ? (
              <span className="flex flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-slate-900/60 border border-white/5 px-4 py-2.5 text-sm font-bold text-slate-500">
                Unavailable
              </span>
            ) : (
              <Link
                to={`/booking?hall=${hall.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all"
              >
                Book now
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </motion.article>

      {/* Quick View Modal */}
      <HallQuickView
        hall={hall}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}

export default HallCard;
