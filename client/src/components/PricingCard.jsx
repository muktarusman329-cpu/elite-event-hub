function PricingCard({ plan }) {
return ( <div className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass transition hover:-translate-y-1"> <div className="mb-6 flex items-center justify-between gap-4"> <div> <h3 className="text-2xl font-semibold text-white">
{plan.name} </h3>
      <p className="mt-1 text-sm text-slate-400">
        {plan.subtitle}
      </p>
    </div>

    <span className="rounded-full bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
      {plan.category}
    </span>
  </div>

  {/* Price */}
  <div className="mb-4">
    <p className="text-4xl font-semibold text-white">
      ₦{Number(plan.price || 0).toLocaleString()}
    </p>

    {plan.hourlyRate && (
      <p className="mt-2 text-sm text-emerald-300">
        + ₦
        {Number(
          plan.hourlyRate
        ).toLocaleString()}
        /hour
      </p>
    )}
  </div>

  {/* Capacity */}
  {plan.capacity && (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-sm text-slate-400">
        Capacity
      </p>

      <p className="mt-1 text-lg font-medium text-white">
        {plan.capacity} Guests
      </p>
    </div>
  )}

  <p className="mt-2 text-sm text-slate-400">
    {plan.details}
  </p>

  {/* Features */}
  <ul className="mt-6 space-y-3 text-slate-300">
    {(plan.features || []).map((item) => (
      <li
        key={item}
        className="flex items-center gap-3"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span>

        {item}
      </li>
    ))}
  </ul>

  {/* Button */}
  <button className="mt-8 w-full rounded-full bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
    Select Plan
  </button>
</div>

);
}

export default PricingCard;

