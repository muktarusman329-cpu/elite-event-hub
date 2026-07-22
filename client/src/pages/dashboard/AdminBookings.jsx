import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, Calendar as CalendarIcon, Clock, Users, ChevronDown, Banknote } from 'lucide-react';
import api from '../../lib/axios';
import { useToastStore } from '../../store/useToastStore';
import { formatNaira, formatDuration } from '../../lib/pricing';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, Pending, Approved, Rejected, Completed
  const [search, setSearch] = useState('');
  const pushToast = useToastStore((s) => s.push);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/bookings', {
        params: { status: filter, search: search || undefined }
      });
      setBookings(data.bookings || []);
    } catch (err) {
      pushToast({ type: 'error', message: 'Failed to load bookings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      load();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [filter, search]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      pushToast({ type: 'success', message: `Booking marked as ${status}.` });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected':
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Paid': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-emerald-400">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Booking Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, or hall..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-emerald-500/50 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Pending', 'Approved', 'Paid', 'Completed', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Event & Hall</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Pricing</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <motion.tr 
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-4 align-top">
                      <p className="font-medium text-white">{booking.hallname}</p>
                      <p className="text-xs text-slate-500 mt-1">{booking.eventType || 'Event'}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-slate-200">{booking.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{booking.email}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <CalendarIcon className="h-3.5 w-3.5 text-blue-400" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                        <Clock className="h-3.5 w-3.5 text-purple-400" />
                        {booking.startTime || booking.time} {booking.endTime ? `– ${booking.endTime}` : ''}
                      </div>
                      {booking.duration > 0 && (
                        <p className="text-xs text-slate-500 mt-1 ml-5">
                          {formatDuration(booking.duration)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="h-3.5 w-3.5 text-amber-400" />
                        {booking.guests || 0} guests
                      </div>
                      {booking.services && booking.services.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {booking.services.map((s, i) => (
                            <span key={i} className="inline-block px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">
                              {typeof s === 'string' ? s : s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <Banknote className="h-3.5 w-3.5" />
                        {formatNaira(booking.total || booking.basePrice || 0)}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[120px] truncate" title={`Base: ${formatNaira(booking.basePrice)} | Hr: ${formatNaira(booking.hourlyCharge)} | Guest: ${formatNaira(booking.guestCharge)} | Svc: ${formatNaira(booking.servicesTotal)}`}>
                        Hover for breakdown
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-right space-y-2">
                      {booking.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(booking.id, 'Approved')}
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded transition"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(booking.id, 'Rejected')}
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded transition"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {(booking.status === 'Approved' || booking.status === 'Paid') && (
                        <button
                          onClick={() => updateStatus(booking.id, 'Completed')}
                          className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
