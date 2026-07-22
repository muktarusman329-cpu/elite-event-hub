import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, Calendar, Users, Building2,
  MapPin, CreditCard, AlertCircle, Loader2, ArrowLeft,
  Star, Sparkles, Phone, Mail, FileText,
} from 'lucide-react';
import api from '../lib/axios';
import { formatNaira, formatDuration, calcDuration } from '../lib/pricing';

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  Pending:   { bg: 'bg-amber-500/15 border-amber-400/30',  text: 'text-amber-300',  dot: 'bg-amber-400'  },
  Approved:  { bg: 'bg-emerald-500/15 border-emerald-400/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  Paid:      { bg: 'bg-blue-500/15 border-blue-400/30',    text: 'text-blue-300',   dot: 'bg-blue-400'   },
  Completed: { bg: 'bg-slate-500/15 border-slate-400/30',  text: 'text-slate-300',  dot: 'bg-slate-400'  },
  Cancelled: { bg: 'bg-rose-500/15 border-rose-400/30',    text: 'text-rose-300',   dot: 'bg-rose-400'   },
  Rejected:  { bg: 'bg-rose-500/15 border-rose-400/30',    text: 'text-rose-300',   dot: 'bg-rose-400'   },
};

const PAYMENT_STYLES = {
  Pending:  { bg: 'bg-amber-500/15 border-amber-400/30',   text: 'text-amber-300'  },
  Paid:     { bg: 'bg-emerald-500/15 border-emerald-400/30', text: 'text-emerald-300' },
  Failed:   { bg: 'bg-rose-500/15 border-rose-400/30',     text: 'text-rose-300'   },
  Refunded: { bg: 'bg-slate-500/15 border-slate-400/30',   text: 'text-slate-300'  },
};

// ── Small row inside a detail card ────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold truncate ${highlight ? 'text-emerald-400' : 'text-slate-100'}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

// ── Pricing row ───────────────────────────────────────────────────────────────
function PriceRow({ label, value, total }) {
  return (
    <div className={`flex items-center justify-between py-2 ${total ? 'border-t border-slate-700 mt-2 pt-4' : ''}`}>
      <span className={`text-sm ${total ? 'font-bold text-slate-100' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-sm ${total ? 'font-bold text-emerald-400 text-base' : 'font-medium text-slate-200'}`}>
        {value}
      </span>
    </div>
  );
}

// ── Status timeline step ──────────────────────────────────────────────────────
const TIMELINE = ['Pending', 'Approved', 'Paid', 'Completed'];

