import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Calendar,
  Star,
  MapPin,
  Users,
  Clock,
  Search,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Heart,
  SlidersHorizontal,
  Quote,
  Building,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import HallsShowcase from '../components/halls/HallsShowcase';
import TestimonialCard from '../components/TestimonialCard';
import { testimonials } from '../data/testimonials';
import { showcaseHalls } from '../data/halls';

// Count-up counter component for stats
function CountUp({ to, duration = 2 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(to.replace(/\D/g, ''));
    if (isNaN(end)) return;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [to, duration]);

  const suffix = to.replace(/[0-9]/g, '');
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

// Stats data
const stats = [
  { label: 'Venues Listed', value: '500+', icon: MapPin },
  { label: 'Events Hosted', value: '10K+', icon: TrendingUp },
  { label: 'Happy Customers', value: '25K+', icon: Users },
  { label: 'Bookings Secured', value: '50K+', icon: Calendar },
];

// Categories data
const categories = [
  { name: 'Wedding Halls', icon: '💍', color: 'from-emerald-500 to-teal-500', count: '120+ Halls' },
  { name: 'Conference Centers', icon: '🏢', color: 'from-cyan-500 to-blue-500', count: '85+ Halls' },
  { name: 'Birthday Venues', icon: '🎉', color: 'from-emerald-400 to-cyan-500', count: '140+ Halls' },
  { name: 'Corporate Events', icon: '💼', color: 'from-teal-500 to-indigo-500', count: '90+ Halls' },
  { name: 'Religious Centers', icon: '🙏', color: 'from-indigo-500 to-cyan-400', count: '45+ Halls' },
  { name: 'Luxury Spaces', icon: '✨', color: 'from-emerald-300 to-cyan-400', count: '65+ Halls' },
];

// Features data
const features = [
  {
    icon: Zap,
    title: 'Real-time Slot Verification',
    description: 'Instant admin notifications and live availability updates via high-performance WebSockets',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'JWT authorization, role-based access controls, and industry-grade SSL encryption protocols',
  },
  {
    icon: Calendar,
    title: 'Dynamic Conflict Detection',
    description: 'Advanced scheduling calendar automatically checks conflicts and prevents overlapping bookings',
  },
  {
    icon: Sparkles,
    title: 'Elite Concierge Experience',
    description: 'Premium UI crafted for smooth interactions, transparent price calculations, and luxury venue selection',
  },
];

// How it works steps
const steps = [
  {
    number: '01',
    title: 'Explore & Search',
    description: 'Explore our curated directory of luxury event venues using advanced filters.',
  },
  {
    number: '02',
    title: 'Check Calendar',
    description: 'Review the real-time calendar and select your preferred dates and hours.',
  },
  {
    number: '03',
    title: 'Customize Services',
    description: 'Select catering, high-end decor, sound systems, and special guest count pricing.',
  },
  {
    number: '04',
    title: 'Finalize Checkout',
    description: 'Pay securely online using Paystack payment gateway with instant booking validation.',
  },
];

// FAQ data
const faqs = [
  {
    q: 'How do I book a venue?',
    a: 'Simply browse our listings, pick your venue, select your date/hours via the calendar, customize add-on services, and make a payment. Your reservation request will be created instantly.',
  },
  {
    q: 'Can I cancel my booking?',
    a: 'Yes. Bookings can be cancelled directly from your user dashboard. Refunds are subject to the specific venue cancellation guidelines listed during reservation.',
  },
  {
    q: 'What payment options do you support?',
    a: 'We process card payments, bank transfers, USSD, and mobile money transactions securely via Paystack API integrations.',
  },
  {
    q: 'How do I modify my booking details?',
    a: 'You can request modifications from the booking detail view in your dashboard or contact our customer support team directly.',
  },
  {
    q: 'Are there hidden service fees?',
    a: 'Absolutely not. All pricing including base rates, guest capacity fees, and customized extra services are itemized in real-time before you pay.',
  },
  {
    q: 'Can I view the venue in person before booking?',
    a: 'Yes, you can schedule physical tours by contacting us through the support widget or via the details pane for eligible venues.',
  },
];

function Home() {
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  // Hero Search states
  const [searchLoc, setSearchLoc] = useState('');
  const [searchCap, setSearchCap] = useState('');
  const [searchCat, setSearchCat] = useState('All');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmailInput('');
    setSubscribeLoading(false);
  };

  return (
    <div className="overflow-hidden bg-[#030712] text-slate-100 min-h-screen">
      {/* Background Glow Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 md:pb-24 overflow-hidden">
<div className="absolute inset-0">
  <img
    src="https://images.unsplash.com/photo-1511578314322-379afb476865"
    alt="Luxury Event Hall"
    className="w-full h-full object-cover"
  />
<div className="absolute inset-0 bg-black/70"></div>
</div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                    Premium Venue Reservation System
                  </span>
                </div>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold leading-tight text-white">
                Reserve Luxury Venues{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl">
                Discover world-class venues with real-time availability calendar, transparent dynamic price calculator, and instant secure checkouts.
              </p>

              {/* Large Search Section */}
              <div className="glass-premium rounded-3xl p-4 md:p-6 w-full shadow-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Location */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Abuja, Lagos"
                      value={searchLoc}
                      onChange={(e) => setSearchLoc(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-cyan-400" /> Type
                    </label>
                    <select
                      value={searchCat}
                      onChange={(e) => setSearchCat(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="Wedding Halls">Weddings</option>
                      <option value="Conference Centers">Conferences</option>
                      <option value="Birthday Venues">Birthdays</option>
                      <option value="Corporate Events">Corporate</option>
                      <option value="Luxury Spaces">Luxury</option>
                    </select>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" /> Min Guests
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 200"
                      value={searchCap}
                      onChange={(e) => setSearchCap(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    to={`/halls?search=${searchLoc}&category=${searchCat}&capacity=${searchCap}`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="primary"
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:shadow-glow-emerald px-8 py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                    >
                      <Search className="w-4 h-4" /> Find Venues
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-950 bg-gradient-to-br from-emerald-500 to-cyan-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <strong className="text-white">10,000+</strong> reservations confirmed this month.
                </p>
              </div>
            </motion.div>

            {/* Right - Featured Venue Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-25" />
              
              <Card className="relative bg-[#070b19]/80 border border-white/10 overflow-hidden p-0 rounded-3xl shadow-2xl">
                <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                  <img
                    src="https://res.cloudinary.com/dpintbnfc/image/upload/e_background_removal/sergey-mind-9ZQEJFuX_4g-unsplash_zys3bi.jpg"
                    alt="Luxury Ballroom"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 text-xs font-black uppercase px-2.5 py-1 rounded-full">
                    Featured Space
                  </div>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {showcaseHalls[0]?.name || 'Omega Grand Ballroom'}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-semibold">{showcaseHalls[0]?.location || 'Lagos, Nigeria'}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      4.9
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/5 text-xs text-left">
                    <div>
                      <p className="text-slate-500 font-medium uppercase tracking-wider text-[9px]">Capacity</p>
                      <p className="font-bold text-slate-200 mt-0.5">{showcaseHalls[0]?.capacity || 500} guests</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium uppercase tracking-wider text-[9px]">Amenities</p>
                      <p className="font-bold text-slate-200 mt-0.5">Premium</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium uppercase tracking-wider text-[9px]">Services</p>
                      <p className="font-bold text-emerald-400 mt-0.5">Flexible</p>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dynamic Rate</p>
                      <p className="text-2xl font-black text-white mt-0.5">
                        ₦{(showcaseHalls[0]?.price || 5800).toLocaleString()}
                        <span className="text-xs font-normal text-slate-400"> / event</span>
                      </p>
                    </div>
                    <Link to="/booking">
                      <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:shadow-glow-emerald px-6 py-2.5 rounded-xl transition hover:scale-105">
                        Reserve Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#070b19]/40 border-y border-white/5 relative">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} variants={staggerItem} className="text-center space-y-2">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white">
                    <CountUp to={stat.value} />
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Venues Showcase */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
            <Badge className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
              Exclusive Portfolio
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Handpicked Premium Venues
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              Explore our curated database of luxury halls designed to make your corporate events, weddings, and parties unforgettable.
            </p>
          </motion.div>

          <HallsShowcase title="" subtitle="" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#070b19]/30 border-y border-white/5 relative">
        <div className="container-custom">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
            <Badge className="bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
              Venue Catalog
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Find Your Venue Type
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Link to={`/halls?category=${category.name}`}>
                  <Card className="group border border-white/10 bg-[#070b19]/50 hover:border-emerald-500/30 hover:shadow-glow-emerald rounded-3xl p-6 text-left cursor-pointer transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl bg-slate-900/60 border border-white/5 group-hover:border-emerald-500/20 transition-all`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 tracking-wider bg-slate-900/40 px-3 py-1.5 border border-white/5 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      Curated collection of luxury venues optimized for {category.name.toLowerCase()}.
                    </p>
                    <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:gap-2 transition-all">
                      Explore Listings <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
            <Badge className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
              SaaS Foundation
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Why Elite Event Hub
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={staggerItem}>
                  <Card className="flex gap-4 border border-white/10 bg-[#070b19]/40 rounded-3xl p-6 hover:shadow-glow-cyan hover:border-cyan-500/25 transition-all">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#070b19]/30 border-y border-white/5 relative">
        <div className="container-custom">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
            <Badge className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
              Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Booking in 4 Steps
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={staggerItem} className="relative group">
                <Card className="border border-white/10 bg-[#070b19]/50 rounded-3xl p-6 h-full hover:border-emerald-500/30 hover:shadow-glow-emerald transition-all duration-300">
                  <div className="mb-4">
                    <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {step.number}
                    </p>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 relative">
          <div className="container-custom">
            <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
              <Badge className="bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                Loved by Planners
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials
                ?.filter((testimonial) => testimonial && testimonial.quote)
                .slice(0, 3)
                .map((testimonial, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-24 bg-[#070b19]/30 border-y border-white/5 relative">
        <div className="container-custom max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
            <Badge className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-bold text-xs px-4 py-1.5 rounded-full">
              Knowledge
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              FAQs
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-4 text-left"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card
                  onClick={() => setExpandedFaq(expandedFaq === i ? -1 : i)}
                  className="cursor-pointer border border-white/10 bg-[#070b19]/50 rounded-2xl p-5 hover:border-emerald-500/20 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-100">
                      {faq.q}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: expandedFaq === i ? 'auto' : 0, opacity: expandedFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-400 text-xs leading-relaxed mt-4 pt-4 border-t border-white/5">
                      {faq.a}
                    </p>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container-custom max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 rounded-3xl blur-2xl opacity-30" />
          <motion.div
            {...fadeUp}
            className="relative glass-premium rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 md:p-16 text-center space-y-6 shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Ready to Book Your Space?
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Join thousands of event coordinators securing premium venue spaces with smart pricing and WebSocket conflict checks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-md mx-auto">
              <Link to="/halls" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:shadow-glow-emerald py-3.5 transition hover:scale-105 rounded-xl">
                  Browse Venues
                </Button>
              </Link>
              <Button className="flex-1 border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white py-3.5 rounded-xl">
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 border-t border-white/5 bg-[#050814]">
        <div className="container-custom max-w-xl">
          <Card className="text-center border border-white/10 bg-[#070b19]/60 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Stay in Sync
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              Subscribe to receive notification updates on new venue lists and exclusive dynamic rate promotions.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-slate-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 text-sm"
              />
              <Button
                type="submit"
                variant="primary"
                loading={subscribeLoading}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:shadow-glow-emerald px-6 py-3 rounded-xl hover:scale-105 transition"
              >
                Subscribe
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;
