import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  ClipboardList,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Activity,
  TrendingUp,
  BadgeCheck,
  Layers3,
  BarChart3,
  Clock3,
} from "lucide-react";
import axios from "axios";

const BOOKING_API = import.meta.env.VITE_BOOKING_API;

function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalEvents: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats(true);
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchStats = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true);
      else setRefreshing(true);

      const { data } = await axios.get(
        `${BOOKING_API}/api/admin/stats`,
        getAuthConfig()
      );

      setStatsData({
        totalEvents: data.totalEvents || 0,
        totalVenues: data.totalVenues || 0,
        totalBookings: data.totalBookings || 0,
        totalUsers: data.totalUsers || 0,
      });
    } catch (error) {
      console.error("FETCH ADMIN STATS ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = [
    {
      title: "Total Events",
      value: statsData.totalEvents,
      icon: CalendarDays,
      color: "text-rose-500",
      bg: "bg-rose-50",
      ring: "ring-rose-100",
      desc: "Published and manageable events",
    },
    {
      title: "Total Venues",
      value: statsData.totalVenues,
      icon: Building2,
      color: "text-orange-500",
      bg: "bg-orange-50",
      ring: "ring-orange-100",
      desc: "Available venue listings",
    },
    {
      title: "Total Bookings",
      value: statsData.totalBookings,
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      desc: "Bookings placed by users",
    },
    {
      title: "Total Users",
      value: statsData.totalUsers,
      icon: Users,
      color: "text-sky-500",
      bg: "bg-sky-50",
      ring: "ring-sky-100",
      desc: "Registered users on platform",
    },
  ];

  const actions = [
    {
      title: "Manage Events",
      desc: "Add, edit, and remove event listings.",
      to: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Manage Venues",
      desc: "Control venue listings, availability, and pricing.",
      to: "/admin/venues",
      icon: Building2,
    },
    {
      title: "Manage Bookings",
      desc: "Track booking activity and update statuses.",
      to: "/admin/bookings",
      icon: ClipboardList,
    },
    {
      title: "Manage Users",
      desc: "View all customers and admin accounts.",
      to: "/admin/users",
      icon: Users,
    },
  ];

  const overviewCards = useMemo(() => {
    const totalInventory = statsData.totalEvents + statsData.totalVenues;
    const bookingPressure =
      totalInventory > 0
        ? (statsData.totalBookings / totalInventory).toFixed(1)
        : "0.0";

    const usersPerBooking =
      statsData.totalBookings > 0
        ? (statsData.totalUsers / statsData.totalBookings).toFixed(1)
        : "0.0";

    return [
      {
        title: "Platform Inventory",
        value: totalInventory,
        subtitle: "Events + venues combined",
        icon: Layers3,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
      {
        title: "Booking Density",
        value: bookingPressure,
        subtitle: "Bookings per listed inventory",
        icon: TrendingUp,
        color: "text-fuchsia-600",
        bg: "bg-fuchsia-50",
      },
      {
        title: "User / Booking Ratio",
        value: usersPerBooking,
        subtitle: "Average users per booking unit",
        icon: BarChart3,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
      },
    ];
  }, [statsData]);

  const activityFeed = [
    {
      title: "Events module ready",
      desc: "Create and maintain event listings from admin controls.",
      icon: CalendarDays,
    },
    {
      title: "Venues management enabled",
      desc: "Edit venue data and keep listings updated.",
      icon: Building2,
    },
    {
      title: "Bookings visibility active",
      desc: "Track booking volume and status handling centrally.",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-rose-100 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Admin Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Monitor platform performance, review core admin modules, and
                manage events, venues, bookings, and users from one modern
                control center.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => fetchStats(false)}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh Stats"}
                </button>

                <Link
                  to="/admin/bookings"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Bookings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:w-[360px]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Secure Admin Access
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Authorized controls for full platform management.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Live Statistics
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Dashboard values fetched directly from backend data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Core Statistics
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Real-time overview of your platform entities
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>
                      <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {loading ? "..." : item.value}
                      </h2>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.desc}
                      </p>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ring-4 ${item.ring}`}
                    >
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Overview */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : card.value}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {card.subtitle}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions + Activity */}
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Jump directly into the main admin modules
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {actions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm transition group-hover:bg-slate-900 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {action.desc}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                      Open Module
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Activity Summary
                  </h3>
                  <p className="text-sm text-slate-500">
                    Key admin capabilities at a glance
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activityFeed.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Admin Control Center</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Use this dashboard to monitor growth, review data health, and
                navigate quickly across the platform’s major management modules.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-300">
                    Users
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {loading ? "..." : statsData.totalUsers}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-300">
                    Bookings
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {loading ? "..." : statsData.totalBookings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Insight Section */}
        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Platform Insights
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A compact interpretation of your current dashboard numbers
              </p>
            </div>

            <button
              onClick={() => fetchStats(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Sync Data
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm font-semibold text-rose-700">
                Events Coverage
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                You currently have{" "}
                <span className="font-bold">{statsData.totalEvents}</span> event
                listings available for management.
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-700">
                Venue Capacity
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The platform includes{" "}
                <span className="font-bold">{statsData.totalVenues}</span> venue
                records ready for viewing and control.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-700">
                Booking Engagement
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                A total of{" "}
                <span className="font-bold">{statsData.totalBookings}</span>{" "}
                bookings have been placed by{" "}
                <span className="font-bold">{statsData.totalUsers}</span> users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;