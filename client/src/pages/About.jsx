function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_0.9fr]">
        <div className="glass-surface rounded-[2rem] border border-white/10 p-10 shadow-glass">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">About Elite Event Hub</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">A premium event ecosystem for modern planners.</h1>
          <p className="mt-6 text-slate-300 leading-8">
            Elite Event Hub is built to connect hosts, planners, and venues with a polished booking workflow,
            premium analytics, and effortless customer experiences.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
              <p className="text-2xl font-semibold text-white">200+</p>
              <p className="mt-2 text-sm">Events delivered</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
              <p className="text-2xl font-semibold text-white">98%</p>
              <p className="mt-2 text-sm">Client satisfaction</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-surface rounded-[2rem] border border-white/10 p-10 shadow-glass">
            <h2 className="text-2xl font-semibold text-white">Our approach</h2>
            <p className="mt-4 text-slate-300 leading-7">
              We combine elegant design, robust booking tools, and premium service operations to help every
              event run without issues.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <h3 className="text-xl font-semibold text-white">Trusted vendors</h3>
              <p className="mt-3 text-sm">Curated catering, décor, lighting, and AV partners for every celebration.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <h3 className="text-xl font-semibold text-white">Smart operations</h3>
              <p className="mt-3 text-sm">Admin tools and analytics help managers keep bookings, revenue, and approvals in sync.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
