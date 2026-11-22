'use client';

import { useState } from 'react';
import { updateProfileName } from '@/actions/profile';

interface Props {
  currentName: string | null;
}

export default function ProfileEditor({ currentName }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.set('name', name);

    const res = await updateProfileName(formData);
    setSaving(false);
    if (res.success) {
      setMessage('Name updated.');
      setEditing(false);
    } else {
      setMessage(res.error || 'Failed to update name');
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#163829] tracking-tight">
          {name || 'Registered Guardian'}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline font-semibold cursor-pointer"
        >
          Edit Name
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-200 bg-white rounded-xl px-3 py-1.5 text-sm text-[#163829] focus:outline-emerald-600 shadow-xs"
      />
      <button
        type="submit"
        disabled={saving}
        className="btn-paw-primary rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50 cursor-pointer shadow-xs"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="border border-gray-200 bg-white text-gray-700 rounded-full px-3.5 py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
      >
        Cancel
      </button>
      {message && (
        <span className="text-xs font-medium text-emerald-700 ml-2">
          {message}
        </span>
      )}
    </form>
  );
}
