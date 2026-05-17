import { useState } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

function UserProfile() {
  const { user, setAuth, token } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const pushToast = useToastStore((s) => s.push);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.patch('/auth/profile', { name });
      setAuth(data.user, token);
      pushToast({ type: 'success', message: 'Profile updated.' });
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-white">Profile</h1>
      <form onSubmit={save} className="glass-surface space-y-4 rounded-2xl p-6">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" value={user?.email || ''} disabled />
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}

export default UserProfile;
