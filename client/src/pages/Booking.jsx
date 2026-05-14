import BookingForm from '../components/BookingForm';
import CalendarView from '../components/CalendarView';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Booking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/api/bookings').then((response) => {
      setBookings(response.data.bookings || []);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mb-12 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Booking desk</p>
        <h1 className="text-4xl font-semibold text-white">Reserve your luxury event hall in minutes.</h1>
        <p className="max-w-2xl text-slate-400">Book with confidence and unlock premium services, digital invoices, and real-time confirmation.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <BookingForm />
        <div className="space-y-6">
          <div className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass">
            <h2 className="text-2xl font-semibold text-white">Why book with us?</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li>• Curated halls and verified vendor services.</li>
              <li>• Easy payment processing with secure checkout.</li>
              <li>• Personalized support from planning specialists.</li>
            </ul>
          </div>
          <CalendarView bookings={bookings} />
        </div>
      </div>
    </div>
  );
}

export default Booking;
