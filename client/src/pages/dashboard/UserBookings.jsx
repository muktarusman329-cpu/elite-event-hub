import { useCallback, useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useSocketStore } from '../../store/useSocketStore';
import { useToastStore } from '../../store/useToastStore';
import Button from '../../components/ui/Button';
import PaystackPayment from '../../components/PaystackPayment';

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const on = useSocketStore((s) => s.on);
  const pushToast = useToastStore((s) => s.push);

  const load = useCallback(async () => {
    const { data } = await api.get('/bookings/mine');
    setBookings(data.bookings || []);
  }, []);

  useEffect(() => {
    load();
    const unsub = on('booking_updated', (booking) => {
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? booking : b)));
    });
    return unsub;
  }, [load, on]);

  const cancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      pushToast({ type: 'success', message: 'Booking cancelled.' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Could not cancel.' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">My bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="glass-surface rounded-2xl p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">{b.hallname}</p>
                <p className="text-sm text-slate-400">
                  {b.date} at {b.time} · {b.eventType} · ₦{Number(b.total || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{b.status}</span>
                {!['Cancelled', 'Rejected', 'Paid'].includes(b.status) && (
                  <Button size="sm" variant="outline" onClick={() => cancel(b.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            {!['Cancelled', 'Rejected', 'Paid'].includes(b.status) && (
              <div className="mt-4">
                <PaystackPayment booking={b} onSuccess={load} redirectToDashboard={false} />
              </div>
            )}
          </div>
        ))}
        {!bookings.length && <p className="text-slate-500">You have no bookings yet.</p>}
      </div>
    </div>
  );
}

export default UserBookings;
