import HallsShowcase from '../components/halls/HallsShowcase';

function Halls() {
  return (
    <div className="bg-white">
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Elite Event Hub</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Browse premium halls for every occasion
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Compare capacity, pricing, and live availability. Book in minutes with our secure, real-time platform.
          </p>
        </div>
      </div>
      <HallsShowcase className="!bg-white !py-12" />
    </div>
  );
}

export default Halls;
