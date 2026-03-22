import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
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


function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/venues"
          element={
            <ProtectedRoute>
              <Venues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:type/:id"
          element={
            <ProtectedRoute>
              <BookEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/venues"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageVenues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;