function StatusTimeline({ status }) {
  const idx = TIMELINE.indexOf(status);
  const cancelled = status === 'Cancelled' || status === 'Rejected';

  return (
    <div className="mt-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Booking Progress</p>
      {cancelled ? (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-400/20 px-4 py-3 text-sm font-medium text-rose-400">
          <AlertCircle className="h-4 w-4" /> Booking {status}
        </div>
      ) : (
        <div className="flex items-center gap-0">
          {TIMELINE.map((step, i) => {
            const done   = i < idx + 1;
            const active = i === idx;
            return (
              <div key={step} className="flex flex-1 items-center">
                {/* dot */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    done
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-700 bg-slate-900'
                  } ${active ? 'ring-2 ring-emerald-500/30' : ''}`}>
                    {done
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <span className="h-2 w-2 rounded-full bg-slate-700" />
                    }
                  </div>
                  <span className={`mt-1.5 text-[10px] font-medium ${done ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {step}
                  </span>
                </div>
                {/* connector */}
                {i < TIMELINE.length - 1 && (
                  <div className={`mb-5 h-0.5 flex-1 transition-all ${i < idx ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookingDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState('');

  useEffect(() => {
    if (!id) return;
    const params = token ? `?token=${encodeURIComponent(token)}` : '';
    api.get(`/bookings/${id}${params}`)
      .then((res) => setBooking(res.data.booking))
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Unable to load booking.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-slate-400"
        >
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm">Loading your booking…</p>
        </motion.div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-rose-500/10 p-10 text-center"
        >
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-400" />
          <h2 className="mb-2 text-xl font-bold text-rose-300">Booking Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'This booking link may be invalid or expired.'}</p>
          <Link
            to="/booking"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Make a New Booking
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const hall = booking.Hall || {};
  const statusStyle  = STATUS_STYLES[booking.status]  || STATUS_STYLES.Pending;
  const payStyle     = PAYMENT_STYLES[booking.paymentStatus] || PAYMENT_STYLES.Pending;
  const duration     = calcDuration(booking.startTime, booking.endTime);
  const services     = Array.isArray(booking.services) ? booking.services : [];

  const formattedDate = booking.date
    ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-14">
      <div className="mx-auto max-w-4xl">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Link
              to="/booking"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Booking
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your Booking
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Booking&nbsp;<span className="font-semibold text-slate-200">#{booking.id}</span>
            </p>
          </div>

          {/* Status pill */}
          <div className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold sm:self-auto ${statusStyle.bg} ${statusStyle.text}`}>
            <span className={`h-2 w-2 rounded-full ${statusStyle.dot} animate-pulse`} />
            {booking.status}
          </div>
        </motion.div>

        {/* ── Hall hero banner ─────────────────────────────────────────── */}
        {hall.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="relative mb-8 h-52 w-full overflow-hidden rounded-3xl sm:h-64"
          >
            <img
              src={hall.image}
              alt={hall.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">{hall.category}</p>
              <h2 className="text-2xl font-bold text-white">{hall.name || booking.hallname}</h2>
              {hall.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-300">
                  <MapPin className="h-3.5 w-3.5" /> {hall.location}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Cards grid ───────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left column */}
          <div className="space-y-6">

            {/* Event details card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Event Details</h3>
              <DetailRow icon={Calendar}  label="Date"       value={formattedDate} />
              <DetailRow icon={Clock}     label="Time"       value={`${booking.startTime} – ${booking.endTime} (${formatDuration(duration)})`} />
              <DetailRow icon={Sparkles}  label="Event Type" value={booking.eventType} />
              <DetailRow icon={Users}     label="Guests"     value={`${booking.guests} guests`} />
              {hall.capacity && (
                <DetailRow icon={Building2} label="Hall Capacity" value={`Up to ${hall.capacity} guests`} />
              )}
              {booking.notes && (
                <DetailRow icon={FileText} label="Notes" value={booking.notes} />
              )}
            </motion.div>

            {/* Contact details card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Contact Details</h3>
              <DetailRow icon={Star}  label="Name"  value={booking.name} />
              <DetailRow icon={Mail}  label="Email" value={booking.email} />
              {booking.phone && (
                <DetailRow icon={Phone} label="Phone" value={booking.phone} />
              )}
            </motion.div>

            {/* Status timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Booking Status</h3>
              <StatusTimeline status={booking.status} />
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Pricing breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Price Breakdown</h3>
              <PriceRow label="Base hall price"   value={formatNaira(booking.basePrice)} />
              {Number(booking.hourlyCharge) > 0 && (
                <PriceRow label={`Hourly charge (${formatDuration(duration)})`} value={formatNaira(booking.hourlyCharge)} />
              )}
              {Number(booking.guestCharge) > 0 && (
                <PriceRow label="Extra guest charge" value={formatNaira(booking.guestCharge)} />
              )}
              {Number(booking.servicesTotal) > 0 && (
                <PriceRow label="Extra services"  value={formatNaira(booking.servicesTotal)} />
              )}
              <PriceRow label="Total"  value={formatNaira(booking.total)} total />
            </motion.div>

            {/* Extra services */}
            {services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.17 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
              >
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Extra Services</h3>
                <ul className="space-y-2">
                  {services.map((svc, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl bg-slate-800/50 px-4 py-2.5">
                      <span className="text-sm font-medium text-slate-200">{svc.name || svc}</span>
                      {svc.price && (
                        <span className="text-sm font-semibold text-emerald-400">{formatNaira(svc.price)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Payment status */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Payment</h3>
              <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${payStyle.bg}`}>
                <div className="flex items-center gap-2">
                  <CreditCard className={`h-4 w-4 ${payStyle.text}`} />
                  <span className={`text-sm font-semibold ${payStyle.text}`}>
                    {booking.paymentStatus || 'Pending'}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-100">{formatNaira(booking.total)}</span>
              </div>

              {booking.paymentReference && (
                <p className="mt-3 text-xs text-slate-500">
                  Ref: <span className="font-mono text-slate-300">{booking.paymentReference}</span>
                </p>
              )}

              {/* Pay Now CTA — only show if not already paid */}
              {booking.paymentStatus !== 'Paid' && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && (
                <a
                  href={`/booking?hall=${booking.hallId}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  <CreditCard className="h-4 w-4" />
                  Complete Payment
                </a>
              )}
            </motion.div>

            {/* Token expiry notice */}
            {token && booking.guestTokenExpiresAt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="rounded-2xl border border-slate-700/50 bg-slate-900/40 px-5 py-4 text-center"
              >
                <p className="text-xs text-slate-500">
                  🔗 This booking link is valid until{' '}
                  <span className="font-semibold text-slate-300">
                    {new Date(booking.guestTokenExpiresAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  . Save it or check your email to access it again.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}