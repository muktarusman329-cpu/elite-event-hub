import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState({ revenue: 0, bookings: [], halls: [] });
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const token = localStorage.getItem('eliteUserToken') || localStorage.getItem('token') || '';
    if (!token) return;

    axios
      .get('/api/admin/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setSummary(response.data);
      })
      .catch(() => {
        setSummary({ revenue: 0, bookings: [], halls: [] });
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Admin dashboard</p>
        <h1 className="text-4xl font-semibold text-white">Live bookings and revenue overview.</h1>
        <p className="max-w-2xl text-slate-400">Monitor reservations, approve requests, and manage halls in one modern dashboard.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total revenue</p>
              <p className="mt-4 text-3xl font-semibold text-white">₦{Number(summary.revenue || 0).toLocaleString()}</p>
            </div>
            <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Bookings</p>
              <p className="mt-4 text-3xl font-semibold text-white">{summary.bookings.length}</p>
            </div>
            <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Halls</p>
              <p className="mt-4 text-3xl font-semibold text-white">{summary.halls.length}</p>
            </div>
          </div>

          <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-white">Activity stream</h2>
                <p className="mt-2 text-slate-400">Review the latest reservation requests and payments.</p>
              </div>
              <div className="rounded-full bg-slate-900/80 px-4 py-2 text-slate-300">Updated in real time</div>
            </div>
            <div className="mt-6 space-y-4">
              {summary.bookings.map((booking) => (
                <div key={booking._id} className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{booking.name}</p>
                      <p className="text-sm text-slate-400">{booking.hallname} · {booking.date} · {booking.time}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
            <h2 className="text-2xl font-semibold text-white">Reservations</h2>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3 text-sm text-slate-300">
                <button className={`rounded-full px-4 py-2 ${activeTab === 'bookings' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-900/80'}`} onClick={() => setActiveTab('bookings')}>
                  Bookings
                </button>
                <button className={`rounded-full px-4 py-2 ${activeTab === 'halls' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-900/80'}`} onClick={() => setActiveTab('halls')}>
                  Halls
                </button>
              </div>
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {summary.bookings.slice(0, 4).map((booking) => (
                    <div key={booking._id} className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                      <p className="font-semibold text-white">{booking.hallname}</p>
                      <p className="text-sm text-slate-400">{booking.date} — {booking.eventType}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'halls' && (
                <div className="space-y-4">
                  {summary.halls.map((hall) => (
                    <div key={hall._id} className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                      <p className="font-semibold text-white">{hall.name}</p>
                      <p className="text-sm text-slate-400">Capacity {hall.capacity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="glass-surface rounded-[2rem] border border-white/10 p-6 shadow-glass">
            <h2 className="text-2xl font-semibold text-white">Revenue insights</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <p>Monthly growth is strong thanks to premium corporate and wedding bookings.</p>
              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Projected earnings</p>
                <p className="mt-2 text-3xl font-semibold text-white">₦{Number(summary.revenue * 1.12 || 0).toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
