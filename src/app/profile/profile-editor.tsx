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
        <span className="font-heading uppercase text-2xl font-black text-[#1A2540] tracking-tight">
          {name || 'Registered Guardian'}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#cc2b3f] hover:underline font-bold cursor-pointer"
        >
          Edit Identity
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
        className="border-2 border-[#1A2540] bg-white rounded-lg px-3 py-1 text-sm text-[#1A2540] focus:outline-hidden"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-[#cc2b3f] text-[#f2e9db] rounded-lg px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] font-bold hover:bg-[#b02435] transition-colors disabled:opacity-50 cursor-pointer"
      >
        {saving ? 'Saving...' : 'Commit'}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="border-2 border-[#1A2540] bg-white text-[#1A2540] rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-[#FAF8FC] transition-colors cursor-pointer"
      >
        Cancel
      </button>
      {message && (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#cc2b3f] font-bold ml-2">
          {message}
        </span>
      )}
    </form>
  );
}
