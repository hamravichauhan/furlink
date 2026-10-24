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
        <span className="font-display uppercase text-2xl text-[#101124] tracking-tight">
          {name || 'Unnamed Operator'}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#314CB6] hover:underline font-bold cursor-pointer"
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
        className="border-[1.5px] border-[#101124] bg-[#FAF8FC] px-2.5 py-1 font-body text-sm text-[#101124] focus:outline-hidden"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-[#101124] text-[#FAF8FC] border-[1.5px] border-[#101124] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] font-bold hover:bg-[#314CB6] transition-colors disabled:opacity-50 cursor-pointer"
      >
        {saving ? 'Saving...' : 'Commit'}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="border-[1.5px] border-[#101124] bg-white text-[#101124] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-[#FAF8FC] transition-colors cursor-pointer"
      >
        Cancel
      </button>
      {message && (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#314CB6] ml-2">
          {message}
        </span>
      )}
    </form>
  );
}
