import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  UserCircle,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isLoggedIn = !!token;

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const linkBase =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";
  const activeLink = "bg-slate-900 text-white shadow-sm";
  const inactiveLink = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const getLinkClass = (path) =>
    `${linkBase} ${location.pathname === path ? activeLink : inactiveLink}`;

  if (hideNavbar) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={user?.isAdmin ? "/admin" : "/"}
          className="flex items-center gap-2"
        >
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Eventzo
            </h1>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          {isLoggedIn ? (
            <>
              {user?.isAdmin ? (
                <Link to="/admin" className={getLinkClass("/admin")}>
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/events" className={getLinkClass("/events")}>
                    <CalendarDays className="h-4 w-4" />
                    Events
                  </Link>

                  <Link to="/venues" className={getLinkClass("/venues")}>
                    <Building2 className="h-4 w-4" />
                    Venues
                  </Link>

                  <Link
                    to="/my-bookings"
                    className={getLinkClass("/my-bookings")}
                  >
                    <ClipboardList className="h-4 w-4" />
                    My Bookings
                  </Link>

                  <Link to="/profile" className={getLinkClass("/profile")}>
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={getLinkClass("/login")}>
                <LogIn className="h-4 w-4" />
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;