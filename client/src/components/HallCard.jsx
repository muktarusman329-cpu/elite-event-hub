import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function HallCard({ hall }) {
  return (
    <div className="glass-surface group overflow-hidden rounded-3xl border border-white/10 shadow-glass transition duration-500 hover:-translate-y-1 hover:border-emerald-400/30">
      <div
        className="aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: `url(${hall.image})` }}
      ></div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{hall.name}</h3>
            <p className="text-sm text-slate-400">{hall.location}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hall.status === 'Booked' ? 'bg-rose-500/15 text-rose-300' : hall.status === 'Limited' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
            {hall.status}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Capacity</p>
            <p>{hall.capacity} guests</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Price / day</p>
            <p>${hall.price}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {hall.features.map((feature) => (
            <span key={feature} className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 pt-3">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-sm text-slate-400">Selected by {Math.floor(Math.random() * 20) + 5} planners</span>
        </div>
      </div>
    </div>
  );
}

export default HallCard;
