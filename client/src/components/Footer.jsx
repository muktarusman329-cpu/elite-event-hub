import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 md:px-8 lg:flex-row lg:justify-between">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">Elite Event Hub</h3>
          <p className="max-w-md leading-7 text-slate-400">
            A refined booking experience for weddings, corporate events, celebrations, and premium gatherings.
          </p>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="#" aria-label="Facebook" className="transition hover:text-emerald-300">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="transition hover:text-emerald-300">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Email" className="transition hover:text-emerald-300">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-3 font-semibold text-white">Contact</h4>
            <p className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4 text-emerald-400" /> +1 555 123 9876
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4 text-emerald-400" /> hello@eliteeventhub.com
            </p>
            <p className="flex items-start gap-2 text-slate-400">
              <MapPin className="mt-1 h-4 w-4 text-emerald-400" /> 42 Prestige Avenue, City Center
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Venues</li>
              <li>Booking</li>
              <li>Gallery</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>About</li>
              <li>Careers</li>
              <li>Privacy</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-slate-950/95 px-6 py-4 text-center text-sm text-slate-500 md:px-8">
        © 2026 Elite Event Hub. Crafted for luxury event planning.
      </div>
    </footer>
  );
}

export default Footer;
