import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Wallet, CalendarDays, MapPin, ChevronRight,
  Plus, AlertCircle, CheckCircle2, TrendingUp
} from "lucide-react";

const CATALOG_API = import.meta.env.VITE_CATALOG_API;
const BUDGET_API = import.meta.env.VITE_BUDGET_API;

export default function ManageBudgets() {
  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${CATALOG_API}/api/events`, getAuthConfig());
        const eventList = Array.isArray(data) ? data : [];
        setEvents(eventList);

        // Fetch budget for each event in parallel
        const budgetResults = await Promise.allSettled(
          eventList.map(e =>
            axios.get(`${BUDGET_API}/api/budgets/event/${e._id}`)
              .then(res => ({ id: e._id, budget: res.data }))
              .catch(() => ({ id: e._id, budget: null }))
          )
        );

        const budgetMap = {};
        budgetResults.forEach(r => {
          if (r.status === "fulfilled") {
            budgetMap[r.value.id] = r.value.budget;
          }
        });
        setBudgets(budgetMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const totalBudgetAllocated = Object.values(budgets)
    .filter(Boolean)
    .reduce((sum, b) => sum + Number(b.totalBudget || 0), 0);

  const totalSpent = Object.values(budgets)
    .filter(Boolean)
    .reduce((sum, b) => sum + Number(b.spentAmount || 0), 0);

  const eventsWithBudget = Object.values(budgets).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Budget Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Allocate and track budgets across all events
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total Allocated</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{totalBudgetAllocated.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400 mt-1">across {eventsWithBudget} events</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{totalSpent.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {totalBudgetAllocated > 0
                ? `${Math.round((totalSpent / totalBudgetAllocated) * 100)}% of allocated`
                : "No budget set"}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Events Without Budget</p>
            <p className="text-2xl font-bold text-slate-900">
              {events.length - eventsWithBudget}
            </p>
            <p className="text-xs text-slate-400 mt-1">need budget allocation</p>
          </div>
        </div>

        {/* Event Budget Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const budget = budgets[event._id];
            const hasBudget = !!budget;
            const spentPercent = hasBudget
              ? Math.min(100, Math.round((Number(budget.spentAmount) / Number(budget.totalBudget)) * 100))
              : 0;
            const isOverBudget = hasBudget && Number(budget.spentAmount) > Number(budget.totalBudget);

            return (
              <div
                key={event._id}
                onClick={() => navigate(`/admin/budget/${event._id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Event Image */}
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                  {/* Budget status badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                    !hasBudget
                      ? "bg-slate-900/70 text-white"
                      : isOverBudget
                      ? "bg-red-500/90 text-white"
                      : "bg-emerald-500/90 text-white"
                  }`}>
                    {!hasBudget ? (
                      <><Plus size={11} /> Set Budget</>
                    ) : isOverBudget ? (
                      <><AlertCircle size={11} /> Over Budget</>
                    ) : (
                      <><CheckCircle2 size={11} /> On Track</>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{event.title}</h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={11} className="text-rose-400" />
                    <span className="line-clamp-1">{event.venue}</span>
                    <span className="mx-1">·</span>
                    <CalendarDays size={11} className="text-orange-400" />
                    <span>{event.date ? new Date(event.date).toLocaleDateString("en-IN") : "—"}</span>
                  </div>

                  {hasBudget ? (
                    <div className="mt-4 space-y-3">
                      {/* Budget figures */}
                      <div className="flex justify-between text-xs">
                        <div>
                          <p className="text-slate-400">Allocated</p>
                          <p className="font-semibold text-slate-800">
                            ₹{Number(budget.totalBudget).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Spent</p>
                          <p className={`font-semibold ${isOverBudget ? "text-red-500" : "text-slate-800"}`}>
                            ₹{Number(budget.spentAmount).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Remaining</p>
                          <p className={`font-semibold ${isOverBudget ? "text-red-500" : "text-emerald-600"}`}>
                            ₹{Number(budget.remainingAmount).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isOverBudget ? "bg-red-500" : spentPercent > 80 ? "bg-orange-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${spentPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400">{spentPercent}% utilized</p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <p className="text-xs text-slate-400">No budget allocated yet</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Click to set up budget →</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <TrendingUp size={11} />
                      {hasBudget ? "View full dashboard" : "Set up budget"}
                    </span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-700 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}