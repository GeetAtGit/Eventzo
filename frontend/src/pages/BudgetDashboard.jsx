import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  ArrowLeft, Plus, IndianRupee, TrendingUp,
  Wallet, Receipt, AlertCircle, CheckCircle2, X
} from "lucide-react";

const BUDGET_API = import.meta.env.VITE_BUDGET_API || "http://localhost:8081";

const CATEGORIES = [
  "Venue", "Catering", "Decoration", "Entertainment",
  "Marketing", "Logistics", "Staff", "Miscellaneous"
];

const COLORS = ["#f43f5e", "#fb923c", "#facc15", "#4ade80",
                 "#38bdf8", "#818cf8", "#e879f9", "#94a3b8"];

export default function BudgetDashboard() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [budgetForm, setBudgetForm] = useState({ totalBudget: "" });
  const [expenseForm, setExpenseForm] = useState({
    category: CATEGORIES[0],
    description: "",
    amount: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBudget = useCallback(async () => {
    try {
      const res = await axios.get(`${BUDGET_API}/api/budgets/event/${eventId}`);
      setBudget(res.data);
      setShowCreateForm(false);
    } catch (err) {
      if (err.response?.status === 500 || err.response?.status === 404) {
        setShowCreateForm(true);
      } else {
        setError("Failed to load budget");
      }
    }
  }, [eventId]);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${BUDGET_API}/api/budgets/expenses/event/${eventId}`);
      setExpenses(res.data);
    } catch {
      setExpenses([]);
    }
  }, [eventId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBudget();
      await fetchExpenses();
      setLoading(false);
    };
    init();
  }, [fetchBudget, fetchExpenses]);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.totalBudget || isNaN(budgetForm.totalBudget)) return;
    setSubmitting(true);
    try {
      await axios.post(`${BUDGET_API}/api/budgets`, {
        eventId,
        userId: user._id,
        totalBudget: parseFloat(budgetForm.totalBudget)
      });
      await fetchBudget();
      await fetchExpenses();
    } catch {
      setError("Failed to create budget");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount) return;
    setSubmitting(true);
    try {
      await axios.post(`${BUDGET_API}/api/budgets/expenses`, {
        eventId,
        userId: user._id,
        category: expenseForm.category,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount)
      });
      setExpenseForm({ category: CATEGORIES[0], description: "", amount: "" });
      setShowExpenseForm(false);
      await fetchBudget();
      await fetchExpenses();
    } catch {
      setError("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  // Chart data
  const pieData = CATEGORIES.map((cat, i) => {
    const total = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { name: cat, value: total, color: COLORS[i] };
  }).filter(d => d.value > 0);

  const barData = expenses.reduce((acc, exp) => {
    const existing = acc.find(a => a.category === exp.category);
    if (existing) existing.amount += Number(exp.amount);
    else acc.push({ category: exp.category, amount: Number(exp.amount) });
    return acc;
  }, []);

  const spentPercent = budget
    ? Math.min(100, Math.round((Number(budget.spentAmount) / Number(budget.totalBudget)) * 100))
    : 0;

  const isOverBudget = budget && Number(budget.spentAmount) > Number(budget.totalBudget);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/budgets")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-sm"
          >
            <ArrowLeft size={16} />
            Back to Budgets
          </button>
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-emerald-600" />
            <span className="font-semibold text-slate-900">Budget Manager</span>
          </div>
          {budget && (
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-xl transition"
            >
              <Plus size={15} />
              Add Expense
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {/* Create Budget Form */}
        {showCreateForm && (
          <div className="max-w-md mx-auto mt-16">
            {/* Icon + heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 mb-4">
                <Wallet size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Set Event Budget</h2>
              <p className="text-slate-500 text-sm mt-2">Define the total budget allocation for this event</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <form onSubmit={handleCreateBudget} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Budget (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      value={budgetForm.totalBudget}
                      onChange={e => setBudgetForm({ totalBudget: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">You can add individual expenses after setting the budget</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-3 rounded-2xl text-sm font-medium transition"
                >
                  {submitting ? "Creating..." : "Create Budget"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Budget Dashboard */}
        {budget && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Total Budget"
                value={`₹${Number(budget.totalBudget).toLocaleString("en-IN")}`}
                icon={<Wallet size={18} />}
                color="blue"
              />
              <StatCard
                label="Amount Spent"
                value={`₹${Number(budget.spentAmount).toLocaleString("en-IN")}`}
                icon={<TrendingUp size={18} />}
                color={isOverBudget ? "red" : "orange"}
              />
              <StatCard
                label="Remaining"
                value={`₹${Number(budget.remainingAmount).toLocaleString("en-IN")}`}
                icon={isOverBudget ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                color={isOverBudget ? "red" : "green"}
              />
            </div>

            {/* Progress Bar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-500">Budget Utilization</span>
                <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-emerald-600"}`}>
                  {spentPercent}% used
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    isOverBudget ? "bg-red-500" : spentPercent > 80 ? "bg-orange-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> Budget exceeded!
                </p>
              )}
            </div>

            {/* Charts */}
            {expenses.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Expense Breakdown</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <Tooltip
                        formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Amount"]}
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }}
                      />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Expenses Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-700">Expense Ledger</h3>
                </div>
                <span className="text-xs text-slate-400">{expenses.length} entries</span>
              </div>

              {expenses.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                  No expenses yet. Add your first expense.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs text-slate-500 font-medium">Category</th>
                        <th className="px-6 py-3 text-left text-xs text-slate-500 font-medium">Description</th>
                        <th className="px-6 py-3 text-right text-xs text-slate-500 font-medium">Amount</th>
                        <th className="px-6 py-3 text-right text-xs text-slate-500 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp, i) => (
                        <tr key={exp.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full"
                                style={{ background: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length] }} />
                              <span className="text-slate-700">{exp.category}</span>
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-500">{exp.description}</td>
                          <td className="px-6 py-3 text-right font-medium text-slate-900">
                            ₹{Number(exp.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-3 text-right text-slate-400 text-xs">
                            {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString("en-IN") : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-900">Add Expense</h2>
              <button onClick={() => setShowExpenseForm(false)} className="text-slate-400 hover:text-slate-700 transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 transition"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  placeholder="What is this expense for?"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 transition"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowExpenseForm(false)}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-2xl text-sm transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-3 rounded-2xl text-sm font-medium transition">
                  {submitting ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-sky-50 text-sky-500 border-sky-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-500 border-red-100",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}