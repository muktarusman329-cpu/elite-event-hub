import { useState } from 'react';
import { halls } from '../data/halls';
import axios from 'axios';

const serviceOptions = ['Premium Catering', 'Light Design', 'AV Support', 'Live Streaming', 'Photography'];

function BookingForm() {
  const [booking, setBooking] = useState({
    hallId: halls[0].id,
    date: '',
    time: '18:00',
    eventType: 'Wedding',
    guests: 120,
    services: [],
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState(null);

  const handleToggleService = (service) => {
    setBooking((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const result = await axios.post('/api/bookings', booking);
      setResponse({ success: true, message: 'Booking request received. Confirmation will arrive by email.', id: result.data.bookingId });
    } catch (error) {
      setResponse({ success: false, message: error?.response?.data?.message || 'Unable to send your booking.' });
    }
  };

  return (
    <section className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass sm:p-10">
      <h2 className="text-3xl font-semibold text-white">Reserve your hall with confidence</h2>
      <p className="mt-3 max-w-2xl text-slate-300">Select your preferred venue, pick a date, and choose tailored event services for a flawless celebration.</p>

      <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Event hall
            <select
              value={booking.hallId}
              onChange={(e) => setBooking({ ...booking, hallId: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            >
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>{hall.name}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Event date
            <input
              type="date"
              value={booking.date}
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Preferred time
            <input
              type="time"
              value={booking.time}
              onChange={(e) => setBooking({ ...booking, time: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Event type
            <select
              value={booking.eventType}
              onChange={(e) => setBooking({ ...booking, eventType: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            >
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Conference</option>
              <option>Party</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Guest count
            <input
              type="number"
              min="10"
              max="500"
              value={booking.guests}
              onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Contact email
            <input
              type="email"
              value={booking.email}
              onChange={(e) => setBooking({ ...booking, email: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-700 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-200">Add services</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceOptions.map((service) => (
              <button
                type="button"
                key={service}
                onClick={() => handleToggleService(service)}
                className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${booking.services.includes(service) ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300' : 'border-slate-700 bg-slate-950/80 text-slate-300 hover:border-emerald-400/50 hover:bg-slate-900/90'}`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Full name
            <input
              type="text"
              value={booking.name}
              onChange={(e) => setBooking({ ...booking, name: e.target.value })}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Payment summary</p>
            <p className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100">Approx. total: ${Math.round(halls.find((hall) => hall.id === booking.hallId)?.price * 1.1 || 0)}</p>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Request Booking
        </button>
      </form>

      {submitted && response && (
        <div className={`mt-8 rounded-3xl border p-5 ${response.success ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/30 bg-rose-500/10 text-rose-100'}`}>
          <p className="font-semibold">{response.message}</p>
          {response.id && <p className="mt-2 text-sm text-slate-300">Booking ID: {response.id}</p>}
        </div>
      )}
    </section>
  );
}

export default BookingForm;
