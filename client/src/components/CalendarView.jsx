import { format, addDays } from 'date-fns';

function CalendarView({ bookings }) {
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(new Date(), index));

  return (
    <section className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Booking calendar</h2>
          <p className="mt-2 text-slate-400">Quick visual view of upcoming dates and reserved halls.</p>
        </div>
        <div className="rounded-full bg-slate-900/90 px-4 py-2 text-sm text-slate-300">
          {bookings.length} upcoming reservations
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {weekDays.map((date) => {
          const dayEvents = bookings.filter((booking) => booking.date === format(date, 'yyyy-MM-dd'));
          return (
            <div key={date.toISOString()} className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{format(date, 'EEE')}</p>
              <p className="mt-2 text-xl font-semibold text-white">{format(date, 'MMM d')}</p>
              <div className="mt-4 space-y-3">
                {dayEvents.length ? (
                  dayEvents.map((booking) => (
                    <div key={booking.id} className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
                      <p className="font-semibold text-white">{booking.hallName}</p>
                      <p>{booking.time} · {booking.eventType}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No bookings</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
