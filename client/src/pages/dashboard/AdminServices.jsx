import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Utensils, Camera, Sparkles, Music, Shield, Video, Mic2 } from 'lucide-react';
import api from '../../lib/axios';
import { useToastStore } from '../../store/useToastStore';
import Button from '../../components/ui/Button';
import { formatNaira } from '../../lib/pricing';

const AVAILABLE_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Camera', icon: Camera },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Music', icon: Music },
  { name: 'Shield', icon: Shield },
  { name: 'Video', icon: Video },
  { name: 'Mic2', icon: Mic2 },
];

const emptyForm = {
  name: '',
  price: 0,
  description: '',
  icon: 'Sparkles',
  active: true,
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const pushToast = useToastStore((s) => s.push);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/services/all');
      setServices(data.services || []);
    } catch (err) {
      pushToast({ type: 'error', message: 'Failed to load services.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (service) => {
    setForm({
      name: service.name || '',
      price: service.price || 0,
      description: service.description || '',
      icon: service.icon || 'Sparkles',
      active: service.active !== false,
    });
    setEditId(service.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/services/${editId}`, form);
        pushToast({ type: 'success', message: 'Service updated.' });
      } else {
        await api.post('/services', form);
        pushToast({ type: 'success', message: 'Service created.' });
      }
      resetForm();
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Failed to save service.' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    try {
      await api.delete(`/services/${id}`);
      pushToast({ type: 'success', message: 'Service deleted.' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Could not delete.' });
    }
  };

  const toggleActive = async (service) => {
    try {
      await api.put(`/services/${service.id}`, { active: !service.active });
      pushToast({ type: 'success', message: `Service ${service.active ? 'disabled' : 'enabled'}.` });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: 'Failed to toggle status.' });
    }
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Service Catalogue</h1>
          <p className="mt-1 text-sm text-slate-400">Manage extra services available during booking.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={save}
            className="overflow-hidden"
          >
            <div className="glass-surface rounded-2xl p-6 space-y-5 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {editId ? 'Edit Service' : 'New Service'}
                </h2>
                <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">Service Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Premium Catering"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">Price (₦)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">Description</label>
                <input
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Short description of what the service includes..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">Select Icon</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: name }))}
                      className={`p-2 rounded-xl border transition ${
                        form.icon === name
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                      title={name}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
                />
                <label htmlFor="active-toggle" className="text-sm text-slate-300">
                  Active (visible to customers)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Save Service
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading catalogue...</div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No services configured yet.
          </div>
        ) : (
          services.map((svc) => {
            const Icon = AVAILABLE_ICONS.find((i) => i.name === svc.icon)?.icon || Sparkles;
            return (
              <div
                key={svc.id}
                className={`flex flex-col rounded-2xl border p-5 transition ${
                  svc.active
                    ? 'border-slate-700 bg-slate-900/60 hover:border-emerald-500/30'
                    : 'border-slate-800 bg-slate-950/40 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${svc.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(svc)} className="p-1.5 text-slate-400 hover:text-blue-400 transition" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(svc.id)} className="p-1.5 text-slate-400 hover:text-rose-400 transition" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-white">{svc.name}</h3>
                <p className="mt-1 text-sm font-bold text-emerald-400">{formatNaira(svc.price)}</p>
                
                <p className="mt-2 text-xs text-slate-400 line-clamp-2 flex-1">
                  {svc.description || 'No description provided.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className={`text-xs font-medium ${svc.active ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {svc.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleActive(svc)}
                    className={`text-xs px-2 py-1 rounded transition ${
                      svc.active 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {svc.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminServices;
