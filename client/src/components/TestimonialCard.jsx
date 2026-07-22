function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  return (
    <div className="glass-surface rounded-[2rem] border border-white/10 p-8 shadow-glass transition hover:-translate-y-1">
      <p className="text-slate-300">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-6 space-y-1">
        <p className="text-lg font-semibold text-white">
          {testimonial.name}
        </p>

        <p className="text-sm text-emerald-300">
          {testimonial.role}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 text-amber-300">
        {Array.from({ length: testimonial.rating || 0 }).map((_, index) => (
          <span key={index} aria-hidden>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default TestimonialCard;