import { useEffect, useMemo, useState } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePicture || '');
  const [profileFile, setProfileFile] = useState(null);
  const [filePreview, setFilePreview] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    setName(user?.name || '');
    setProfilePictureUrl(user?.profilePicture || '');
    setFilePreview(user?.profilePicture || '');
  }, [user]);

  useEffect(() => {
    if (!profileFile) return;
    const objectUrl = URL.createObjectURL(profileFile);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileFile]);

  const showPreview = useMemo(() => profileFile ? filePreview : profilePictureUrl, [profileFile, profilePictureUrl, filePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    if (!file) return;
    setProfilePictureUrl('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (profileFile) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('profilePicture', profileFile);
        response = await api.patch('/auth/profile', formData);
      } else {
        response = await api.patch('/auth/profile', { name, profilePicture: profilePictureUrl });
      }
      updateUser(response.data.user);
      pushToast({ type: 'success', message: 'Profile updated.' });
      setProfileFile(null);
      setProfilePictureUrl(response.data.user.profilePicture || '');
      setFilePreview(response.data.user.profilePicture || '');
    } catch (err) {
      pushToast({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-white">Profile</h1>
      <form onSubmit={save} className="glass-surface space-y-4 rounded-2xl p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-3xl border border-slate-700 bg-slate-950">
              {showPreview ? (
                <img src={showPreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-400">
                  no image
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-white">Profile photo</p>
              <p className="text-sm text-slate-400">Select a file or paste an image URL to update your avatar.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:cursor-pointer file:rounded-full file:border file:border-slate-700 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:text-slate-200"
              />
            </label>
            <Input
              label="Or image URL"
              value={profilePictureUrl}
              onChange={(e) => {
                setProfilePictureUrl(e.target.value);
                if (profileFile) setProfileFile(null);
              }}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
        <Input label="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" value={user?.email || ''} disabled />
        <Button type="submit" isLoading={saving} disabled={saving}>Save changes</Button>
      </form>
    </div>
  );
}

export default UserProfile;
