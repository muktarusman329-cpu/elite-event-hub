import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useSocketStore } from '../../store/useSocketStore';
import Button from '../../components/ui/Button';

function UserOverview() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const connectSocket = useSocketStore((s) => s.connectSocket);
  const on = useSocketStore((s) => s.on);

  const load = useCallback(async () => {
    const { data } = await api.get('/bookings/mine');
    setBookings(data.bookings || []);
  }, []);

  useEffect(() => {
    connectSocket();
    load();
  }, [connectSocket, load]);

  useEffect(() => {
    const unsub = on('booking_updated', (booking) => {
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? booking : b)));
    });
    return unsub;
  }, [on]);

  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const approved = bookings.filter((b) => b.status === 'Approved').length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{user?.name}</h1>
        <p className="mt-2 text-slate-400">Manage your venue reservations and track confirmations in real time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total bookings', value: bookings.length, icon: CalendarPlus },
          { label: 'Pending', value: pending, icon: Clock },
          { label: 'Confirmed', value: approved, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <motion.div key={label} layout className="glass-surface rounded-2xl p-6">
            <Icon className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-xs uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/booking">
          <Button>Book a hall</Button>
        </Link>
        <Link to="/dashboard/bookings">
          <Button variant="outline">View all bookings</Button>
        </Link>
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
              <p className="font-medium text-white">{b.hallname}</p>
              <p className="text-sm text-slate-400">
                {b.date} · {b.status}
              </p>
            </div>
          ))}
          {!bookings.length && <p className="text-slate-500">no bookings yet. Reserve your first event hall.</p>}
        </div>
      </div>
    </div>
  );
}

export default UserOverview;
