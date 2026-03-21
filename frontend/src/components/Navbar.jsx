import { Link, useLocation, useNavigate } from "react-router-dom";

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

  if (hideNavbar) return null;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        to={user?.isAdmin ? "/admin" : "/events"}
        className="text-2xl font-bold text-blue-600"
      >
        Eventzo
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {user?.isAdmin ? (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link to="/events" className="text-gray-700 hover:text-blue-600">
                  Events
                </Link>
                <Link to="/venues" className="text-gray-700 hover:text-blue-600">
                  Venues
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600"
                >
                  My Bookings
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;