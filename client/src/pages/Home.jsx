import { Link } from 'react-router-dom';
import { halls } from '../data/halls';
import { testimonials } from '../data/testimonials';
import HallCard from '../components/HallCard';
import TestimonialCard from '../components/TestimonialCard';
import ChatbotWidget from '../components/ChatbotWidget';

function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-[80vh] bg-hero bg-cover bg-center px-6 py-20 text-slate-100 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-slate-950/75"></div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6 py-16">
            <span className="inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-sm uppercase tracking-[0.35em] text-emerald-200">
              Luxury event destinations
            </span>
            <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Plan unforgettable meetings, weddings, and celebrations with Elite Event Hub.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Discover premium halls, seamless booking, custom services, and a polished admin dashboard for smooth event management.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/venues" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                Explore venues
              </Link>
              <Link to="/booking" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-200">
                Reserve a date
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-5 text-center text-slate-100">
                <p className="text-3xl font-semibold">120+</p>
                <p className="text-sm text-slate-300">Premium halls</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 text-center text-slate-100">
                <p className="text-3xl font-semibold">4.9/5</p>
                <p className="text-sm text-slate-300">Guest rating</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 text-center text-slate-100">
                <p className="text-3xl font-semibold">24/7</p>
                <p className="text-sm text-slate-300">Concierge support</p>
              </div>
            </div>
          </div>
          <div className="glass-surface w-full max-w-xl rounded-[2rem] border border-white/10 p-8 shadow-glass backdrop-blur-xl">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900/90 p-5 text-white">
                <h2 className="text-xl font-semibold">Fastest route from idea to booking</h2>
                <p className="mt-2 text-slate-300">Get a custom quote and book your venue in under 5 minutes with our premium planning workflow.</p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Featured event hall</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Omega Grand Ballroom</h3>
                  <p className="mt-1 text-slate-400">Ideal for weddings, galas, and premium conferences.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Available now</p>
                  <p className="mt-2 text-3xl font-semibold text-white">May 27</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Curated venue collection</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Hand-picked event halls for every occasion</h2>
          </div>
          <Link to="/venues" className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300">
            View all venues
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Client stories</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">The experience behind each review</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((review) => (
            <TestimonialCard key={review.name} review={review} />
          ))}
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
}

export default Home;
