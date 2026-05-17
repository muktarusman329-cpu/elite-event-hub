import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const pushToast = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      setAuth(data.user, data.token);
      pushToast({ type: 'success', title: 'Account created', message: 'Welcome to Elite Event Hub.' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Signup failed.' });
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
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Get started</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
