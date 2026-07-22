import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import { useToastStore } from '../store/useToastStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const pushToast = useToastStore((s) => s.push);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      pushToast({ type: 'success', message: data.message });
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Request failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full glass-surface rounded-3xl p-10">
        <h1 className="text-2xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-400">We will send reset instructions if the email exists.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" isLoading={loading}>
            Send reset link
          </Button>
        </form>
        <Link to="/login" className="mt-6 block text-center text-sm text-emerald-400">
          Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
