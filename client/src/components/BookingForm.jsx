import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, ChevronDown, AlertCircle, Building2,
  CheckCircle2, Loader2, Utensils, Camera, Sparkles,
  Music, Shield, Video, Mic2, StickyNote,
} from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { calcTotal, formatNaira, formatDuration, generateTimeSlots } from '../lib/pricing';
import PriceCalculator from './PriceCalculator';
import TimeSlotPicker from './TimeSlotPicker';
import PaystackPayment from './PaystackPayment';

const iconMap = { Utensils, Camera, Sparkles, Music, Shield, Video, Mic2 };

const EVENT_TYPES = ['Wedding', 'Birthday', 'Conference', 'Gala', 'Party', 'Corporate', 'Other'];

const inputCls =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 placeholder:text-slate-600';
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2';

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className={labelCls}>
        {Icon && <Icon className="mb-0.5 mr-1.5 inline h-3.5 w-3.5 text-slate-500" />}
        {label}
      </label>
      {children}
    </div>
  );
}

import { useSearchParams, Link } from 'react-router-dom';

function BookingForm({ onBooked }) {
  const { user } = useAuthStore();
  const pushToast = useToastStore((s) => s.push);
  const [searchParams] = useSearchParams();

  const [halls, setHalls] = useState([]);
  const [services, setServices] = useState([]);       // from API
  const [bookedSlots, setBookedSlots] = useState([]);  // for TimeSlotPicker
  const [availLoading, setAvailLoading] = useState(false);

  const [booking, setBooking] = useState({
  hallId: searchParams.get('hall') || '',
  date: '',
  startTime: '09:00',
  endTime: '13:00',
  eventType: 'Wedding',
  guests: 100,
  selectedServices: [],
  name: '',
  email: '',
  phone: '',
  notes: '',
});

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [step, setStep] = useState(1); // 1=Details, 2=Services, 3=Review

  // Load halls & service catalogue
  useEffect(() => {
    api.get('/halls')
      .then((r) => {
        const list = r.data.halls || [];
        setHalls(list);
        const queryHallId = searchParams.get('hall');
        if (queryHallId && list.some(h => String(h.id) === queryHallId)) {
          setBooking((prev) => ({ ...prev, hallId: queryHallId }));
        } else if (list[0]?.id) {
          setBooking((prev) => ({ ...prev, hallId: String(list[0].id) }));
        }
      })
      .catch(() => pushToast({ type: 'error', message: 'Could not load halls.' }));

    api.get('/services')
      .then((r) => setServices(r.data.services || []))
      .catch(() => {});
  }, [pushToast]);

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      setBooking((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Fetch availability whenever hall or date changes
  useEffect(() => {
    if (!booking.hallId || !booking.date) return;
    setAvailLoading(true);
    api.get('/bookings/availability', { params: { hallId: booking.hallId, date: booking.date } })
      .then((r) => setBookedSlots(r.data.bookings || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setAvailLoading(false));
  }, [booking.hallId, booking.date]);

  const selectedHall = useMemo(
    () => halls.find((h) => String(h.id) === String(booking.hallId)) || null,
    [halls, booking.hallId]
  );

  // Live price calculation
  const breakdown = useMemo(
    () => calcTotal(selectedHall, booking.startTime, booking.endTime, booking.guests, booking.selectedServices),
    [selectedHall, booking.startTime, booking.endTime, booking.guests, booking.selectedServices]
  );

  const toggleService = (svc) => {
    setBooking((prev) => {
      const exists = prev.selectedServices.some((s) => s.name === svc.name);
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s.name !== svc.name)
          : [...prev.selectedServices, { name: svc.name, price: svc.price, icon: svc.icon }],
      };
    });
  };

  const handleSlotSelect = (slot) => {
    setBooking((prev) => {
      // On first click set startTime; second click within same slot sets endTime 1hr later
      if (!prev.startTime || prev.startTime === slot) {
        // Auto endTime = startTime + 2h default
        const [h, m] = slot.split(':').map(Number);
        const endH = Math.min(h + 2, 22);
        const endTime = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        return { ...prev, startTime: slot, endTime };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    if (!booking.date) {
      pushToast({ type: 'error', message: 'Please select an event date.' });
      setLoading(false);
      return;
    }
    if (!booking.startTime || !booking.endTime) {
      pushToast({ type: 'error', message: 'Please select start and end times.' });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        hallId: Number(booking.hallId),
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        time: booking.startTime,
        eventType: booking.eventType,
        guests: Number(booking.guests),
        services: booking.selectedServices,
        name: booking.name || 'Guest User',
        email: booking.email || 'guest@example.com',
        phone: booking.phone || '',
        notes: booking.notes,
      };
      const { data } = await api.post('/bookings', payload);
      setResponse({
        success: true,
        message: 'Your booking request has been received! You will get real-time status updates in your dashboard.',
        id: data.booking?.id || data.bookingId,
        booking: data.booking,
      });
      pushToast({ type: 'success', title: 'Booking submitted', message: 'Awaiting admin approval.' });
      onBooked?.(data.booking);
      setStep(1);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to submit your booking.';
      setResponse({ success: false, message });
      pushToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const timeSlots = generateTimeSlots(8, 23, 60);

  const stepTitles = ['Event details', 'Extra services', 'Review & book'];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      {/* ── Main form ── */}
      <section className="glass-surface rounded-3xl border border-white/10 p-8 shadow-2xl sm:p-10">
        <h2 className="text-2xl font-semibold text-white">Reserve your hall</h2>
        <p className="mt-2 text-sm text-slate-400">
          Fill in your event details and see pricing update live on the right.
        </p>

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-between relative before:absolute before:left-0 before:right-0 before:top-[16px] before:-translate-y-1/2 before:h-0.5 before:bg-white/5 before:-z-10 mb-8 max-w-md mx-auto">
          {stepTitles.map((title, i) => {
            const active = step === i + 1;
            const completed = step > i + 1;
            return (
              <button
                key={title}
                type="button"
                onClick={() => setStep(i + 1)}
                className="flex flex-col items-center gap-2 relative z-10 transition group"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all font-bold text-xs ${
                  completed
                    ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : active
                    ? 'border-cyan-400 bg-[#070b19] text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'border-white/10 bg-slate-950 text-slate-500 group-hover:border-white/20'
                }`}>
                  {completed ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline ${
                  active ? 'text-cyan-400' : completed ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {title}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Event Details ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Hall selector */}
                <Field label="Event hall" icon={Building2}>
                  <div className="relative">
                    <select
                      value={booking.hallId}
                      onChange={(e) => setBooking({ ...booking, hallId: e.target.value })}
                      className={inputCls}
                      required
                    >
                      {halls.map((hall) => (
                        <option key={hall.id} value={String(hall.id)}>
                          {hall.name} — {formatNaira(hall.price)} base · {formatNaira(hall.hourlyRate)}/hr
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {selectedHall && (
                    <p className="mt-2 text-xs text-slate-500">
                      Capacity: {selectedHall.capacity} guests ·{' '}
                      {selectedHall.baseGuestCount > 0 && (
                        <>{selectedHall.baseGuestCount} included, then {formatNaira(selectedHall.capacityPricePerGuest)}/extra guest</>
                      )}
                    </p>
                  )}
                </Field>

                {/* Date */}
                <Field label="Event date" icon={Calendar}>
                  <input
                    type="date"
                    min={today}
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className={inputCls}
                    required
                  />
                </Field>

                {/* Time slots visual */}
                {booking.date && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className={labelCls}>
                      <Clock className="mb-0.5 mr-1.5 inline h-3.5 w-3.5 text-slate-500" />
                      Select time range
                    </label>
                    <TimeSlotPicker
                      startTime={booking.startTime}
                      endTime={booking.endTime}
                      bookedSlots={bookedSlots}
                      onSelect={handleSlotSelect}
                      loading={availLoading}
                    />
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Start time</label>
                        <select
                          value={booking.startTime}
                          onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                          className={inputCls}
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>End time</label>
                        <select
                          value={booking.endTime}
                          onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                          className={inputCls}
                        >
                          {timeSlots
                            .filter((t) => t > booking.startTime)
                            .map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    {booking.startTime && booking.endTime && (
                      <p className="mt-2 text-xs text-emerald-400">
                        ⏱ Duration: {formatDuration(breakdown.duration)}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Event type & guests */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Event type">
                    <div className="relative">
                      <select
                        value={booking.eventType}
                        onChange={(e) => setBooking({ ...booking, eventType: e.target.value })}
                        className={inputCls}
                      >
                        {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </Field>

                  <Field label="Guest count" icon={Users}>
                    <input
                      type="number"
                      min="1"
                      max={selectedHall?.capacity || 1000}
                      value={booking.guests}
                      onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })}
                      className={inputCls}
                    />
                    {selectedHall?.capacity && booking.guests > selectedHall.capacity && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                        <AlertCircle className="h-3 w-3" />
                        Exceeds hall capacity of {selectedHall.capacity}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Contact details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      type="text"
                      value={booking.name}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                      placeholder="Your full name"
                      className={inputCls}
                      required
                    />
                  </Field>
                  <Field label="Contact email">
                    <input
                      type="email"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputCls}
                      required
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      type="text"
                      value={booking.phone}
                      onChange={(e) =>
                        setBooking({
                          ...booking,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+2348012345678"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-bold text-slate-950 hover:shadow-glow-emerald hover:scale-[1.01] transition-all"
                >
                  Next — Add Services
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Services ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <p className="text-sm text-slate-400">
                  Select any additional services to include. Prices are added to your total instantly.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((svc) => {
                    const Icon = iconMap[svc.icon] || Sparkles;
                    const isSelected = booking.selectedServices.some((s) => s.name === svc.name);
                    return (
                      <motion.button
                        key={svc.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleService(svc)}
                        className={`relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {svc.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{svc.description}</p>
                          <p className={`mt-1.5 text-sm font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {formatNaira(svc.price)}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-400" />
                        )}
                      </motion.button>
                    );
                  })}

                  {services.length === 0 && (
                    <p className="col-span-2 py-8 text-center text-slate-500 text-sm">
                      No services available at this time.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 py-3.5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-slate-800"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-bold text-slate-950 transition hover:shadow-glow-emerald hover:scale-[1.01] transition-all"
                  >
                    Next — Review
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Review & Submit ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Summary card */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Booking summary</p>
                  <ReviewRow label="Hall" value={booking.hallname || selectedHall?.name || '—'} />
                  <ReviewRow label="Date" value={booking.date || '—'} />
                  <ReviewRow label="Time" value={`${booking.startTime} – ${booking.endTime} (${formatDuration(breakdown.duration)})`} />
                  <ReviewRow label="Event type" value={booking.eventType} />
                  <ReviewRow label="Guests" value={`${booking.guests} people`} />
                  <ReviewRow label="Name" value={booking.name || '—'} />
                  <ReviewRow label="Email" value={booking.email || '—'} />
                  {booking.selectedServices.length > 0 && (
                    <ReviewRow
                      label="Services"
                      value={booking.selectedServices.map((s) => s.name).join(', ')}
                    />
                  )}
                  <div className="border-t border-white/10 pt-3 mt-2">
                    <ReviewRow
                      label="Estimated total"
                      value={formatNaira(breakdown.total)}
                      highlight
                    />
                  </div>
                </div>

                {/* Notes */}
                <Field label="Special requests / notes" icon={StickyNote}>
                  <textarea
                    rows={3}
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    placeholder="Any special arrangements, dietary needs, setup requests…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 py-3.5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-slate-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !halls.length}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-bold text-slate-950 transition hover:shadow-glow-emerald hover:scale-[1.01] transition-all disabled:opacity-60"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Submitting…' : 'Confirm booking request'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Response banner */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-8 rounded-2xl border p-5 ${
                response.success
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
                  : 'border-rose-400/30 bg-rose-500/10 text-rose-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {response.success
                  ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                }
                <div className="flex-1">
                  <p className="font-semibold">{response.message}</p>
                  {response.id && (
                    <p className="mt-1 text-sm opacity-75">Booking ID: #{response.id}</p>
                  )}
  {response.success && response.booking && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 space-y-4"
  >
    {/* Payment Button */}
    <PaystackPayment booking={response.booking} />

    {/* Guest Review Booking Button — token passed so guest can view without login */}
    <Link
      to={`/booking/${response.booking.id}?token=${response.booking.guestToken}`}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500 bg-emerald-500/10 px-6 py-4 text-base font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
    >
      <CheckCircle2 className="h-5 w-5" />
      Review Your Booking
    </Link>
  </motion.div>
)}
              
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Live Price Calculator sidebar ── */}
      <PriceCalculator
        hall={selectedHall}
        startTime={booking.startTime}
        endTime={booking.endTime}
        guests={booking.guests}
        selectedServices={booking.selectedServices}
        breakdown={breakdown}
      />
    </div>
  );
}

function ReviewRow({ label, value, highlight }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${highlight ? 'mt-1' : ''}`}>
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className={`text-right text-sm ${highlight ? 'font-bold text-emerald-400' : 'text-slate-200 font-medium'}`}>
        {value}
      </span>
    </div>
  );
}

export default BookingForm;