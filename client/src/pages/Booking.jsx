import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
CalendarDays,
Clock3,
ShieldCheck,
Sparkles,
Wallet,
} from 'lucide-react';

import BookingForm from '../components/BookingForm';
import CalendarView from '../components/CalendarView';
import api from '../lib/axios';
import { useSocketStore } from '../store/useSocketStore';

function Booking() {
const [bookings, setBookings] = useState([]);
const [stats, setStats] = useState({
totalBookings: 0,
activeBookings: 0,
completedBookings: 0,
});

const connectSocket = useSocketStore((s) => s.connectSocket);
const on = useSocketStore((s) => s.on);

const loadCalendar = useCallback(async () => {
try {
const { data } = await api.get('/bookings/calendar');

  const bookingData = data.bookings || [];

  setBookings(bookingData);

  const active = bookingData.filter(
    (b) =>
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected' &&
      b.status !== 'Completed'
  ).length;

  const completed = bookingData.filter(
    (b) => b.status === 'Completed'
  ).length;

  setStats({
    totalBookings: bookingData.length,
    activeBookings: active,
    completedBookings: completed,
  });
} catch (error) {
  console.error(error);
  setBookings([]);
}

}, []);

useEffect(() => {
connectSocket();
loadCalendar();
}, [connectSocket, loadCalendar]);

useEffect(() => {
const unsubNew = on('new_booking', (booking) => {
setBookings((prev) => {
const exists = prev.some((b) => b.id === booking.id);


    if (exists) return prev;

    return [...prev, booking];
  });
});

const unsubUpdate = on('booking_updated', () => {
  loadCalendar();
});

const unsubAvail = on('availability_updated', () => {
  loadCalendar();
});

return () => {
  unsubNew();
  unsubUpdate();
  unsubAvail();
};

}, [on, loadCalendar]);

const upcomingBookings = useMemo(() => {
return bookings
.filter(
(booking) =>
booking.status !== 'Cancelled' &&
booking.status !== 'Rejected'
)
.slice(0, 5);
}, [bookings]);

return ( <div className="relative overflow-hidden">
{/* Background Glow */} <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-500/10 via-slate-950 to-slate-950" />

  <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-14"
    >
      <p className="mb-4 text-sm uppercase tracking-[0.4em] text-emerald-300">
        Elite Event Hub
      </p>

      <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
        Book Luxury Event Halls With Real-Time Pricing
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Select your hall, choose your duration, add premium
        services, and get instant pricing with live availability.
      </p>
    </motion.div>

    {/* Stats */}
    <div className="mb-12 grid gap-6 md:grid-cols-3">
      <div className="glass-surface rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Total Bookings
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {stats.totalBookings}
            </h2>
          </div>

          <CalendarDays className="h-10 w-10 text-emerald-400" />
        </div>
      </div>

      <div className="glass-surface rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Active Events
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {stats.activeBookings}
            </h2>
          </div>

          <Clock3 className="h-10 w-10 text-cyan-400" />
        </div>
      </div>

      <div className="glass-surface rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Completed Events
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {stats.completedBookings}
            </h2>
          </div>

          <ShieldCheck className="h-10 w-10 text-yellow-400" />
        </div>
      </div>
    </div>

    {/* Main Layout */}
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BookingForm onBooked={loadCalendar} />
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Why Book */}
        <div className="glass-surface rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-emerald-400" />

            <h2 className="text-2xl font-semibold text-white">
              Why Book With Us?
            </h2>
          </div>

          <ul className="mt-6 space-y-5 text-slate-300">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-emerald-400" />
              Verified luxury halls and premium event services.
            </li>

            <li className="flex items-start gap-3">
              <Wallet className="mt-1 h-5 w-5 text-cyan-400" />
              Smart real-time pricing calculation system.
            </li>

            <li className="flex items-start gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-yellow-400" />
              Live availability and instant booking confirmation.
            </li>
          </ul>
        </div>

        {/* Upcoming Bookings */}
        <div className="glass-surface rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">
            Upcoming Events
          </h2>

          <div className="mt-6 space-y-4">
            {upcomingBookings.length === 0 ? (
              <p className="text-slate-400">
                No upcoming bookings yet.
              </p>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      {booking.hallname}
                    </h3>

                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                      {booking.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {booking.date}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {booking.startTime || booking.time}
                    {booking.endTime
                      ? ` - ${booking.endTime}`
                      : ''}
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {booking.eventType}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar */}
        <CalendarView bookings={bookings} />
      </motion.div>
    </div>
  </div>
</div>

);
}

export default Booking;
