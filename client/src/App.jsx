import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Home from './pages/Home';
import Venues from './pages/Venues';
import Halls from './pages/Halls';
import Services from './pages/Services';
import Events from './pages/Events';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import UserOverview from './pages/dashboard/UserOverview';
import UserBookings from './pages/dashboard/UserBookings';
import UserProfile from './pages/dashboard/UserProfile';
import AdminOverview from './pages/dashboard/AdminOverview';
import AdminBookings from './pages/dashboard/AdminBookings';
import AdminHalls from './pages/dashboard/AdminHalls';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminPayments from './pages/dashboard/AdminPayments';
import { useAuthStore } from './store/useAuthStore';
import { useSocketStore } from './store/useSocketStore';

function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavBar />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  const location = useLocation();
  const { token, user } = useAuthStore();
  const connectSocket = useSocketStore((s) => s.connectSocket);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (token && user) connectSocket();
  }, [token, user, connectSocket]);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (isDashboard) {
    return (
      <>
        <ToastContainer />
        <NavBar minimal />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <DashboardLayout variant="user" />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserOverview />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout variant="admin" />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="halls" element={<AdminHalls />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <PublicShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/halls" element={<Halls />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/services" element={<Services />} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PublicShell>
    </>
  );
}

export default App;
