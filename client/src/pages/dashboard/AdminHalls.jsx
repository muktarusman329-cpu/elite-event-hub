import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Building2, Star } from 'lucide-react';
import api from '../../lib/axios';
import { useToastStore } from '../../store/useToastStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CATEGORIES = ['Weddings', 'Conferences', 'Parties', 'Galas', 'Banquets', 'Corporate', 'Other'];
const STATUSES = ['Available', 'Few Slots Left', 'Fully Booked', 'Under Maintenance'];

const emptyForm = {
  name: '',
  location: '',
  capacity: 100,
  price: 30000,
  hourlyRate: 10000,
  capacityPricePerGuest: 400,
  baseGuestCount: 50,
  category: 'Weddings',
  status: 'Available',
  description: '',
  rating: 4.5,
  image: '',
};

const fieldCls =
  'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20';

function FormField({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

function AdminHalls() {
  const [halls, setHalls] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);   // null = create mode
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const pushToast = useToastStore((s) => s.push);

  const load = () => api.get('/halls').then((r) => setHalls(r.data.halls || []));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const imagePreview = useMemo(
    () => (imageFile ? previewUrl : form.image),
    [form.image, imageFile, previewUrl]
  );

  const startEdit = (hall) => {
    setForm({
      name: hall.name || '',
      location: hall.location || '',
      capacity: hall.capacity || 100,
      price: hall.price || 30000,
      hourlyRate: hall.hourlyRate || 10000,
      capacityPricePerGuest: hall.capacityPricePerGuest || 400,
      baseGuestCount: hall.baseGuestCount || 50,
      category: hall.category || 'Weddings',
      status: hall.status || 'Available',
      description: hall.description || '',
      rating: hall.rating || 4.5,
      image: hall.image || '',
    });
    setEditId(hall.id);
    setImageFile(null);
    setPreviewUrl('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setImageFile(null);
    setPreviewUrl('');
    setShowForm(false);
  };

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = imageFile ? buildFormData() : form;
      if (editId) {
        await api.put(`/admin/halls/${editId}`, payload);
        pushToast({ type: 'success', message: 'Hall updated successfully.' });
      } else {
        await api.post('/halls', payload);
        pushToast({ type: 'success', message: 'Hall created successfully.' });
      }
      resetForm();
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Failed to save hall.' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this hall? Active bookings will prevent deletion.')) return;
    try {
      await api.delete(`/admin/halls/${id}`);
      pushToast({ type: 'success', message: 'Hall removed.' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Could not delete.' });
    }
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setNum = (field) => (e) => setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Manage halls</h1>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add hall
          </Button>
        )}
      </div>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={save}
            className="glass-surface rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editId ? 'Edit hall' : 'New hall'}
              </h2>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Basic info */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Hall name">
                <input value={form.name} onChange={set('name')} required placeholder="e.g. Grand Ballroom" className={fieldCls} />
              </FormField>
              <FormField label="Location">
                <input value={form.location} onChange={set('location')} placeholder="e.g. Downtown Plaza" className={fieldCls} />
              </FormField>
              <FormField label="Category">
                <select value={form.category} onChange={set('category')} className={fieldCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={set('status')} className={fieldCls}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Description" >
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={2}
                  placeholder="Short venue description shown on hall cards"
                  className={`${fieldCls} resize-none`}
                />
              </FormField>
              <FormField label="Rating (0–5)">
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={setNum('rating')} className={fieldCls} />
              </FormField>
            </div>

            {/* Pricing */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">Dynamic pricing</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="Base price (₦)" hint="Flat booking fee">
                  <input type="number" min="0" value={form.price} onChange={setNum('price')} className={fieldCls} />
                </FormField>
                <FormField label="Hourly rate (₦)" hint="Per hour of event duration">
                  <input type="number" min="0" value={form.hourlyRate} onChange={setNum('hourlyRate')} className={fieldCls} />
                </FormField>
                <FormField label="Base guests" hint="Included in base price">
                  <input type="number" min="0" value={form.baseGuestCount} onChange={setNum('baseGuestCount')} className={fieldCls} />
                </FormField>
                <FormField label="Per extra guest (₦)" hint="Above base guest count">
                  <input type="number" min="0" value={form.capacityPricePerGuest} onChange={setNum('capacityPricePerGuest')} className={fieldCls} />
                </FormField>
                <FormField label="Max capacity">
                  <input type="number" min="1" value={form.capacity} onChange={setNum('capacity')} className={fieldCls} />
                </FormField>
              </div>
              <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-300">
                <strong>Formula preview:</strong> Total = ₦{Number(form.price).toLocaleString()} base
                + ₦{Number(form.hourlyRate).toLocaleString()} × duration (hrs)
                + max(0, guests − {form.baseGuestCount}) × ₦{Number(form.capacityPricePerGuest).toLocaleString()} + services
              </div>
            </div>

            {/* Image */}
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <FormField label="Image URL">
                <input
                  value={form.image}
                  onChange={(e) => { set('image')(e); if (e.target.value) setImageFile(null); }}
                  placeholder="https://example.com/hall.jpg"
                  className={fieldCls}
                />
              </FormField>
              <FormField label="Upload photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setImageFile(f);
                    if (f) setForm((p) => ({ ...p, image: '' }));
                  }}
                  className="file:cursor-pointer file:rounded-full file:border file:border-slate-700 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:text-slate-200"
                />
              </FormField>
            </div>
            {imagePreview && (
              <div className="h-44 overflow-hidden rounded-2xl border border-slate-700">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-500">
                Cancel
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                {editId ? 'Save changes' : 'Create hall'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Halls grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {halls.map((h) => (
          <motion.div
            key={h.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-surface flex flex-col overflow-hidden rounded-2xl"
          >
            {h.image && (
              <div className="h-36 overflow-hidden">
                <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{h.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{h.location} · {h.category}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  {Number(h.rating || 4.5).toFixed(1)}
                </div>
              </div>

              {/* Pricing summary */}
              <div className="mt-3 rounded-xl bg-slate-800/60 p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Base price</span>
                  <span className="font-semibold">₦{Number(h.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hourly rate</span>
                  <span>₦{Number(h.hourlyRate || 0).toLocaleString()}/hr</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Capacity</span>
                  <span>{Number(h.capacity).toLocaleString()} guests</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Extra guest</span>
                  <span>₦{Number(h.capacityPricePerGuest || 0).toLocaleString()}/person</span>
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-4">
                <button
                  onClick={() => startEdit(h)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-600 py-2 text-xs font-semibold text-slate-300 hover:border-blue-500 hover:text-blue-400 transition"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(h.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-600 py-2 text-xs font-semibold text-slate-300 hover:border-rose-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {halls.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-slate-500">No halls yet. Create the first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHalls;
