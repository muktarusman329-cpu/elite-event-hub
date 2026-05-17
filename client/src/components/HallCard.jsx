import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  MapPin,
  Star,
  Users,
  Eye,
} from 'lucide-react';
import { statusStyles } from '../lib/normalizeHall';
import HallQuickView from './halls/HallQuickView';

function HallCard({ hall, index = 0 }) {
  const [saved, setSaved] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const booked = hall.status === 'Fully Booked';

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        whileHover={{ y: -6 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-300/50"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <motion.div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${hall.image})` }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span
            className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur-sm ${statusStyles(hall.status)}`}
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {hall.status}
          </span>

          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-label={saved ? 'Remove from favorites' : 'Save hall'}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md transition hover:scale-105 hover:text-rose-500"
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </button>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                {hall.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                {hall.location}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {Number(hall.rating).toFixed(1)}
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{hall.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 ring-1 ring-slate-100">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              {hall.capacity} guests
            </span>
            <span className="font-semibold text-slate-900">
              ${Number(hall.price).toLocaleString()}
              <span className="font-normal text-slate-500"> / event</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(hall.features || []).slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-auto flex gap-2 pt-5">
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Details
            </button>
            {booked ? (
              <span className="flex flex-1 cursor-not-allowed items-center justify-center rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                Unavailable
              </span>
            ) : (
              <Link
                to="/booking"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
              >
                Book now
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </motion.article>

      <HallQuickView hall={hall} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  );
}

export default HallCard;
