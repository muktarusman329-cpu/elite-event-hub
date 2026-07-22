const photos = [
  'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585818/pexels-reiez-35042467_metjgs.jpg',
  'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585818/pexels-alex-talker-1663597564-27769510_bziab3.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585820/pexels-bbso-515173315-20733081_exg0nm.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585820/pexels-unpoquitodefoto-20059731_kktzrd.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585820/pexels-unpoquitodefoto-20059731_kktzrd.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585821/pexels-bertellifotografia-17057040_zunswf.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585857/pexels-bertellifotografia-16120243_sarljz.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585845/pexels-raj-730396-33852468_krk0os.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585856/pexels-vidalbalielojrfotografia-14646741_frj98k.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585850/pexels-vidalbalielojrfotografia-3376769_mh20c2.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585846/pexels-bertellifotografia-17057033_wzm0g5.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585846/pexels-bertellifotografia-17057033_wzm0g5.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585845/pexels-raj-730396-33852468_krk0os.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585856/pexels-vidalbalielojrfotografia-14646741_frj98k.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585850/pexels-vidalbalielojrfotografia-3376769_mh20c2.jpg',
   'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585842/pexels-quang-nguyen-vinh-222549-15621210_pmse0d.jpg',
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
