import { motion, AnimatePresence } from 'framer-motion';
import { formatNaira, formatDuration } from '../lib/pricing';
import {
  Utensils, Camera, Sparkles, Music, Shield, Video, Mic2,
  Clock, Users, Building2, Banknote, ChevronRight, CheckCircle2,
} from 'lucide-react';

const iconMap = {
  Utensils, Camera, Sparkles, Music, Shield, Video, Mic2,
};

function LineItem({ label, value, sub, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-2 py-2 ${highlight ? 'mt-1 border-t border-emerald-500/30 pt-3' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-semibold text-white' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${highlight ? 'text-emerald-400 text-base' : 'text-slate-200'}`}>
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-slate-500">{sub}</span>}
      </span>
    </div>
  );
}

/**
 * PriceCalculator — live sidebar showing the full pricing breakdown.
 * Props:
 *   hall            – hall object (price, hourlyRate, baseGuestCount, capacityPricePerGuest)
 *   startTime       – "HH:mm"
 *   endTime         – "HH:mm"
 *   guests          – number
 *   selectedServices – [{ name, price, icon }]
 *   breakdown       – { basePrice, duration, hourlyCharge, guestCharge, servicesTotal, total }
 */
function PriceCalculator({ hall, startTime, endTime, guests, selectedServices = [], breakdown }) {
  const hasHall = !!hall;
  const hasTime = !!(startTime && endTime);

  const {
    basePrice = 0,
    duration = 0,
    hourlyCharge = 0,
    guestCharge = 0,
    servicesTotal = 0,
    total = 0,
  } = breakdown || {};

  return (
    <div className="sticky top-24 rounded-3xl border border-white/10 bg-[#070b19]/60 backdrop-blur-xl shadow-2xl p-6 glow-hover-emerald">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
          <Banknote className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="text-left">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Live estimate</p>
          <p className="text-sm font-bold text-white">Booking summary</p>
        </div>
      </div>

      {/* Hall info */}
      {hasHall && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-950/40 border border-white/5 px-4 py-3 text-left">
          <Building2 className="h-4 w-4 shrink-0 text-cyan-400" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{hall.name}</p>
            <p className="text-xs text-slate-500 font-medium">{hall.category}</p>
          </div>
        </div>
      )}

      {/* Time & Duration */}
      {hasTime && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-950/40 border border-white/5 px-4 py-3 text-left">
          <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-white">
              {startTime} – {endTime}
            </p>
            <p className="text-xs text-slate-500 font-medium">Duration: {formatDuration(duration)}</p>
          </div>
        </div>
      )}

      {/* Guest count */}
      {guests > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-950/40 border border-white/5 px-4 py-3 text-left">
          <Users className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-sm font-semibold text-white">{guests} guests</p>
          {hall?.baseGuestCount > 0 && guests > hall.baseGuestCount && (
            <span className="ml-auto text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              +{guests - hall.baseGuestCount} extra
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="my-4 border-t border-white/10" />

      {/* Price breakdown */}
      <div className="space-y-0.5">
        {hasHall && (
          <LineItem
            label="Hall base price"
            value={formatNaira(basePrice)}
          />
        )}
        {hasTime && hourlyCharge > 0 && (
          <LineItem
            label="Duration charge"
            value={formatNaira(hourlyCharge)}
            sub={`${formatDuration(duration)} × ${formatNaira(hall?.hourlyRate)}/hr`}
          />
        )}
        {guestCharge > 0 && (
          <LineItem
            label="Extra guests"
            value={formatNaira(guestCharge)}
            sub={`${Math.max(0, guests - (hall?.baseGuestCount || 0))} × ${formatNaira(hall?.capacityPricePerGuest)}`}
          />
        )}

        {/* Services */}
        <AnimatePresence>
          {selectedServices.map((svc) => {
            const Icon = iconMap[svc.icon] || Sparkles;
            return (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
              >
                <LineItem
                  label={
                    <span className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-emerald-400" />
                      {svc.name}
                    </span>
                  }
                  value={formatNaira(svc.price)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Total */}
        {total > 0 && (
          <LineItem
            label="Total estimate"
            value={formatNaira(total)}
            highlight
          />
        )}
      </div>

      {/* Empty state */}
      {!hasHall && (
        <div className="mt-2 flex flex-col items-center gap-2 py-6 text-center">
          <ChevronRight className="h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-500">Select a hall to see your price breakdown</p>
        </div>
      )}

      {/* Included in base note */}
      {hasHall && hall.baseGuestCount > 0 && (
        <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-500">
          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
          Base price includes up to {hall.baseGuestCount} guests.
          Extra guests charged at {formatNaira(hall.capacityPricePerGuest)}/person.
        </p>
      )}
    </div>
  );
}

export default PriceCalculator;
