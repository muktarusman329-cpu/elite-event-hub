import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', form);
      localStorage.setItem('eliteUser', JSON.stringify(response.data.user));
      localStorage.setItem('eliteUserToken', JSON.stringify(response.data.token));
      setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
      window.setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Signup failed.' });
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl items-center px-6 py-16 sm:px-8 lg:px-12">
      <div className="w-full rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-glass backdrop-blur-xl">
        <h1 className="text-4xl font-semibold text-white">Create your Elite account</h1>
        <p className="mt-3 text-slate-400">Join the booking platform for premium halls and full event management support.</p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block text-sm text-slate-300">
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-4 text-slate-100 outline-none"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-4 text-slate-100 outline-none"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-4 text-slate-100 outline-none"
              required
            />
          </label>
          <button className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Create account
          </button>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{message.text}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Signup;
