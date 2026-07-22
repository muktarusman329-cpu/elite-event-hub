import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useToastStore } from '../../store/useToastStore';
import Button from '../../components/ui/Button';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data.users || []));
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x.id !== id));
      pushToast({ type: 'success', message: 'User removed.' });
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Users</h1>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="p-4">name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5 text-slate-300">
                <td className="p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase text-slate-500">
                          {u.name?.slice(0, 2) || 'nA'}
                        </div>
                      )}
                    </div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
                <td className="p-4 text-right">
                  {u.role !== 'admin' && (
                    <Button size="sm" variant="danger" onClick={() => remove(u.id)}>
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
