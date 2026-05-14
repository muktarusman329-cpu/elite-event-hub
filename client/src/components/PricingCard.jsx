function PricingCard({ plan }) {
  return (
    <div className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass transition hover:-translate-y-1">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{plan.subtitle}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">{plan.category}</span>
      </div>
      <p className="text-4xl font-semibold text-white">${plan.price}</p>
      <p className="mt-2 text-sm text-slate-400">{plan.details}</p>
      <ul className="mt-6 space-y-3 text-slate-300">
        {plan.features.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
            {item}
          </li>
        ))}
      </ul>
      <button className="mt-8 w-full rounded-full bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
        Select plan
      </button>
    </div>
  );
}

export default PricingCard;
