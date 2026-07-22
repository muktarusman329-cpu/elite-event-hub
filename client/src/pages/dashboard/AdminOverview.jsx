import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { useSocketStore } from '../../store/useSocketStore';
import { useToastStore } from '../../store/useToastStore';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';

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
  const [supportChats, setSupportChats] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
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
    const unsubnew = on('new_booking', (booking) => {
      setSummary((prev) => ({
        ...prev,
        bookings: [booking, ...prev.bookings].slice(0, 50),
        stats: { ...prev.stats, pending: (prev.stats?.pending || 0) + 1 },
      }));
      setNotifications((n) => [{ id: booking.id, text: `New booking: ${booking.hallname}` }, ...n].slice(0, 8));
      pushToast({ type: 'success', title: 'Live booking', message: `${booking.name} requested ${booking.hallname}` });
    });
    const unsubUpdate = on('booking_updated', (booking) => {
      setSummary((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) => (b.id === booking.id ? booking : b)),
      }));
    });
    return () => {
      unsubnew();
      unsubUpdate();
    };
  }, [on, pushToast]);

  useEffect(() => {
    const unsubSupport = on('support_message', (payload) => {
      setSupportChats((state) => [
        {
          id: payload.sentAt || Date.now(),
          type: 'incoming',
          userId: payload.userId,
          username: payload.username,
          message: payload.message,
        },
        ...state,
      ]);
      setSelectedUserId(payload.userId);
      pushToast({ type: 'success', message: `Support message from ${payload.username}` });
    });

    return () => {
      unsubSupport();
    };
  }, [on, pushToast]);

  const sendSupportReply = () => {
    if (!selectedUserId || !reply.trim()) return;
    useSocketStore.getState().socket?.emit('support_reply', {
      targetUserId: selectedUserId,
      message: reply.trim(),
      adminname: 'Admin',
    });
    setSupportChats((state) => [
      {
        id: Date.now(),
        type: 'reply',
        userId: selectedUserId,
        message: reply.trim(),
      },
      ...state,
    ]);
    setReply('');
    pushToast({ type: 'success', message: 'Reply sent.' });
  };

  const recentSupport = useMemo(
    () => supportChats.filter((chat) => chat.userId === selectedUserId),
    [supportChats, selectedUserId]
  );

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
        <StatCard label="Revenue" value={`₦${Number(summary.revenue || 0).toLocaleString()}`} />
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
                <p className="font-medium text-white">{booking.hallname}</p>
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
            <p className="text-center text-slate-500 py-8">no bookings yet. new requests appear here instantly.</p>
          )}
        </motion.div>
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Support chat</h2>
            <p className="mt-1 text-sm text-slate-400">Reply to customer requests from the admin dashboard.</p>
          </div>
          <div className="space-x-2">
            {selectedUserId && (
              <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                Chatting with user {selectedUserId}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_0.45fr]">
          <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/90 p-4">
            {recentSupport.length === 0 ? (
              <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-400">no active support chats yet. Incoming messages will appear here.</div>
            ) : (
              recentSupport.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-3xl p-4 ${item.type === 'reply' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-slate-900/80 text-slate-100'}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span>{item.type === 'reply' ? 'Reply' : item.username}</span>
                    <span>{item.id ? new Date(item.id).toLocaleTimeString() : ''}</span>
                  </div>
                  <p>{item.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
            <Textarea
              label="Admin reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your message to the customer"
            />
            <Button type="button" className="mt-3 w-full" onClick={sendSupportReply} disabled={!selectedUserId || !reply.trim()}>
              Send reply
            </Button>
          </div>
        </div>
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
