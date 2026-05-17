import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const pushToast = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.token);
      pushToast({ type: 'success', title: 'Welcome back', message: data.user.name });
      const dest =
        from ||
        (data.user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      pushToast({
        type: 'error',
        message: err.response?.data?.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-surface rounded-3xl p-10"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Sign in</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Elite Event Hub</h1>
        <p className="mt-2 text-sm text-slate-400">Access your bookings and real-time dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">
            Create account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-500">
          Admins: use your seeded credentials after <code className="text-slate-400">npm run seed</code>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
