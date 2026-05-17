import { Link } from 'react-router-dom';
import { CalendarDays, PartyPopper, Briefcase } from 'lucide-react';

const eventTypes = [
  {
    icon: PartyPopper,
    title: 'Weddings & celebrations',
    desc: 'From intimate ceremonies to grand receptions with full vendor coordination.',
  },
  {
    icon: Briefcase,
    title: 'Corporate conferences',
    desc: 'Keynotes, breakout sessions, and executive retreats with enterprise AV.',
  },
  {
    icon: CalendarDays,
    title: 'Galas & fundraisers',
    desc: 'Premium banquets, auctions, and branded experiences for distinguished guests.',
  },
];

function Events() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Events</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Designed for every milestone</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Explore event types we specialize in and find the perfect hall for your occasion.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {eventTypes.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 p-8 text-center transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/halls"
            className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
          >
            View halls
          </Link>
          <Link
            to="/gallery"
            className="rounded-full border border-slate-200 px-8 py-3.5 text-sm font-semibold text-slate-700 hover:border-blue-200"
          >
            Event gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Events;
