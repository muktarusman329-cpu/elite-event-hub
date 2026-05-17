function HallCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-2/3 rounded-lg bg-slate-200" />
        <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-slate-100" />
          <div className="h-8 w-20 rounded-full bg-slate-100" />
        </div>
        <div className="h-10 w-full rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default HallCardSkeleton;
