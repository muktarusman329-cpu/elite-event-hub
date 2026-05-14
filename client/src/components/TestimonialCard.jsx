function TestimonialCard({ review }) {
  return (
    <div className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass transition hover:-translate-y-1">
      <p className="text-slate-300">“{review.review}”</p>
      <div className="mt-6 space-y-1">
        <p className="text-lg font-semibold text-white">{review.name}</p>
        <p className="text-sm text-emerald-300">{review.title}</p>
      </div>
      <div className="mt-4 flex items-center gap-1 text-amber-300">
        {Array.from({ length: review.rating }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
    </div>
  );
}

export default TestimonialCard;
