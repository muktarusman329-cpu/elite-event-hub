import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
CalendarDays,
Check,
Crown,
Sparkles,
Users,
Wallet,
} from 'lucide-react';

import PricingCard from '../components/PricingCard';

const hallPlans = [
{
name: 'Royal Wedding Hall',
category: 'Wedding',
basePrice: 500000,
hourlyRate: 70000,
capacity: 500,
subtitle: 'Luxury wedding experience',
description:
'Elegant premium wedding hall with full decoration support and luxury ambience.',
image:
'https://images.unsplash.com/photo-1519167758481-83f29da8c8a2?auto=format&fit=crop&w=1200&q=80',
features: [
'Luxury decoration',
'VIP dressing room',
'Premium sound system',
'LED lighting setup',
],
},

{
name: 'Conference Executive Hall',
category: 'Conference',
basePrice: 250000,
hourlyRate: 50000,
capacity: 300,
subtitle: 'Professional business environment',
description:
'Modern conference hall perfect for seminars, workshops, and executive meetings.',
image:
'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
features: [
'Projector and screens',
'High-speed WiFi',
'Conference seating',
'Coffee break service',
],
},

{
name: 'Celebration Premium Hall',
category: 'Party',
basePrice: 180000,
hourlyRate: 30000,
capacity: 200,
subtitle: 'Modern celebration package',
description:
'Perfect for birthdays, anniversaries, concerts, and social events.',
image:
'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
features: [
'Party lighting',
'DJ stand',
'Entertainment stage',
'Premium seating',
],
},
];

const services = [
{
name: 'Catering',
price: 120000,
},
{
name: 'Photography',
price: 80000,
},
{
name: 'Decoration',
price: 150000,
},
{
name: 'DJ',
price: 50000,
},
{
name: 'Security',
price: 40000,
},
{
name: 'Videography',
price: 100000,
},
];

function Pricing() {
const [selectedHall, setSelectedHall] = useState(hallPlans[0]);
const [hours, setHours] = useState(4);
const [guests, setGuests] = useState(100);
const [selectedServices, setSelectedServices] = useState([]);

const toggleService = (service) => {
setSelectedServices((prev) => {
const exists = prev.find((s) => s.name === service.name);

  if (exists) {
    return prev.filter((s) => s.name !== service.name);
  }

  return [...prev, service];
});

};

const pricing = useMemo(() => {
const basePrice = Number(selectedHall.basePrice);

const durationCost =
  Number(selectedHall.hourlyRate) * Number(hours);

const extraGuests = Math.max(
  0,
  Number(guests) - Number(selectedHall.capacity)
);

const guestCharge = extraGuests * 1000;

const servicesTotal = selectedServices.reduce(
  (sum, service) => sum + service.price,
  0
);

const subtotal =
  basePrice +
  durationCost +
  guestCharge +
  servicesTotal;

const vat = subtotal * 0.075;

const total = subtotal + vat;

return {
  basePrice,
  durationCost,
  guestCharge,
  servicesTotal,
  vat,
  total,
};

}, [selectedHall, hours, guests, selectedServices]);

return ( <div className="relative overflow-hidden">
{/* Background */} <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-500/10 via-slate-950 to-slate-950" />
  <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
    {/* Header */}
    <div className="mb-14">
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-emerald-300">
        Pricing Packages
      </p>

      <h1 className="max-w-4xl text-4xl font-bold text-white md:text-6xl">
        Smart Event Pricing With Real-Time Calculation
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Select halls, choose duration, add premium services,
        and see your event cost update instantly.
      </p>
    </div>

    {/* Hall Cards */}
    <div className="grid gap-6 xl:grid-cols-3">
      {hallPlans.map((plan) => (
        <div
          key={plan.name}
          onClick={() => setSelectedHall(plan)}
          className={`cursor-pointer transition-all duration-300 ${
            selectedHall.name === plan.name
              ? 'scale-[1.02]'
              : 'opacity-80 hover:opacity-100'
          }`}
        >
          <PricingCard
            plan={{
              ...plan,
              price: plan.basePrice,
              details: plan.description,
            }}
          />
        </div>
      ))}
    </div>

    {/* Calculator */}
    <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-emerald-400" />

          <h2 className="text-3xl font-semibold text-white">
            Customize Your Event
          </h2>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
            <CalendarDays className="h-4 w-4" />
            Event Duration (Hours)
          </label>

          <input
            type="range"
            min="1"
            max="24"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full"
          />

          <p className="mt-2 text-emerald-300">
            {hours} Hours
          </p>
        </div>

        {/* Guests */}
        <div className="mb-8">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Users className="h-4 w-4" />
            Number of Guests
          </label>

          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white outline-none"
          />
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Premium Services
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => {
              const active = selectedServices.find(
                (s) => s.name === service.name
              );

              return (
                <button
                  key={service.name}
                  onClick={() => toggleService(service)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-all duration-300 ${
                    active
                      ? 'border-emerald-400 bg-emerald-500/20'
                      : 'border-white/10 bg-white/5 hover:border-emerald-400/40'
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">
                      {service.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      ₦{service.price.toLocaleString()}
                    </p>
                  </div>

                  {active && (
                    <Check className="h-5 w-5 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-24 h-fit rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center gap-3">
          <Crown className="h-7 w-7 text-yellow-400" />

          <h2 className="text-3xl font-semibold text-white">
            Booking Summary
          </h2>
        </div>

        <div className="space-y-5">
          <SummaryRow
            label="Hall"
            value={selectedHall.name}
          />

          <SummaryRow
            label="Base Price"
            value={`₦${pricing.basePrice.toLocaleString()}`}
          />

          <SummaryRow
            label="Duration Charge"
            value={`₦${pricing.durationCost.toLocaleString()}`}
          />

          <SummaryRow
            label="Guest Charge"
            value={`₦${pricing.guestCharge.toLocaleString()}`}
          />

          <SummaryRow
            label="Services"
            value={`₦${pricing.servicesTotal.toLocaleString()}`}
          />

          <SummaryRow
            label="VAT (7.5%)"
            value={`₦${pricing.vat.toLocaleString()}`}
          />

          <div className="my-6 border-t border-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Amount
              </p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                ₦{pricing.total.toLocaleString()}
              </h2>
            </div>

            <Wallet className="h-10 w-10 text-emerald-400" />
          </div>

          <button className="mt-8 w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-emerald-400">
            Proceed To Booking
          </button>
        </div>
      </motion.div>
    </div>
  </div>
</div>

);
}

function SummaryRow({ label, value }) {
return ( <div className="flex items-center justify-between"> <p className="text-slate-400">{label}</p>

  <p className="font-medium text-white">{value}</p>
</div>


);
}

export default Pricing;
