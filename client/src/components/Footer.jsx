import { Link } from "react-router-dom";
import { correctBorderRadius } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050814] text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:px-8 lg:flex-row lg:justify-between">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-emerald-400">
              <img src="https://res.cloudinary.com/dpintbnfc/image/upload/v1780594895/Untitled_design_1_hyvgxn.png" alt="Logo" width={40} height={40} className="h-8 w-8 rounded-full" />
              </span>
            Elite Event Hub
          </h3>
          <p className="max-w-sm leading-7 text-slate-400 text-sm">
            A refined, commercial-grade event booking experience for weddings, corporate conferences, concerts, and premium luxury gatherings.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://www.facebook.com" aria-label="Facebook" className="transition hover:text-emerald-400 hover:scale-110">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com" aria-label="Instagram" className="transition hover:text-emerald-400 hover:scale-110">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:muktarusman329@gmail.com" aria-label="Email" className="transition hover:text-emerald-400 hover:scale-110">
              <Mail  className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-200">Contact</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2.5 text-slate-400 hover:text-slate-200 transition">
                <Phone className="h-4 w-4 text-emerald-400" action="tel:+2348023511802" /> +234 8023511802
              </p>
              
              <p className="flex items-center gap-2.5 text-slate-400 hover:text-slate-200 transition">
                <Mail className="h-4 w-4 text-emerald-400" aria-description="Email" action="mailto:muktarusman329@gmail.com"   /> muktarusman329@gmail.com
              </p>
              <p className="flex items-start gap-2.5 text-slate-400 hover:text-slate-200 transition">
                <MapPin className="mt-1 h-4 w-4 text-emerald-400 shrink-0" /> 42 Prestige Avenue, Abuja, Nigeria
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-200">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer transition">Venues</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Booking</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Gallery</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-200">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer transition">About</li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Careers</li>
              <li className="hover:text-emerald-400 cursor-pointer transition"><Link to="/privacy-policy">Privacy</Link></li>
              <li className="hover:text-emerald-400 cursor-pointer transition">Support</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 bg-[#030612] px-6 py-6 text-center text-xs text-slate-500 md:px-8">
        © 2026 Elite Event Hub. Crafted for luxury event planning. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
