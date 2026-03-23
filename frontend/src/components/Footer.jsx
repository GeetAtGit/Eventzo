import { Link } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  Users,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">Eventzo</h2>
            <p className="mt-3 text-sm text-slate-500 leading-6">
              Your all-in-one platform to manage events, venues, bookings, and
              users with ease.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/events" className="hover:text-slate-900">
                Events
              </Link>
              <Link to="/venues" className="hover:text-slate-900">
                Venues
              </Link>
              <Link to="/my-bookings" className="hover:text-slate-900">
                My Bookings
              </Link>
              <Link to="/profile" className="hover:text-slate-900">
                Profile
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Platform
            </h3>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Event Management
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Venue Listings
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User System
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@eventzo.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-4 flex gap-4 text-slate-500">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Eventzo. All rights reserved.
          </p>

          <p className="text-xs text-slate-400">
            Built with ❤️ for seamless event management
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;