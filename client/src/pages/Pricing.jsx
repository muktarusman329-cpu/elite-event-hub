import PricingCard from '../components/PricingCard';

const plans = [
  {
    name: 'Wedding Premium',
    category: 'Wedding',
    price: 6800,
    subtitle: 'Full luxury wedding celebration',
    details: 'Includes venue, decoration, catering, and dedicated event manager.',
    features: ['Venue styling', 'Premium catering', 'Entertainment coordination', 'Master of ceremonies'],
  },
  {
    name: 'Conference Pro',
    category: 'Conference',
    price: 4200,
    subtitle: 'Executive conference suite',
    details: 'Includes AV setup, meeting flow support, and catering for attendees.',
    features: ['Projector & screens', 'WiFi', 'Coffee break service', 'Seating layout planning'],
  },
  {
    name: 'Celebration Luxe',
    category: 'Party',
    price: 3300,
    subtitle: 'Festive party package',
    details: 'Perfect for birthdays, anniversaries, and milestone celebrations.',
    features: ['Theme decor', 'Lighting package', 'Music support', 'Guest welcome services'],
  },
];

function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mb-12 space-y-4 text-slate-100">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Pricing packages</p>
        <h1 className="text-4xl font-semibold text-white">Flexible plans for every event type.</h1>
        <p className="max-w-2xl text-slate-400">Choose packages designed for weddings, conferences, birthdays, and premium parties.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}

export default Pricing;
