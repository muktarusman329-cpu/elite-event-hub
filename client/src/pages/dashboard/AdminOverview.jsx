import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { useSocketStore } from '../../store/useSocketStore';
import { useToastStore } from '../../store/useToastStore';
import { Button } from '../../components/ui/Button';

function StatCard({ label, value, hint }) {
  return (
    <motion.div
      layout
      className="glass-surface rounded-2xl p-6"
      whileHover={{ y: -2 }}
    >
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-2 text-sm text-slate-400">{hint}</p>}
    </motion.div>
  );
}

function AdminOverview() {
  const [summary, setSummary] = useState({
    revenue: 0,
    bookings: [],
    halls: [],
    stats: { pending: 0, approved: 0, totalUsers: 0 },
  });
  const [notifications, setNotifications] = useState([]);
  const pushToast = useToastStore((s) => s.push);
  const on = useSocketStore((s) => s.on);
  const connectSocket = useSocketStore((s) => s.connectSocket);

  const load = useCallback(async () => {
    const { data } = await api.get('/admin/summary');
    setSummary(data);
  }, []);

  useEffect(() => {
    connectSocket();
    load().catch(() => pushToast({ type: 'error', title: 'Error', message: 'Failed to load dashboard.' }));
  }, [connectSocket, load, pushToast]);

  useEffect(() => {
    const unsubNew = on('new_booking', (booking) => {
      setSummary((prev) => ({
        ...prev,
        bookings: [booking, ...prev.bookings].slice(0, 50),
        stats: { ...prev.stats, pending: (prev.stats?.pending || 0) + 1 },
      }));
      setNotifications((n) => [{ id: booking.id, text: `New booking: ${booking.hallName}` }, ...n].slice(0, 8));
      pushToast({ type: 'success', title: 'Live booking', message: `${booking.name} requested ${booking.hallName}` });
    });
    const unsubUpdate = on('booking_updated', (booking) => {
      setSummary((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) => (b.id === booking.id ? booking : b)),
      }));
    });
    return () => {
      unsubNew();
      unsubUpdate();
    };
  }, [on, pushToast]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      pushToast({ type: 'success', message: `Booking marked as ${status}.` });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Operations overview</h1>
        <p className="mt-2 text-slate-400">Monitor revenue, approvals, and live booking activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={`$${Number(summary.revenue || 0).toLocaleString()}`} />
        <StatCard label="Pending" value={summary.stats?.pending ?? 0} hint="Awaiting approval" />
        <StatCard label="Approved" value={summary.stats?.approved ?? 0} />
        <StatCard label="Users" value={summary.stats?.totalUsers ?? 0} />
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Live booking feed</h2>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
            Real-time via Socket.io
          </span>
        </div>
        <motion.div layout>
          {summary.bookings.slice(0, 8).map((booking) => (
            <motion.div
              key={booking.id}
              layout
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">{booking.hallName}</p>
                <p className="text-sm text-slate-400">
                  {booking.name} · {booking.date} {booking.time}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{booking.status}</span>
                {booking.status === 'Pending' && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(booking.id, 'Approved')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(booking.id, 'Rejected')}>
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {!summary.bookings.length && (
            <p className="text-center text-slate-500 py-8">No bookings yet. New requests appear here instantly.</p>
          )}
        </motion.div>
      </div>

      {notifications.length > 0 && (
        <div className="glass-surface rounded-2xl p-4 text-sm text-slate-300">
          Latest: {notifications[0]?.text}
        </div>
      )}
    </div>
  );
}

export default AdminOverview;
