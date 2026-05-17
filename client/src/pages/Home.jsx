import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Zap,
  Calendar,
  Star,
  ChevronDown,
} from 'lucide-react';
import HallsShowcase from '../components/halls/HallsShowcase';
import TestimonialCard from '../components/TestimonialCard';
import { testimonials } from '../data/testimonials';
import { showcaseHalls } from '../data/halls';
import { Button } from '../components/ui/Button';
import PricingCard from '../components/PricingCard';
import { pricingPlans } from '../data/pricingPlans';

const features = [
  { icon: Zap, title: 'Real-time bookings', desc: 'Instant admin notifications and live availability updates via WebSockets.' },
  { icon: Shield, title: 'Secure accounts', desc: 'JWT authentication, role-based access, and encrypted sessions.' },
  { icon: Calendar, title: 'Smart scheduling', desc: 'Conflict detection prevents double bookings on the same slot.' },
  { icon: Sparkles, title: 'Premium experience', desc: 'Polished UI inspired by modern SaaS products and luxury venues.' },
];

const faqs = [
  { q: 'How fast do admins see new bookings?', a: 'Immediately. New reservations appear on the admin dashboard in real time.' },
  { q: 'Can I cancel a booking?', a: 'Yes. From your user dashboard you can cancel pending or approved bookings.' },
  { q: 'Is payment integrated?', a: 'Stripe PaymentIntent scaffolding is ready for production checkout.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh]">
        <motion.div
          className="absolute inset-0 bg-hero bg-cover bg-center"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24 pt-28 lg:flex-row lg:items-center lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300">
              <Sparkles className="h-3 w-3" /> Premium venue platform
            </span>
            <h1 className="text-5xl font-semibold leading-[1.1] text-white md:text-6xl">
              Book world-class event halls with confidence.
            </h1>
            <p className="text-lg text-slate-300">
              Elite Event Hub connects guests, planners, and administrators in one real-time booking experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking">
                <Button size="lg">Book a venue</Button>
              </Link>
              <Link to="/venues">
                <Button size="lg" variant="outline">
                  Explore halls
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.15 }}
            className="glass-surface w-full max-w-md rounded-3xl p-8"
          >
            <p className="text-sm text-slate-400">Next available spotlight</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {showcaseHalls[0]?.name || 'Omega Grand Ballroom'}
            </p>
            <p className="mt-4 text-3xl font-bold text-emerald-400">
              ${showcaseHalls[0]?.price?.toLocaleString?.() || '5,800'}
              <span className="text-base font-normal text-slate-500"> / event</span>
            </p>
            <Link to="/booking" className="mt-6 block">
              <Button className="w-full">Check availability</Button>
            </Link>
          </motion.div>
        </div>
        <ChevronDown className="absolute bottom-8 left-1/2 h-6 w-6 -translate-x-1/2 animate-bounce text-slate-500" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Features</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Built like a commercial SaaS product</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} {...fadeUp} className="glass-surface rounded-2xl p-6 transition hover:border-emerald-500/30">
              <Icon className="h-8 w-8 text-emerald-400" />
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <HallsShowcase
        limit={3}
        title="Featured halls"
        subtitle="Hand-picked venues with live availability, transparent pricing, and instant booking."
        className="border-y border-slate-100"
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div {...fadeUp} className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Trusted by planners worldwide</h2>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div {...fadeUp} className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <motion.div {...fadeUp}>
          <h2 className="text-center text-3xl font-semibold text-white">FAQ</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="glass-surface group rounded-2xl p-5">
                <summary className="cursor-pointer list-none font-medium text-white">{item.q}</summary>
                <p className="mt-3 text-sm text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-slate-900 p-12 text-center"
        >
          <Star className="mx-auto h-8 w-8 text-emerald-400" />
          <h2 className="mt-4 text-3xl font-semibold text-white">Ready to host your next event?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Create an account, book a hall, and watch confirmations update in real time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Get started free</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
