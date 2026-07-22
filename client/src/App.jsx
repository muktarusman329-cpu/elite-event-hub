import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
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
import AdminServices from './pages/dashboard/AdminServices';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminPayments from './pages/dashboard/AdminPayments';
import { useAuthStore } from './store/useAuthStore';
import { useSocketStore } from './store/useSocketStore';
import { useThemeStore } from './store/useThemeStore';
import ChatbotWidget from './components/ChatbotWidget';
import BookingDetails from './pages/BookingDetails';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieConsent from "./components/CookieConsent";

function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="relative">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

function App() {
  const location = useLocation();
  const { token, user } = useAuthStore();
  const connectSocket = useSocketStore((s) => s.connectSocket);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (user) connectSocket();
  }, [user, connectSocket]);

  // fetch session user on mount (if cookie-based session exists)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await (await import('./lib/axios')).default.get('/auth/me');
        if (mounted && res?.data) {
          useAuthStore.getState().setUser(res.data);
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) useAuthStore.getState().setAuthChecked(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (isDashboard) {
  return (
    <ErrorBoundary>
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
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>

        <CookieConsent />
      </>
    </ErrorBoundary>
  );
}

  return (
    <ErrorBoundary>
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
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PublicShell>
      </>
    </ErrorBoundary>
  );
}

export default App;
