import { Link } from 'react-router-dom';
import { Sparkles, Utensils, Mic2, Camera } from 'lucide-react';

const services = [
  {
    icon: Utensils,
    title: 'Premium catering',
    desc: 'Chef-curated menus, dietary accommodations, and full-service banquet coordination.',
  },
  {
    icon: Mic2,
    title: 'AV & production',
    desc: 'Stage design, sound systems, live streaming, and technical crew on standby.',
  },
  {
    icon: Camera,
    title: 'Photography & media',
    desc: 'Professional photo, video, and branded event content packages.',
  },
  {
    icon: Sparkles,
    title: 'Décor & styling',
    desc: 'Custom themes, floral design, lighting, and luxury tablescapes.',
  },
];

function Services() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Services</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Everything your event needs</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Pair your hall booking with trusted vendors and white-glove coordination from Elite Event Hub.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 transition hover:border-blue-200 hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
        <Link
          to="/booking"
          className="mt-10 inline-flex rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          Start planning
        </Link>
      </div>
    </div>
  );
}

export default Services;
