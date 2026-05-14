const photos = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515165562835-cdd5ed54d7f8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
];

function Gallery() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mb-12 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Event gallery</p>
        <h1 className="text-4xl font-semibold text-white">A polished visual story of luxury events.</h1>
        <p className="max-w-2xl text-slate-400">Browse curated images from weddings, product launches, conferences, and exclusive evening experiences.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {photos.map((src) => (
          <div key={src} className="overflow-hidden rounded-[2rem] border border-white/10 shadow-glass transition hover:-translate-y-1">
            <img src={src} alt="Event gallery" className="h-96 w-full object-cover transition duration-700 hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
