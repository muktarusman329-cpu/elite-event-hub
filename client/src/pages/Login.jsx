import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/axios';
import { Building2 } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const googleAuthUrl = `${api.defaults.baseURL}/auth/google`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);

      setAuth(response.data.user, response.data.token);

      navigate(
        response.data.user.role === 'admin'
          ? '/admin'
          : '/dashboard',
        { replace: true }
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to login';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10"
  style={{
    backgroundImage:
      "url('https://res.cloudinary.com/dpintbnfc/image/upload/v1779526757/omar-rodriguez-XYuNwlYtfLI-unsplash_j8uwio.jpg')",
  }}
>
  <div className="absolute inset-0 bg-black/70"></div>

  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative z-10 w-full max-w-md"
  >
        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-3xl font-bold text-white"
        >
          <Building2 className="h-8 w-8 text-emerald-500" />
          Elite Event Hub
        </Link>
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl">
        <Card >
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-emerald-400">
              Sign In
            </p>

            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-3 text-slate-400">
              Access your bookings and dashboard
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email
              </label>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-white outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                Password
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 pr-24 text-white outline-none transition focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-3 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <a
              href={googleAuthUrl}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-white px-4 py-4 text-sm font-semibold text-black transition hover:bg-slate-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />

              Continue with Google
            </a>

            {/* Apple */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-black px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M16.365 1.43c0 1.14-.465 2.197-1.196 2.97-.74.78-1.95 1.38-3.03 1.29-.14-1.09.39-2.22 1.12-2.97.8-.83 2.1-1.42 3.1-1.29zM20.54 17.01c-.55 1.25-.81 1.81-1.52 2.94-.99 1.57-2.39 3.53-4.12 3.55-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.06-1.79-4.05-3.36-2.77-4.4-3.06-9.56-1.35-12.2 1.21-1.87 3.11-2.96 4.89-2.96 1.82 0 2.96 1 4.46 1 1.45 0 2.34-1 4.45-1 1.58 0 3.25.86 4.46 2.35-3.92 2.15-3.28 7.74.88 9.68z" />
              </svg>

              Continue with Apple
            </button>
          </form>
          </Card>
            </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Create account
            </Link>
          </p>
      </motion.div>
    </div>
  );
}
