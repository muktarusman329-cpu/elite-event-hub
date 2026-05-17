import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useToastStore } from '../../store/useToastStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

function AdminHalls() {
  const [halls, setHalls] = useState([]);
  const [form, setForm] = useState({ name: '', capacity: 100, price: 3000, location: '', status: 'Available' });
  const pushToast = useToastStore((s) => s.push);

  const load = () => api.get('/halls').then((r) => setHalls(r.data.halls || []));

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/halls', form);
      pushToast({ type: 'success', message: 'Hall created.' });
      setForm({ name: '', capacity: 100, price: 3000, location: '', status: 'Available' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Failed to create hall.' });
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/halls/${id}`);
      pushToast({ type: 'success', message: 'Hall removed.' });
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Could not delete.' });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Manage halls</h1>
      <form onSubmit={create} className="glass-surface grid gap-4 rounded-2xl p-6 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} />
        <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
        <Button type="submit" className="md:col-span-2">Add hall</Button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {halls.map((h) => (
          <div key={h.id} className="glass-surface rounded-2xl p-5">
            <p className="font-semibold text-white">{h.name}</p>
            <p className="text-sm text-slate-400">{h.location} · {h.capacity} guests · ${h.price}</p>
            <Button size="sm" variant="danger" className="mt-4" onClick={() => remove(h.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHalls;
