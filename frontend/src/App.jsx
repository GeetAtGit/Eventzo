import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Venues from "./pages/Venues";
import Events from "./pages/Events";
import MyBookings from "./pages/MyBookings";
import BookEvent from "./pages/BookEvent";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import ManageEvents from "./pages/ManageEvents";
import ManageVenues from "./pages/ManageVenues";
import ManageBookings from "./pages/ManageBookings";
import ManageUsers from "./pages/ManageUsers";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Logged-in user layout routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/events" element={<Events />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book/:type/:id" element={<BookEvent />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/venues" element={<ManageVenues />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;