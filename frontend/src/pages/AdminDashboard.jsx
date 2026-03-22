import { Link } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  ClipboardList,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Events",
      value: "24",
      icon: CalendarDays,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      title: "Total Venues",
      value: "12",
      icon: Building2,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Total Bookings",
      value: "86",
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Users",
      value: "41",
      icon: Users,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
  ];

  const actions = [
    {
      title: "Manage Events",
      desc: "Add, edit, and remove events.",
      to: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Manage Venues",
      desc: "Control venue listings and pricing.",
      to: "/admin/venues",
      icon: Building2,
    },
    {
      title: "Manage Bookings",
      desc: "Track and update booking statuses.",
      to: "/admin/bookings",
      icon: ClipboardList,
    },
    {
      title: "Manage Users",
      desc: "View registered customers and admins.",
      to: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Eventzo Admin Panel
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Monitor and manage events, venues, bookings, and users from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Admin Access</p>
                <p className="text-xs text-slate-500">
                  Full control over platform content
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </h2>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Jump directly into the main admin modules
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.desc}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    Open Module
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Overview Panel */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Platform Overview
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use the admin panel to keep event listings updated, manage venue
              availability, monitor bookings, and review platform activity.
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Events Management</span>
                <span className="font-medium text-slate-900">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Venue Listings</span>
                <span className="font-medium text-slate-900">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Booking Tracking</span>
                <span className="font-medium text-slate-900">Active</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Recommended Next Steps
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Complete the core admin workflow by connecting these modules to your backend.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                to="/admin/events"
                className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-rose-100"
              >
                <span>Create and manage events</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/admin/venues"
                className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-orange-100"
              >
                <span>Add and edit venues</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/admin/bookings"
                className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-emerald-100"
              >
                <span>Review customer bookings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;