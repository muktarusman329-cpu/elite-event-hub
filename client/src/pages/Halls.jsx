import {
CalendarDays,
Clock3,
Crown,
ShieldCheck,
Sparkles,
Users,
} from 'lucide-react';

import HallsShowcase from '../components/halls/HallsShowcase';

function Halls() {
return ( <div className="min-h-screen overflow-hidden bg-slate-950">
{/* Hero Background */} <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_35%)]" />
  {/* Hero */}
  <section className="relative border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
      <div className="max-w-4xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Elite Event Hub
          </p>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Browse Premium Luxury Event Halls
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Discover modern halls for weddings,
          conferences, birthdays, concerts,
          and premium celebrations with
          live booking availability and
          real-time pricing calculation.
        </p>

        {/* Features */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon={
              <CalendarDays className="h-5 w-5 text-emerald-400" />
            }
            title="Live Availability"
            text="See booked and free time slots instantly."
          />

          <FeatureCard
            icon={
              <Clock3 className="h-5 w-5 text-emerald-400" />
            }
            title="Duration Pricing"
            text="Pricing changes based on booking hours."
          />

          <FeatureCard
            icon={
              <Users className="h-5 w-5 text-emerald-400" />
            }
            title="Guest-Based Pricing"
            text="Hall costs adjust based on guest count."
          />

          <FeatureCard
            icon={
              <Crown className="h-5 w-5 text-emerald-400" />
            }
            title="Premium Services"
            text="Add catering, photography, DJ, and more."
          />
        </div>
      </div>
    </div>
  </section>

  {/* Halls Showcase */}
  <section className="relative">
    <HallsShowcase className="!bg-transparent !py-16" />
  </section>

  {/* Booking Process */}
  <section className="border-t border-white/10 bg-white/5">
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-14 max-w-3xl">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Smart Booking Process
          </p>
        </div>

        <h2 className="text-4xl font-bold text-white">
          Book Your Hall In Minutes
        </h2>

        <p className="mt-4 text-lg text-slate-400">
          Our platform automatically calculates
          hall pricing based on duration,
          guest count, and premium services.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StepCard
          number="01"
          title="Choose Hall"
          text="Select a luxury hall that matches your event."
        />

        <StepCard
          number="02"
          title="Select Time"
          text="Pick event date, start time, and end time."
        />

        <StepCard
          number="03"
          title="Add Services"
          text="Include catering, decoration, DJ, or photography."
        />

        <StepCard
          number="04"
          title="Secure Payment"
          text="Pay online securely using Paystack checkout."
        />
      </div>
    </div>
  </section>
</div>

);
}

function FeatureCard({
icon,
title,
text,
}) {
return ( <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"> <div className="mb-4">
{icon} </div>

  <h3 className="text-lg font-semibold text-white">
    {title}
  </h3>

  <p className="mt-2 text-sm leading-6 text-slate-400">
    {text}
  </p>
</div>

);
}

function StepCard({
number,
title,
text,
}) {
return ( <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl"> <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10"> <span className="text-xl font-bold text-emerald-400">
{number} </span> </div>

  <h3 className="text-2xl font-semibold text-white">
    {title}
  </h3>

  <p className="mt-4 leading-7 text-slate-400">
    {text}
  </p>
</div>

);
}

export default Halls;
