import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  let userInfo = null;
  try {
    const stored = localStorage.getItem("userInfo");
    userInfo = stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("userInfo");
    userInfo = null;
  }

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">Eventzo</h1>

        <div className="flex items-center gap-4 text-sm md:text-base">
          {!userInfo ? (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {userInfo?.isAdmin && (
                <Link to="/admin" className="hover:text-blue-300 transition">
                  Admin
                </Link>
              )}
              <Link to="/venues" className="hover:text-blue-300 transition">
                Venues
              </Link>
              <Link to="/events" className="hover:text-blue-300 transition">
                Events
              </Link>
              <Link to="/my-bookings" className="hover:text-blue-300 transition">
                My Bookings
              </Link>
              <button
                onClick={logoutHandler}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;