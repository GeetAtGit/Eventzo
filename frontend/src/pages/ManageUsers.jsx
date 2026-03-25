import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Shield, Sparkles, User, Users } from "lucide-react";

const AUTH_API = import.meta.env.VITE_AUTH_API; 


function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${AUTH_API}/api/users`,
        getAuthConfig()
      );
      setUsers(data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Admin User Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View all registered users and their roles
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">No users found.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Users className="h-6 w-6" />
                </div>

                <h2 className="text-lg font-semibold text-slate-900 line-clamp-1">
                  {user.name}
                </h2>

                <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="line-clamp-1">{user.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="line-clamp-1">{user.email}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      user.isAdmin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {user.isAdmin ? "Admin" : "Customer"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;