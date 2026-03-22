import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Sparkles,
  ShieldCheck,
  Users,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  Star,
  Ticket,
  HeartHandshake,
  Music4,
  Building2,
  Camera,
  ArrowRight,
} from "lucide-react";

const isLoggedIn = !!localStorage.getItem("token");

const heroSlides = [
  {
    title: "Plan unforgettable events with ease",
    subtitle:
      "Book venues, discover events, and manage everything in one beautiful platform.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "From weddings to corporate meets",
    subtitle:
      "Explore curated spaces and seamless booking experiences tailored to every occasion.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Celebrate moments that matter",
    subtitle:
      "Elegant discovery, quick reservations, and delightful planning — all in one place.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80",
  },
];

const features = [
  {
    icon: CalendarDays,
    title: "Easy Booking",
    text: "Reserve events and venues in just a few clicks with a smooth, guided flow.",
  },
  {
    icon: Building2,
    title: "Premium Venues",
    text: "Browse handpicked venues for weddings, parties, conferences, and more.",
  },
  {
    icon: Ticket,
    title: "Smart Management",
    text: "Track bookings, dates, guests, and plans from one organized dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Experience",
    text: "A reliable platform built to keep your bookings and details safe.",
  },
];

const categories = [
  { icon: PartyPopper, label: "Birthdays" },
  { icon: HeartHandshake, label: "Weddings" },
  { icon: Music4, label: "Concerts" },
  { icon: Users, label: "Corporate" },
  { icon: Camera, label: "Photoshoots" },
  { icon: Sparkles, label: "Private Events" },
];

const stats = [
  { value: "500+", label: "Happy Bookings" },
  { value: "120+", label: "Verified Venues" },
  { value: "50+", label: "Event Partners" },
  { value: "4.9/5", label: "User Rating" },
];

const testimonials = [
  {
    name: "Riya Sharma",
    role: "Birthday Event Host",
    text: "The booking experience felt so smooth and modern. I found a venue I loved in minutes.",
  },
  {
    name: "Arjun Mehta",
    role: "Corporate Organizer",
    text: "A clean platform with all the essential information. It saved us a lot of planning effort.",
  },
  {
    name: "Sneha Kapoor",
    role: "Wedding Planner",
    text: "Beautiful UI, easy navigation, and impressive venue options. Exactly what I needed.",
  },
];

function SectionHeading({ badge, title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-1 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
        <Sparkles className="h-4 w-4" />
        {badge}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/40">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 via-orange-100/20 to-amber-100/30" />
        <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:px-10 lg:grid-cols-2 lg:py-20">
          {/* Left content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Your all-in-one event booking platform
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {heroSlides[currentSlide].title}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              {heroSlides[currentSlide].subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
              >
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/venues"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Browse Venues
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                Top venues in your city
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Safe & reliable booking
              </div>
            </div>
          </div>

          {/* Right carousel image */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-3 shadow-2xl shadow-rose-100 backdrop-blur-xl">
              <div className="relative h-[420px] overflow-hidden rounded-[1.5rem]">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-rose-600">
                        Featured Experience
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        Eventzo Highlights
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevSlide}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-8 bg-slate-900"
                      : "w-2.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur"
            >
              <div className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                {item.value}
              </div>
              <div className="mt-2 text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <SectionHeading
          badge="Why choose Eventzo"
          title="Designed to make event planning feel effortless"
          subtitle="A refined experience with elegant visuals, practical tools, and user-friendly navigation for every kind of celebration."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-rose-50 p-3 text-rose-600 transition group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="rounded-[2rem] border border-white/50 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-2xl md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-300">
                Event categories
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Everything you need for every occasion
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Whether it is a personal celebration or a professional gathering,
                Eventzo helps you discover the right setting and book confidently.
              </p>
            </div>

            <a
              href="/events"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6 text-rose-300" />
                  </div>
                  <p className="font-medium text-slate-100">{category.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <SectionHeading
          badge="Loved by users"
          title="What people are saying"
          subtitle="A clean, welcoming booking experience can make all the difference — and our users feel it too."
        />

        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-xl">
          <div className="mb-5 flex items-center justify-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>

          <p className="text-xl leading-8 text-slate-700 md:text-2xl">
            “{testimonials[currentTestimonial].text}”
          </p>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900">
              {testimonials[currentTestimonial].name}
            </h4>
            <p className="text-slate-500">
              {testimonials[currentTestimonial].role}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentTestimonial === index
                    ? "w-8 bg-rose-500"
                    : "w-2.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
        <div className="rounded-[2rem] border border-rose-100 bg-gradient-to-r from-rose-100 via-orange-50 to-amber-100 p-8 shadow-lg md:p-10">
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">
                Ready to begin?
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                Turn your next event into a memorable experience
            </h2>
            <p className="mt-4 text-slate-700 leading-7">
                Discover the best venues, book your ideal event, and enjoy a
                platform crafted with elegance and ease.
            </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
            <a
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg"
            >
                Get Started
            </a>

            <a
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700"
            >
                Login
            </a>
            </div>
        </div>
        </div>
    </section>
    )}
    </div>
  );
}