import { useEffect, useState } from 'react';
import api from '../../lib/axios';

function AdminPayments() {
  const [revenue, setRevenue] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/admin/summary').then((r) => {
      setRevenue(r.data.revenue || 0);
      setBookings(r.data.bookings || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Payments</h1>
      <div className="glass-surface rounded-2xl p-6">
        <p className="text-sm text-slate-400">Total recorded revenue</p>
        <p className="mt-2 text-4xl font-semibold text-emerald-400">
          ${Number(revenue).toLocaleString()}
        </p>
      </div>
      <div className="space-y-3">
        {bookings.slice(0, 12).map((b) => (
          <div key={b.id} className="glass-surface flex justify-between rounded-xl p-4 text-sm">
            <span className="text-white">{b.hallName}</span>
            <span className="text-slate-400">
              ${Number(b.total || 0).toLocaleString()} - {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPayments;
