import { motion } from 'framer-motion';
import { generateTimeSlots, isSlotTaken, timeToMinutes } from '../lib/pricing';

/**
 * TimeSlotPicker — visual grid of hourly slots showing availability.
 * Props:
 *   startTime   – currently selected start "HH:mm"
 *   endTime     – currently selected end "HH:mm"
 *   bookedSlots – [{ startTime, endTime }] from API
 *   onSelect    – (slot: string) => void
 *   loading     – boolean
 */
function TimeSlotPicker({ startTime, endTime, bookedSlots = [], onSelect, loading }) {
  const slots = generateTimeSlots(8, 23, 60); // 08:00 → 22:00

  const getSlotStatus = (slot) => {
    if (isSlotTaken(slot, bookedSlots)) return 'booked';
    if (startTime && endTime) {
      const slotMins = timeToMinutes(slot);
      const startMins = timeToMinutes(startTime);
      const endMins = timeToMinutes(endTime);
      if (slotMins >= startMins && slotMins < endMins) return 'selected';
    } else if (slot === startTime) {
      return 'selected';
    }
    return 'available';
  };

  const statusClasses = {
    available: 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 cursor-pointer',
    selected: 'border-emerald-500/70 bg-emerald-500/20 text-emerald-300 font-semibold ring-1 ring-emerald-500/40',
    booked: 'border-rose-500/30 bg-rose-500/10 text-rose-400/70 cursor-not-allowed line-through',
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Time slots</p>
        {loading && (
          <span className="text-xs text-slate-400 animate-pulse">Loading availability…</span>
        )}
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Your selection
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/60" />
          Booked
        </span>
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {slots.map((slot) => {
          const status = getSlotStatus(slot);
          return (
            <motion.button
              key={slot}
              type="button"
              whileHover={status !== 'booked' ? { scale: 1.04 } : {}}
              whileTap={status !== 'booked' ? { scale: 0.96 } : {}}
              onClick={() => status !== 'booked' && onSelect?.(slot)}
              disabled={status === 'booked'}
              className={`rounded-xl border px-2 py-2 text-center text-xs transition-all duration-150 ${statusClasses[status]}`}
            >
              {slot}
            </motion.button>
          );
        })}
      </div>

      {bookedSlots.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} already booked on this date.
          Red slots are unavailable.
        </p>
      )}
    </div>
  );
}

export default TimeSlotPicker;
